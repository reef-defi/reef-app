import { ReefSigner, Token } from '@reef-defi/react-lib';
import {
  SELECT_SIGNER_ACTION,
  SET_SIGNER_BALANCE_ACTION,
  SET_SIGNER_TOKENS_ACTION,
  SET_SIGNERS_ACTION,
  SET_SIGNERS_LOADING,
} from '../actionCreator';
import { SignersActions } from '../actions/signers';

interface SignersReducer {
  accounts: ReefSigner[];
  selectedAccount: number;
  isLoading: boolean;
  balance: string;
}

const defaultState: SignersReducer = {
  accounts: [],
  isLoading: false,
  selectedAccount: -1,
  balance: '- REEF',
};

export default (state = defaultState, action: SignersActions): SignersReducer => {
  switch (action.type) {
    case SELECT_SIGNER_ACTION: return { ...state, selectedAccount: action.index };
    case SET_SIGNERS_ACTION: return { ...state, accounts: [...action.signers] };
    case SET_SIGNER_BALANCE_ACTION: return { ...state, balance: action.balance };
    case SET_SIGNERS_LOADING: return { ...state, isLoading: action.loading };
    default: return state;
  }
};
