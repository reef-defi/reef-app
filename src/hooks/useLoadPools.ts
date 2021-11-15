import { utils, hooks, rpc } from '@reef-defi/react-lib';
import { setPools, setPoolsLoading } from '../store/actions/pools';
import { useAppDispatch, useAppSelector } from '../store';
import { useGetSigner } from './useGetSigner';
import { currentNetwork } from '../environment';

const { loadPools } = rpc;
const { useAsyncEffect } = hooks;
const { availableReefNetworks } = utils;

export const useLoadPools = (): void => {
  const signer = useGetSigner();
  const dispatch = useAppDispatch();
  const { tokens } = useAppSelector((state) => state.tokens);
  const { reloadToggle } = useAppSelector((state) => state.pools);

  useAsyncEffect(async () => {
    if (!signer) { return; }

    await Promise.resolve()
      .then(() => dispatch(setPoolsLoading(true)))
      .then(() => loadPools(tokens, signer.signer, currentNetwork.factoryAddress))
      .then((pools) => dispatch(setPools(pools)))
      .catch((error) => console.error('load pools err=', error))
      .finally(() => dispatch(setPoolsLoading(false)));
  }, [reloadToggle]);
};
