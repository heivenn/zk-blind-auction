import Layout from '../../components/layout';
import { useRouter } from 'next/router';
import { ethers } from 'ethers';
import { buildPoseidonOpt as buildPoseidon } from 'circomlibjs';
import AuctionDetails from '../../components/auction-details';
import { generateVerifierCalldata } from '../../zk/highest_bidder_proof';
import {
  useContract,
  useContractRead,
  useContractWrite,
  useProvider,
  useSigner,
} from 'wagmi';

import { contractAddresses } from '../../utils/contracts';
import blindAuctionFactoryAbi from '../../utils/abis/BlindAuctionFactory.json';
import blindAuctionAbi from '../../utils/abis/BlindAuction.json';
import { useEffect, useState, useRef } from 'react';

/**
 * Generates a random big number.
 * @param numberOfBytes The number of bytes of the number.
 * @returns The generated random number.
 */
export function genRandomNumber(numberOfBytes = 31) {
  return ethers.BigNumber.from(
    ethers.utils.randomBytes(numberOfBytes)
  ).toBigInt();
}

const witnessInputs = {
  blindedBids: [
    '0x1bef7cdd7e3bf88ddfef2257b97f2131adae3a5776b47d13586858185ef5f3df',
    '0x1c62d7c545b609d53fe210a00f785edeef7442c33ea2aafc6437a096dc22821c',
    '0x0b5898ceee69fc2e0e924f307b92c1fcc16420c32f47c5cb72dd2cc52e3cec0f',
    '0x2f1345472d2120ee140c42a8a73eaa1fbf56ac19e3ff14156af7f19e6accfb2f',
  ],
  bids: [
    [
      '3',
      '4390288406633841039374905140997088596816213696357408910893002029934783691',
    ],
    [
      '6',
      '425744023157111131062054548477432108186780490046799368572579595744705568174',
    ],
    [
      '2',
      '435168916971332117746148190886796251054477518570929335324154158232639029895',
    ],
    [
      '5',
      '305426238497509460922354612122454773243230993719084718458819055507992229935',
    ],
  ],
};

const witnessPlaceholder = JSON.stringify(witnessInputs);

