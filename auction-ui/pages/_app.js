import { Provider } from 'wagmi';

import { providers } from 'ethers';

import '../styles/globals.css';
import networks from '../utils/networks.json';

// Pick chains

const provider = providers.getDefaultProvider(
  networks[networks.selectedChain].rpcUrls[0]
);

function MyApp({ Component, pageProps }) {
  return (
    <Provider autoConnect provider={provider}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
