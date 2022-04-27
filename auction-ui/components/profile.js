import { useAccount, useConnect } from 'wagmi';

function truncateAddress(addr) {
  return `${addr.slice(0, 6)}...${addr.slice(addr.length - 5)}`;
}

export default function Profile() {
  const [{ data: connectData, error: connectError }, connect] = useConnect();
  const { connected } = connectData;
  const [{ data: account }, disconnect] = useAccount();

  // const chainId = chain.polygonMumbai.id;
  const chainId = 1666700000;

  if (connected) {
    // const wrongNetwork = activeChain?.id !== chainId;

    return (
      <button
        onClick={disconnect}
        className="bg-green-500 hover:bg-red-400 text-white font-bold py-2 px-4 border-b-4 border-green-700 hover:border-red-500 rounded m-2"
      >
        <div>
          {/* {wrongNetwork && 'Switch Network'} */}
          {truncateAddress(account?.address)}
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
          {!connector.ready && ' (unsupported)'}
          {/* {isConnecting &&
            connector.id === pendingConnector?.id &&
            ' (connecting)'} */}
        </button>
      ))}

      {connectError && <div>{connectError.message}</div>}
    </div>
  );
}
