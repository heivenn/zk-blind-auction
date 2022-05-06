# ZK Blind Auction

This project is a proof-of-concept for a blind auction using zero knowledge. Bidders will enter a bid amount, a large random number will be generated as their secret and hashed together with the bid amount and committed to the smart contract. After bidding ends, an auctioneer will collect all secrets and values from bidders and generate a proof using the bid commitments and bidder values to prove they match and get the highest bidder and winning bid amount. Only valid bids will have their deposits returned and count towards the tallying of the highest bid. Finally, only the amount of the highest bid will be revealed.

This was created as a final project for Harmony blockchain's [Zero Knowledge University](https://www.harmonyzku.one/) program in the March-April 2022 cohort.

## Contracts

**BlindAuction.sol** - Keeps a record of all blinded bids, deposits and verifies proofs.

**BlindAuctionFactory.sol** - Creates a clone of a BlindAuction for each auction created.

**HighestBidderVerifier.sol** - Auto-generated from the circuit compilation process.

They are deployed on Harmony mainnet at the addresses shown in `auction-ui/utils/contracts.js`.

## Auction UI

```console
$ yarn && yarn dev
```

It uses next.js, React, Tailwind CSS, and wagmi for interacting with the blockchain.

## Circuits

**highestbidder.circom** - This is used to prove that the revealed secret and value correspond to a blinded bid. In this POC it only accepts 4 bids total. The first .zkey was generated with the [publicly available](https://github.com/chnejohnson/circom-playground#powers-of-tau) ptau28 Power 10 file from Hermez.

The outputs are:

1. The valid highest bid value

2. The valid blinded bid that corresponds to the highest value

3. A bid validity array corresponding to the number of bids, with 0 meaning an invalid bid and 1 meaning a valid bid. This is used to determine who gets their deposit refunded.

4. The blinded bid commitments that are public and also live in the contract.


## Possible Improvements

1. Setup winner payment to use contract winnerPay function.

2. Increase 4 bids to a larger number, calling the circuit with arbitrary zero bids when the limit is not reached.

3. Use PLONK instead of Groth16 to eliminate the need for trusted setup.

4. Implement custody of an item that the winner will receive upon payment, such as an NFT.