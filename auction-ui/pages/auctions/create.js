import Layout from '../../components/layout';
import Form from '../../components/form';
import { useContractWrite, useContractEvent, useSigner } from 'wagmi';
import { contractAddresses } from '../../utils/contracts';
import blindAuctionFactoryAbi from '../../utils/abis/BlindAuctionFactory.json';

export default function CreateAuction() {
  const { data: signer } = useSigner();
  const blindAuctionFactoryAddress = contractAddresses.blindAuctionFactory;
  const [{ data: writeData, loading: writeLoading, error: writeError }, write] =
    useContractWrite(
      {
        addressOrName: blindAuctionFactoryAddress,
        contractInterface: blindAuctionFactoryAbi.abi,
        signerOrProvider: signer,
      },
      'createBlindAuctionProxy'
    );
  // useContractEvent(
  //   {
  //     addressOrName: blindAuctionFactoryAddress,
  //     contractInterface: blindAuctionFactoryAbi.abi,
  //   },
  //   'BlindAuctionCloneCreated',
  //   (event) => console.log(event)
  // );

  const createAuction = async (event) => {
    event.preventDefault(); // don't redirect the page

    const {
      'bid-time': { value: bidTime },
      'reveal-time': { value: revealTime },
      beneficiary: { value: beneficiary },
    } = event.target;
    write({
      args: [bidTime, revealTime, beneficiary],
    });
  };

  return (
    <Layout page="create">
      <h1 className="text-5xl bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500 mb-8">
        Create Auction
      </h1>
      <h2></h2>
      <Form
        createAuction={createAuction}
        auctioneer={signer}
        loading={writeLoading}
      />
      {writeData && (
        <h2 className="text-white"> 🎉 Transaction: {writeData?.hash}</h2>
      )}
    </Layout>
  );
}
