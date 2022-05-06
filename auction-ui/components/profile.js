import { useAccount, useConnect, useNetwork } from "wagmi";
import networks from "../utils/networks.json";

function truncateAddress(addr) {
  return `${addr.slice(0, 6)}...${addr.slice(addr.length - 5)}`;
}

export default function Profile() {
  const [{ data: connectData, error: connectError }, connect] = useConnect();
  const { connected } = connectData;
  const [{ data: account }, disconnect] = useAccount();
  const [{ data, error, loading }, switchNetwork] = useNetwork();

  async function changeNetworkOrAddNetwork(chainId) {
    const { error } = await switchNetwork(chainId);
    if (
      error?.value === chainId &&
      error?.code === "INVALID_ARGUMENT" &&
      window.ethereum
    ) {
      // prompt add network then try switching again
      try {
        await ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: `0x${parseInt(networks.selectedChain).toString(16)}`,
              chainName: networks[networks.selectedChain].chainName,
              rpcUrls: networks[networks.selectedChain].rpcUrls,
              nativeCurrency: {
                symbol: networks[networks.selectedChain].nativeCurrency.symbol,
                decimals: 18,
              },
              blockExplorerUrls:
                networks[networks.selectedChain].blockExplorerUrls,
            },
          ],
        });
      } catch (addError) {
        console.log(addError);
      }
    }
  }

  const chainId = networks.selectedChain;

  if (connected) {
    const wrongNetwork = data.chain?.id != chainId;

    return (
      <button
        onClick={
          wrongNetwork ? () => changeNetworkOrAddNetwork(chainId) : disconnect
        }
        className="bg-green-500 hover:bg-red-400 text-white font-bold py-2 px-4 border-b-4 border-green-700 hover:border-red-500 rounded m-2"
      >
        <div>
          {wrongNetwork ? "Switch Network" : truncateAddress(account?.address)}
        </div>
      </button>
    );
  }

  return (
    <div>
      {connectData.connectors.map((connector) => (
        <button
          disabled={!connector.ready}
          key={connector.id}
          onClick={() => connect(connector)}
          className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded m-2"
        >
          {connector.name}
          {!connector.ready && " (unsupported)"}
        </button>
      ))}

      {connectError && <div>{connectError.message}</div>}
    </div>
  );
}
