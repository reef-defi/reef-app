import React from 'react';

import {
  appState,
  hooks,
  Network,
  ReefSigner,
  Token,
} from '@reef-defi/react-lib';
import { useParams } from 'react-router-dom';
import { useTokensFinder } from '../../hooks/useTokensFinder';
import { UrlAddressParams } from '../../urls';
import CardComponent from './CardComponent';

const CardPage: React.FC = () => {
  const network: Network | undefined = hooks.useObservableState(
    appState.selectedNetworkSubj,
  );
  const signer: ReefSigner | undefined = hooks.useObservableState(
    appState.selectedSigner$,
  );
  const tokens: Token[] | undefined = hooks.useObservableState(
    appState.allAvailableSignerTokens$,
  );

  const accounts: ReefSigner[] | undefined = hooks.useObservableState(
    appState.signers$,
  );

  const currentAccount: ReefSigner | undefined = hooks.useObservableState(
    appState.selectedSigner$,
  ) as ReefSigner;

  const { address1, address2 } = useParams<UrlAddressParams>();

  const [token1, token2, state] = useTokensFinder({
    address1,
    address2,
    tokens,
    signer,
  });

  if (state !== 'Success' || !network || !signer) {
    return <div>Loading...</div>;
  }

  return (
    <CardComponent
      buyToken={token2}
      sellToken={token1}
      tokens={tokens || []}
      accounts={accounts || []}
      account={signer}
      network={{ ...network }}
      currentAccount={currentAccount}
    />
  );
};

export default CardPage;
