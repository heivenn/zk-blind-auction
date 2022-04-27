// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "hardhat/console.sol";

// highest bidder circuit verifier contract
interface IVerifier {
    function verifyProof(
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[10] memory input
    ) external view returns (bool);
}

contract BlindAuction is Initializable {
    // 3 days time limit for winner to pay = 259200
    uint256 public constant THREE_DAYS = 3 * 24 * 60 * 60;

    uint256 public constant DEPOSIT_AMOUNT = 1 ether;

    uint8 public constant MAX_BIDS = 4;

    // contract address of our circuit verifier
    address public verifierContractAddress;

    // seller's address
    address payable public beneficiary;
    // trusted auctioneer who will receive all bid secret values to and call 'getHighestBidder' at revealEnd
    address public auctioneer;
    // bids are over, all bidders have to reveal their secret values
    uint256 public biddingEnd;
    // reveal of secrets period has ended. any bidder that did not reveal or provides incorrect secret values will forfeit their deposit
    uint256 public revealEnd;
    uint256 public paymentEnd;
    // signifies auction has ended, prevents auctionEnd from being called again
    bool public ended;
    bool public winnerPaid;

    // keeps track of all bidder deposits: bidder address => deposit amount
    mapping(address => uint256) public deposits;

    // blindedbids => bidders
    mapping(bytes32 => address) public hashedBidsToBidders;

    // keeps track of all blinded bids that will be retrieved by auctioneer
    bytes32[] public bids;

    address public highestBidder;
    uint256 public highestBid;

    event AuctionEnded(address winner, uint256 highestBid);

    event WinnerPaid(address highestBidder);

    // Errors that describe failures.

    /// The function has been called too early.
    /// Try again at `time`.
    error TooEarly(uint256 time);
    /// The function has been called too late.
    /// It cannot be called after `time`.
    error TooLate(uint256 time);
    /// The function auctionEnd has already been called.
    error AuctionEndAlreadyCalled();
    // The function can only be called by the auctioneer address
    error OnlyAuctioneer();
    // Only the winner can call this function to pay their bid
    error OnlyWinner();

    // Modifiers are a convenient way to validate inputs to
    // functions. `onlyBefore` is applied to `bid` below:
    // The new function body is the modifier's body where
    // `_` is replaced by the old function body.
    modifier onlyBefore(uint256 time) {
        if (block.timestamp >= time) revert TooLate(time);
        _;
    }
    modifier onlyAfter(uint256 time) {
        if (block.timestamp <= time) revert TooEarly(time);
        _;
    }
    modifier onlyAuctioneer() {
        if (msg.sender != auctioneer) revert OnlyAuctioneer();
        _;
    }

    // constructor(
    //     address _verifierAddress,
    //     uint256 _biddingTime,
    //     uint256 _revealTime,
    //     address payable _beneficiaryAddress
    // ) {
    //     auctioneer = msg.sender;
    //     verifierContractAddress = _verifierAddress;
    //     beneficiary = _beneficiaryAddress;
    //     biddingEnd = block.timestamp + _biddingTime;
    //     revealEnd = biddingEnd + _revealTime;
    //     paymentEnd = revealEnd + THREE_DAYS; // 3 days to pay
    // }

    function initialize(
        address _auctioneer,
        address _verifierAddress,
        uint256 _biddingTime,
        uint256 _revealTime,
        address payable _beneficiaryAddress
    ) public initializer {
        auctioneer = _auctioneer;
        verifierContractAddress = _verifierAddress;
        beneficiary = _beneficiaryAddress;
        biddingEnd = block.timestamp + _biddingTime;
        revealEnd = biddingEnd + _revealTime;
        paymentEnd = revealEnd + THREE_DAYS; // 3 days to pay
    }

    function verifyProof(
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[10] memory input
    ) public view onlyAuctioneer returns (bool) {
        return IVerifier(verifierContractAddress).verifyProof(a, b, c, input);
    }

    /// Place a blinded bid with `blindedBid` =
    /// Poseidon(value, secret, address))
    /// The sent ether is only refunded if the bid is correctly
    /// revealed in the revealing phase. One bid per address
    function bid(bytes32 blindedBid) external payable {
        // require deposits[msg.sender] doesn't already exist
        // require that deposit meets auction deposit requirement
        require(bids.length < MAX_BIDS, "max bids reached");
        require(msg.value == DEPOSIT_AMOUNT, "deposit must be 1 ether");
        require(deposits[msg.sender] == 0, "only one bid per address");

        deposits[msg.sender] = msg.value;
        hashedBidsToBidders[blindedBid] = msg.sender;
        bids.push(blindedBid);
    }

    /**
     * Auctioneer will call this to getHighestBidder. restrict it to a certain address.
     * input: highestBidValue, highestBlindedBid, bidsWithValidityStatus[totalBids], blindedBids[totalBids]
     * cross-reference validity status with blindedBids using same position
     */
    function getHighestBidder(
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[10] memory input
    ) external onlyAuctioneer {
        // check that bids correspond to blindedBids in input values
        for (uint256 i = 0; i < bids.length; i++) {
            require(
                bytes32(input[i + 2 + bids.length]) == bids[i],
                "blindedBids inputs to proof do not match auction blinded bids"
            );
        }

        require(highestBidder == address(0), "bids were already tallied");
        // run verify proof
        require(verifyProof(a, b, c, input) == true, "proof is not valid");
        highestBid = input[0] * 1 ether; // convert to ether
        highestBidder = hashedBidsToBidders[bytes32(input[1])];

        // for all refundable deposits, refund the bidder
        // if there are 4 bids, there will be 4+2 inputs.  i < (10-4)
        // i is going through the validity status of all bids which would be from input[2] to input[2+ bids.length]
        for (uint256 i = 2; i < input.length - bids.length; i++) {
            address bidder = hashedBidsToBidders[
                bytes32(input[i + bids.length])
            ];
            // refund valid bids that were not the winner and had valid deposits
            if (
                deposits[bidder] > 0 && bidder != highestBidder && input[i] == 1
            ) {
                uint256 toRefund = deposits[bidder];
                deposits[bidder] = 0;
                payable(bidder).transfer(toRefund);
            }
        }
    }

    function getBids()
        external
        view
        onlyAfter(biddingEnd)
        returns (bytes32[] memory)
    {
        return bids;
    }

    // for bid winner to pay
    function winnerPay() external payable onlyAfter(revealEnd) {
        if (msg.sender != highestBidder) revert OnlyWinner();
        require(
            msg.value == highestBid - deposits[highestBidder],
            "insufficient payment"
        );
        winnerPaid = true;
        emit WinnerPaid(highestBidder);
        // send item to winner
    }

    /// End the auction and send the highest bid
    /// to the beneficiary.
    function auctionEnd() external onlyAfter(paymentEnd) onlyAuctioneer {
        if (ended) revert AuctionEndAlreadyCalled();
        emit AuctionEnded(highestBidder, highestBid);
        ended = true;
        if (winnerPaid == true) {
            beneficiary.transfer(highestBid);
        } else {
            // pay the seller the winner deposit
            beneficiary.transfer(deposits[highestBidder]);
        }
    }
}
