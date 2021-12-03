import {
  Components, hooks as reefHooks, TokenWithAmount, utils as reefUtils,
} from '@reef-defi/react-lib';
import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../store';
import { TransferComponent } from './TransferComponent';
import { useGetSigner } from '../../hooks/useGetSigner';
import { currentNetwork } from '../../environment';

const {
  isDataSet,
  getData,
  DataProgress,
} = reefUtils;

const { useLoadSignerTokens, useReefPriceInterval, useSignerTokenBalances } = reefHooks;
const { Loading } = Components;

export const Transfer = (): JSX.Element => {
  const { pools } = useAppSelector((state) => state.pools);
  const selectedSigner = useGetSigner();
  const signerTokens = useLoadSignerTokens(false, currentNetwork, selectedSigner);
  const reefPrice = useReefPriceInterval(60000);
  const signerTokenBalances = useSignerTokenBalances(signerTokens, pools, reefPrice);
  const [token, setToken] = useState<reefUtils.DataWithProgress<TokenWithAmount>>(DataProgress.LOADING);

  useEffect(() => {
    if (isDataSet(signerTokenBalances)) {
      const sigTokens = getData(signerTokenBalances);
      if (!sigTokens?.length) {
        setToken(DataProgress.NO_DATA);
        return;
      }
      const signerTokenBalance = sigTokens ? sigTokens[0] : undefined;
      if (signerTokenBalance && isDataSet(signerTokenBalance.balanceValue)) {
        const tkn = { ...signerTokenBalance, amount: '', isEmpty: false } as TokenWithAmount;
        setToken(tkn);
        return;
      }
      if (!isDataSet(signerTokenBalance?.balanceValue) && isDataSet(signerTokens)) {
        const sTkns = getData(signerTokens);
        const sToken = sTkns ? sTkns[0] : undefined;
        if (sToken) {
          const tkn = { ...sToken, amount: '', isEmpty: false } as TokenWithAmount;
          setToken(tkn);
        }
        return;
      }
      setToken(signerTokenBalance?.balanceValue as reefUtils.DataProgress);
      return;
    }
    setToken(signerTokenBalances as reefUtils.DataProgress);
  }, [signerTokenBalances, signerTokens]);

  return (
    <>
      {!isDataSet(token) && token === DataProgress.LOADING && <Loading.Loading />}
      {!isDataSet(token) && token === DataProgress.NO_DATA && <div>No tokens for transaction.</div>}
      { isDataSet(token) && isDataSet(signerTokenBalances) && selectedSigner
          && <TransferComponent tokens={signerTokenBalances as reefHooks.TokenWithPrice[]} from={selectedSigner} token={token as TokenWithAmount} />}
    </>
  );
};
