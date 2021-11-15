import React from 'react';
import { availableNetworks, hooks } from '@reef-defi/react-lib';
import Sidebar from './common/Sidebar';
import Nav from './common/Nav';
import ContentRouter from './pages/ContentRouter';
import { useLoadSigners } from './hooks/useLoadSigners';
import { useLoadTokens } from './hooks/useLoadTokens';
import { useLoadPools } from './hooks/useLoadPools';
import { currentNetwork } from './environment';

const { useProvider } = hooks;

const App = (): JSX.Element => {
  const [provider, isProviderLoading, providerError] = useProvider(currentNetwork.rpcUrl);
  useLoadSigners(provider);
  useLoadTokens();
  useLoadPools();

  return (
    <div className="App d-flex w-100 h-100">
      {/* <Sidebar /> */}
      <div className="w-100 main-content">
        <Nav />
        <ContentRouter />
      </div>
    </div>
  );
};

export default App;
