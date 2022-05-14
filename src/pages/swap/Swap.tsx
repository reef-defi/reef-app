import React, { useContext } from 'react';

import {
  appState, Components, hooks, Network, ReefSigner, Token, TokenSelector,
} from '@reef-defi/react-lib';
import { useHistory, useParams } from 'react-router-dom';
import { useTokensFinder } from '../../hooks/useTokensFinder';
import { addressReplacer, SPECIFIED_SWAP_URL, UrlAddressParams } from '../../urls';
import { notify } from '../../utils/utils';
import TokenContext from '../../context/TokenContext';

const { SwapComponent } = Components;

const Swap = (): JSX.Element => {
  const history = useHistory();
  const tokens = useContext(TokenContext);
  const network: Network|undefined = hooks.useObservableState(appState.selectedNetworkSubj);
  const signer: ReefSigner|undefined = hooks.useObservableState(appState.selectedSigner$);

  const { address1, address2 } = useParams<UrlAddressParams>();

  console.log(address1, address2);

  const [token1, token2, state] = useTokensFinder({
    address1,
    address2,
    tokens,
    signer,
  });

  const onTokenSelect = (address: string, token: TokenSelector = 'token1'): void => history.push(
    token === 'token1'
      ? addressReplacer(SPECIFIED_SWAP_URL, address, address2)
      : addressReplacer(SPECIFIED_SWAP_URL, address1, address),
  );

  if (state !== 'Success' || !network || !signer) {
    return <div />;
  }

  return (
    <SwapComponent
      buyToken={token2}
      sellToken={token1}
      tokens={tokens}
      account={signer}
      network={{ ...network }}
      options={{
        notify,
        onTokenSelect,
      }}
    />
  );
};

export default Swap;
