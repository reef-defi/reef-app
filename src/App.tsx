import React from 'react';
import {appState, graphql, hooks, ReefSigner,} from '@reef-defi/react-lib';
import ContentRouter from './pages/ContentRouter';
import Nav from './common/Nav';
import NoExtension from "./pages/error/NoExtension"
import NoAccount from "./pages/error/NoAccount"
import {innitialNetwork} from './environment';

const App = (): JSX.Element => {
  const [signers, provider, selectedNetwork, loading, error]=hooks.useInitReefState( 'Reef Wallet App', innitialNetwork, undefined, null );
  const currentSigner: ReefSigner|undefined = hooks.useObservableState(appState.selectedSigner$);
  const apollo = hooks.useObservableState(graphql.apolloClientInstance$);
  hooks.useBindEvmAddressAlert(currentSigner, provider);

  return (
    <>
      {apollo && (
      <div className="App d-flex w-100 h-100">
        <div className="w-100 main-content">
          {!loading && !error && (
            <>
              <Nav display={!loading && !error} />
              <ContentRouter />
            </>
          )}

          {error?.code === 1 && <NoExtension />}
          {error?.code === 2 && <NoAccount />}
        </div>
      </div>
      )}
    </>
  );
};

export default App;
