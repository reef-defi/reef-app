import {
  Network,
  Token,
  TokenWithAmount,
  ReefSigner,
} from '@reef-defi/react-lib';
import { TxStatusHandler } from '@reef-defi/react-lib/dist/utils';

export interface CardComponentTypes {
  tokens: Token[];
  buyToken: TokenWithAmount;
  sellToken: TokenWithAmount;
  network: Network;
  account: ReefSigner;
  accounts: ReefSigner[];
  currentAccount: ReefSigner;
  onTxUpdate?: TxStatusHandler;
}

export interface CardInputHolderTypes {
  buy: TokenWithAmount;
  sell: TokenWithAmount;
  tokens: Token[];
  account: ReefSigner;
  currentAccount: ReefSigner;
  accounts: ReefSigner[];
}
