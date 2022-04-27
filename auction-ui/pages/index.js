import Link from 'next/link';
import Image from 'next/image';
import Card from '../components/card';
import Layout from '../components/layout';
import minionGavel from '../public/minion-gavel.gif';
import { contractAddresses } from '../utils/contracts';
import blindAuctionFactoryAbi from '../utils/abis/BlindAuctionFactory.json';
import { useAccount, useContract, useProvider, useSigner } from 'wagmi';
import { useState, useEffect } from 'react';

export default function Home() {
  const [auctions, setAuctions] = useState([]);
  const provider = useProvider();
  const [signer] = useSigner();
  const blindAuctionFactoryAddress = contractAddresses.blindAuctionFactory;
  const factoryContract = useContract({
    addressOrName: blindAuctionFactoryAddress,
    contractInterface: blindAuctionFactoryAbi.abi,
    signerOrProvider: signer.data || provider,
  });

  useEffect(() => {
    async function getAllAuctions() {
      const allAuctions = await factoryContract.getAllAuctions();
      setAuctions(allAuctions);
    }
    getAllAuctions();
  }, []);

  return (
    <Layout page="home">
      <h1 className="text-5xl bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500 mb-8">
        ZK Auction House
      </h1>
      <div className="max-w-7xl flex flex-wrap">
        <Link href="/auctions/create">
          <a>
            <Card
              newCard
              imgSrc={minionGavel}
              imgAlt="Minion banging a gavel"
            />
          </a>
        </Link>
        {auctions.map((auctionAddress, index) => (
          <Link href={`/auctions/${index}`}>
            <a>
              <Card
                auctionTitle={`Auction #${index}`}
                address={auctionAddress}
              ></Card>
            </a>
          </Link>
        ))}
      </div>
    </Layout>
  );
}
