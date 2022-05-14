import {
  appState,
  Components,
  hooks,
  ReefSigner,
} from '@reef-defi/react-lib';
import React, { useContext } from 'react';
import { Provider } from '@reef-defi/evm-provider';
import TokenContext from '../../context/TokenContext';
import { notify } from '../../utils/utils';

const { Send } = Components;

export const Transfer = (): JSX.Element => {
  const provider: Provider|undefined = hooks.useObservableState(appState.providerSubj);
  const accounts: ReefSigner[]|undefined = hooks.useObservableState(appState.signers$);
  const selectedSigner: ReefSigner|undefined = hooks.useObservableState(appState.selectedSigner$);
  const tokens = useContext(TokenContext);

  if (!accounts || !selectedSigner || !provider) {
    return <div />;
  }

  console.log('Transfer:', { accounts, selectedSigner, tokens });

  return (
    <Send
      notify={notify}
      accounts={accounts}
      provider={provider}
      signer={selectedSigner}
      tokens={tokens.filter(({ balance }) => balance.gt(0))}
    />
  );
};
