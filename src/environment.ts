import { availableNetworks, Network } from '@reef-defi/react-lib';

export const innitialNetwork: Network = {
  ...availableNetworks.mainnet,
  // genesisHash: availableNetworks.testnet.genesisHash,
};
