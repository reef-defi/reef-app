import React from 'react';
import { appState, graphql, hooks } from '@reef-defi/react-lib';
import ContentRouter from './pages/ContentRouter';
import Nav from './common/Nav';
import { currentNetwork } from './environment';

const App = (): JSX.Element => {
  const provider = hooks.useObservableState(appState.providerSubj);
  const [signers, loading, error] = hooks.useLoadSigners('Reef App', provider);
  hooks.useInitReefState(signers, currentNetwork);

  const currentSigner = hooks.useObservableState(appState.selectedSigner$);
  const apollo = hooks.useObservableState(graphql.apolloClientInstance$);
  hooks.useBindEvmAddressAlert(currentSigner, provider);

  return (
    <>
      {apollo && (
      <div className="App d-flex w-100 h-100">
        <div className="w-100 main-content">
          <Nav display={!loading && !error} />
          {!loading && !error && (<ContentRouter />)}
          {error && (
          <div className="m-5">
            <p>
              {error.message}
              {' '}
              {error.url && <a href={error.url} target="_blank" rel="noreferrer">Click here to continue.</a>}
            </p>
          </div>
          )}
        </div>
      </div>
      )}
    </>
  );
};

export default App;
