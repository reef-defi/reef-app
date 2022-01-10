import React from 'react';

import { Components } from '@reef-defi/react-lib';
import { useHistory } from 'react-router-dom';
import { ADD_LIQUIDITY_URL, REMOVE_LIQUIDITY_URL } from '../../urls';
import { useObservableState } from '../../hooks/useObservableState';
import { pools$ } from '../../state/tokenState';

const Pools = (): JSX.Element => {
  const history = useHistory();
  const pools = useObservableState(pools$);

  const openAddLiquidity = (): void => history.push(ADD_LIQUIDITY_URL);
  const openRemoveLiquidity = (address1: string, address2: string): void => history.push(
    REMOVE_LIQUIDITY_URL
      .replace(':address1', address1)
      .replace(':address2', address2),
  );

  return (
    <Components.PoolsComponent
      pools={pools || []}
      isLoading={!pools}
      openAddLiquidity={openAddLiquidity}
      openRemoveLiquidity={openRemoveLiquidity}
    />
  );
};

export default Pools;