export default function Auction() {
  const [parseError, setParseError] = useState('');
  const [secret, setSecret] = useState(undefined);
  const [winner, setWinner] = useState(undefined);
  const [auction, setAuction] = useState(undefined);
  const inputRef = useRef(null);
  const witnessRef = useRef(null);

  const router = useRouter();
  const { id } = router.query;

  const provider = useProvider();
  const [signer] = useSigner();

  const blindAuctionFactoryAddress = contractAddresses.blindAuctionFactory;

  const factoryContract = useContract({
    addressOrName: blindAuctionFactoryAddress,
    contractInterface: blindAuctionFactoryAbi.abi,
    signerOrProvider: signer.data || provider,
  });

  const [{ data: beneficiary }, readBeneficiary] = useContractRead(
    {
      addressOrName: auction || '',
      contractInterface: blindAuctionAbi.abi,
      signerOrProvider: signer.data || provider,
    },
    'beneficiary',
    { skip: true }
  );

  const [{ data: auctioneer }, readAuctioneer] = useContractRead(
    {
      addressOrName: auction || '',
      contractInterface: blindAuctionAbi.abi,
      signerOrProvider: signer.data || provider,
    },
    'auctioneer',
    { skip: true }
  );

  const [{ data: bidData, error: bidError, loading: bidLoading }, bid] =
    useContractWrite(
      {
        addressOrName: auction || '',
        contractInterface: blindAuctionAbi.abi,
        signerOrProvider: signer.data || provider,
      },
      'bid'
    );

  const [
    { data: highestBidder, error: highestError, loading: highestLoading },
    getHighestBidder,
  ] = useContractWrite(
    {
      addressOrName: auction || '',
      contractInterface: blindAuctionAbi.abi,
      signerOrProvider: signer.data || provider,
    },
    'getHighestBidder'
  );

  const [{ data: bids, error: bidsError, loading: bidsLoading }, getBids] =
    useContractRead(
      {
        addressOrName: auction || '',
        contractInterface: blindAuctionAbi.abi,
        signerOrProvider: signer.data || provider,
      },
      'getBids',
      { skip: true }
    );
  const [{ data: winnerAddress }, readWinnerAddress] = useContractRead(
    {
      addressOrName: auction || '',
      contractInterface: blindAuctionAbi.abi,
      signerOrProvider: signer.data || provider,
    },
    'highestBidder'
  );
  const [{ data: winningBid }, readWinnerBid] = useContractRead(
    {
      addressOrName: auction || '',
      contractInterface: blindAuctionAbi.abi,
      signerOrProvider: signer.data || provider,
    },
    'highestBid'
  );

  useEffect(() => {
    if (id) {
      async function getAuctionById() {
        const address = await factoryContract.getAuctionById(id);
        setAuction(address);
      }
      getAuctionById();
    }
  }, [id]);

  useEffect(() => {
    if (auction) {
      async function getAuctionDetails() {
        readBeneficiary();
        readAuctioneer();
        readWinnerAddress();
        readWinnerBid();
      }
      getAuctionDetails();
    }
  }, [auction]);

  useEffect(() => {
    if (winnerAddress !== ethers.constants.AddressZero) {
      setWinner(winnerAddress);
    }
  }, [winnerAddress]);

  const handleBid = async () => {
    if (auction) {
      const amount = parseInt(inputRef.current.value);
      if (Number.isInteger(amount)) {
        const bidAmount = ethers.utils.parseEther(amount.toString());
        if (bidAmount.gt(0)) {
          const poseidon = await buildPoseidon();
          const blindingNumber = genRandomNumber();
          setSecret(blindingNumber.toString());
          console.log('secret:', blindingNumber);
          // Poseidon (amount, blindingNumber)
          const blindedBid = ethers.BigNumber.from(
            poseidon.F.toString(poseidon([amount, blindingNumber]))
          );
          console.log(
            'blindedBid: Poseidon (blindingNumber, bidAmount)',
            blindedBid.toString()
          );
          const deposit = ethers.utils.parseEther('1');
          bid({
            args: blindedBid.toHexString(),
            overrides: { value: deposit },
          });
        }
      }
    }
  };

  const handleWitness = async () => {
    try {
      const witness = JSON.parse(witnessRef?.current?.value);
      if (witness) {
        setParseError('');
        const callData = await generateVerifierCalldata(witness);
        if (!callData) {
          console.log('invalid inputs to generate witness');
        }
        // console.log('calldata', callData);
        const [a, b, c, input] = callData;
        if (input[0] === '0' || input[1] === '0') {
          setParseError(
            'There is no winner, either because all bids are invalid or because of wrong inputs.'
          );
          return;
        }
        getHighestBidder({
          args: [a, b, c, input],
        });
      }
    } catch (err) {
      setParseError(err.toString());
      console.log(err);
    }
  };

  const loading = !provider;

  return (
    <Layout>
      <h1 className="text-5xl bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500 mb-8">
        Auction Details
      </h1>
      {!loading && (
        <AuctionDetails
          auctionContract={auction}
          beneficiary={beneficiary}
          auctioneer={auctioneer}
          // bidEnd={}
          // revealEnd={}
          // paymentEnd={}
          secret={secret}
          winner={winner}
          winningBid={winningBid}
          inputRef={inputRef}
          handleBid={handleBid}
          bidLoading={bidLoading}
          bidData={bidData}
          bids={bids}
          getBids={getBids}
          bidsLoading={bidsLoading}
          witnessRef={witnessRef}
          witnessPlaceholder={witnessPlaceholder}
          highestLoading={highestLoading}
          parseError={parseError}
          handleWitness={handleWitness}
        ></AuctionDetails>
      )}
    </Layout>
  );
}
