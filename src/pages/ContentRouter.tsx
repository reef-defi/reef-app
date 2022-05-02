import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { ApolloClient } from '@apollo/client';
import {
  ReefSigner, graphql, hooks, appState,
} from '@reef-defi/react-lib';
import {
  ADD_LIQUIDITY_URL,
  CREATE_ERC20_TOKEN_URL,
  DASHBOARD_URL,
  POOLS_URL,
  REMOVE_LIQUIDITY_URL,
  TRANSFER_TOKEN,
  BONDS_URL,
  POOL_CHART_URL,
  CARD_URL,
  SPECIFIED_SWAP_URL,
} from '../urls';
import AddLiqudity from './pools/AddLiquidity';
import Pools from './pools/Pools';
import RemoveLiquidity from './pools/RemoveLiquidity';
import Swap from './swap/Swap';
import Dashboard from './dashboard/Dashboard';
import { Transfer } from './transfer/Transfer';
import { Creator } from './creator/Creator';
import { Bonds } from './bonds/Bonds';
import PoolPage from './pools/PoolPage';
import TokenContext from '../context/TokenContext';
import CardPage from './card/CardPage';

const ContentRouter = (): JSX.Element => {
  const currentSigner: ReefSigner|undefined = hooks.useObservableState(appState.selectedSigner$);
  const apollo: ApolloClient<any>|undefined = hooks.useObservableState(graphql.apolloClientInstance$);
  // Its not appropriet to have token state in this component, but the problem was apollo client.
  // Once its decared properlly in App move TokenContext in the parent component (App.tsx)
  const tokens = hooks.useAllTokens(currentSigner?.address, apollo);

  return (
    <div className="content">
      <TokenContext.Provider value={tokens}>
        <Switch>
          <Route path={SPECIFIED_SWAP_URL} component={Swap} />
          <Route exact path={POOLS_URL} component={Pools} />
          <Route exact path={CARD_URL} component={CardPage} />
          <Route exact path={DASHBOARD_URL} component={Dashboard} />
          <Route path={ADD_LIQUIDITY_URL} component={AddLiqudity} />
          <Route exact path={ADD_LIQUIDITY_URL} component={AddLiqudity} />
          <Route path={POOL_CHART_URL} component={PoolPage} />
          <Route path={REMOVE_LIQUIDITY_URL} component={RemoveLiquidity} />
          <Route exact path={TRANSFER_TOKEN} component={Transfer} />
          <Route exact path={CREATE_ERC20_TOKEN_URL} component={Creator} />
          <Route exact path={BONDS_URL} component={Bonds} />
          <Route path="/" render={() => (<Redirect to={DASHBOARD_URL} />)} />
        </Switch>
      </TokenContext.Provider>
    </div>
  );
};

export default ContentRouter;
