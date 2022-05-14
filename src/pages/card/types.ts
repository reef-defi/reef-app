import {
  Network,
  Token,
  TokenWithAmount,
  ReefSigner,
} from '@reef-defi/react-lib';
import { TxStatusHandler } from '@reef-defi/react-lib/dist/utils';

export interface CardComponentTypes {
  tokens: Token[];
  account: ReefSigner;
  currentAccount: ReefSigner;
}

export interface CardInputHolderTypes {
  buy: TokenWithAmount;
  sell: TokenWithAmount;
  tokens: Token[];
  account: ReefSigner;
  currentAccount: ReefSigner;
  accounts: ReefSigner[];
}
