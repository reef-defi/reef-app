import React, { useContext } from 'react';

import {
  appState,
  hooks,
  ReefSigner,
} from '@reef-defi/react-lib';
import CardComponent from './CardComponent';
import TokenContext from '../../context/TokenContext';

const CardPage: React.FC = () => {
  const signer: ReefSigner|undefined = hooks.useObservableState(appState.selectedSigner$);
  const tokens = useContext(TokenContext);

  const currentAccount: ReefSigner | undefined = hooks.useObservableState(
    appState.selectedSigner$,
  ) as ReefSigner;

  if (!tokens || !signer || !currentAccount) {
    return <div>Loading...</div>;
  }

  return (
    <CardComponent
      tokens={tokens.filter(({ balance }) => balance.gt(0))}
      account={signer}
      currentAccount={currentAccount}
    />
  );
};

export default CardPage;
