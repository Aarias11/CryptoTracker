import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { WalletLinkConnector } from '@web3-react/walletlink-connector';

const POLLING_INTERVAL = 12000;

export const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42], // Add other chain IDs as needed
});

export const walletconnect = new WalletConnectConnector({
  rpc: { 1: 'https://mainnet.infura.io/v3/b65ca6625ddd46499cf183fc2f6dbca9' }, // Use your Infura project ID
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  pollingInterval: POLLING_INTERVAL,
});

export const walletlink = new WalletLinkConnector({
  url: 'https://mainnet.infura.io/v3/b65ca6625ddd46499cf183fc2f6dbca9', // Use your Infura project ID
  appName: 'web3-react example',
  supportedChainIds: [1, 3, 4, 5, 42], // Add other chain IDs as needed
});
