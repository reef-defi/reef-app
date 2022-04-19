import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import { Components } from '@reef-defi/react-lib';
import { BigNumber } from 'ethers';
import { formatAmount, getIconUrl } from '../../utils/utils';
import PoolTransactions from './PoolTransactions';
import { AddressVar, PoolData } from './poolTypes';
import PoolInfo from './PoolInfo';
import { ADD_LIQUIDITY_URL, REMOVE_LIQUIDITY_URL, SWAP_URL } from '../../urls';
import ChartSelector from './charts/ChartSelector';
import { BasicPoolInfo } from './charts/types';
import './Pool.css';

const { BoldText, LeadText } = Components.Text;

interface UrlParam {
  address: string;
}

interface Reserves {
  reserved_1: number;
  reserved_2: number;
  total_supply: number;
}

type PoolQuery = { pool: PoolData[] }
type ReservesQuery = { pool_event: Reserves[] }

const POOL_GQL = gql`
query pool($address: String!) {
  pool(
    where: { address: { _ilike: $address } }
  ) {
    id
    address
    token_contract_1 {
      verified_contract {
        contract_data
      }
      address
    }
    token_contract_2 {
      verified_contract {
        contract_data
      }
      address
    }
  }
}
`;

const POOL_RESERVES_SUBSCRIPTION_GQL = gql`
query pool_event($address: String!) {
  pool_event(
    where: {
      pool: { address: {_ilike: $address } }
      type: { _eq: "Sync" }
    }
    order_by: { timestamp: desc }
    limit: 1
  ) {
    reserved_1
    reserved_2
  }
}
`;

const PoolPage = (): JSX.Element => {
  const history = useHistory();
  const { address } = useParams<UrlParam>();

  const { loading: loadingPool, data: poolData } = useQuery<PoolQuery, AddressVar>(
    POOL_GQL,
    { variables: { address } },
  );
  const { data: reservesData } = useQuery<ReservesQuery, AddressVar>(
    POOL_RESERVES_SUBSCRIPTION_GQL,
    { variables: { address } },
  );

  // Token info
  const poolExists = poolData && poolData.pool.length > 0;
  const tokenAddress1 = poolExists
    ? poolData.pool[0].token_contract_1.address
    : '0x';
  const tokenAddress2 = poolExists
    ? poolData.pool[0].token_contract_2.address
    : '0x';
  const tokenSymbol1 = poolExists && poolData.pool[0].token_contract_1.verified_contract
    ? poolData.pool[0].token_contract_1.verified_contract.contract_data.symbol
    : '?';
  const tokenSymbol2 = poolExists && poolData.pool[0].token_contract_2.verified_contract
    ? poolData.pool[0].token_contract_2.verified_contract.contract_data.symbol
    : '?';
  const tokenIcon1 = poolExists
    ? getIconUrl(tokenAddress1)
    : '';
  const tokenIcon2 = poolExists
    ? getIconUrl(tokenAddress2)
    : '';

  const decimal1 = poolExists && poolData.pool[0].token_contract_1.verified_contract
    ? poolData.pool[0].token_contract_1.verified_contract.contract_data.decimals
    : 18;
  const decimal2 = poolExists && poolData.pool[0].token_contract_2.verified_contract
    ? poolData.pool[0].token_contract_2.verified_contract.contract_data.decimals
    : 18;

  const poolInfo: BasicPoolInfo = {
    address,
    decimal1,
    decimal2,
    symbol1: tokenSymbol1,
    symbol2: tokenSymbol2,
    address1: tokenAddress1,
    address2: tokenAddress2,
  };

  // Reserves
  const reserved1 = reservesData && reservesData.pool_event.length > 0
    ? formatAmount(reservesData.pool_event[0].reserved_1, decimal1)
    : '-';
  const reserved2 = reservesData && reservesData.pool_event.length > 0
    ? formatAmount(reservesData.pool_event[0].reserved_2, decimal2)
    : '-';

  const ratio1 = reservesData && reservesData.pool_event.length > 0
    ? BigNumber
      .from(reservesData.pool_event[0].reserved_2.toLocaleString('fullwide', { useGrouping: false }))
      .mul(1000)
      .div(BigNumber.from(BigNumber.from(reservesData.pool_event[0].reserved_1.toLocaleString('fullwide', { useGrouping: false }))))
      .toNumber() / 1000
    : -1;

  const ratio2 = reservesData && reservesData.pool_event.length > 0
    ? BigNumber
      .from(reservesData.pool_event[0].reserved_1.toLocaleString('fullwide', { useGrouping: false }))
      .mul(1000)
      .div(BigNumber.from(BigNumber.from(reservesData.pool_event[0].reserved_2.toLocaleString('fullwide', { useGrouping: false }))))
      .toNumber() / 1000
    : -1;

  const openTrade = (): void => history.push(SWAP_URL);
  const openAddLiquidity = (): void => history.push(ADD_LIQUIDITY_URL);
  const openRemoveLiquidity = (): void => {
    if (!loadingPool && poolData) {
      history.push(
        REMOVE_LIQUIDITY_URL
          .replace(':address1', tokenAddress1)
          .replace(':address2', tokenAddress2),
      );
    }
  };

  return (
    <div className="w-100 row justify-content-center">
      <div className="col-xl-10 col-lg-10 col-md-12">
        <div className="d-flex ms-1 mb-1">
          <Components.Icons.TokenIcon src={tokenIcon1} />
          <Components.Icons.TokenIcon src={tokenIcon2} />
          <BoldText size={1.6}>
            {' '}
            {tokenSymbol1}
            {' '}
            /
            {' '}
            {tokenSymbol2}
          </BoldText>
        </div>

        <Components.Display.FullRow>
          <Components.Display.ContentBetween>
            <div className="d-flex my-2">
              <div className="card border-rad">
                <div className="card-body py-1">
                  <div className="d-flex">
                    <Components.Icons.TokenIcon src={tokenIcon1} />
                    <Components.Display.ME size="1" />
                    <LeadText>
                      1
                      {tokenSymbol1}
                      {' '}
                      =
                      {ratio1 !== -1 ? ratio1.toFixed(3) : '-'}
                      {' '}
                      {tokenSymbol2}
                      {' '}
                    </LeadText>
                  </div>
                </div>
              </div>
              <Components.Display.ME size="1" />

              <div className="card border-rad">
                <div className="card-body py-1">
                  <div className="d-flex">
                    <Components.Icons.TokenIcon src={tokenIcon2} />
                    <Components.Display.ME size="1" />
                    <LeadText>
                      1
                      {tokenSymbol2}
                      {' '}
                      =
                      {ratio2 !== -1 ? ratio2.toFixed(3) : '-'}
                      {' '}
                      {tokenSymbol1}
                    </LeadText>
                  </div>
                </div>
              </div>
            </div>

            <div className="d-flex">
              <Components.Button.Button onClick={openTrade}>Trade</Components.Button.Button>
              <Components.Display.ME size="1" />
              <Components.Button.Button onClick={openAddLiquidity}>Add Liqudity</Components.Button.Button>
              <Components.Display.ME size="1" />
              <Components.Button.Button onClick={openRemoveLiquidity}>Remove Liqudity</Components.Button.Button>
            </div>
          </Components.Display.ContentBetween>
        </Components.Display.FullRow>

        <div className="row mt-2">
          <div className="col-sm-12 col-md-6 col-lg-4">
            <div className="border-rad bg-grey p-3 pt-2">
              <PoolInfo
                address={address}
                decimal1={decimal1}
                decimal2={decimal2}
                symbol1={tokenSymbol1}
                symbol2={tokenSymbol2}
                icon1={tokenIcon1}
                icon2={tokenIcon2}
                reserved1={reserved1}
                reserved2={reserved2}
              />
            </div>
          </div>

          <div className="col-sm-12 col-md-6 col-lg-8">
            <div className="border-rad bg-grey p-1 h-100 m-auto mt-xs-3">
              <ChartSelector
                address={poolInfo.address}
                address1={poolInfo.address1}
                address2={poolInfo.address2}
                decimal1={poolInfo.decimal1}
                decimal2={poolInfo.decimal2}
                symbol1={poolInfo.symbol1}
                symbol2={poolInfo.symbol2}
              />
            </div>
          </div>
        </div>

        <PoolTransactions address={address} />
      </div>
    </div>
  );
};

// These needs to be removed
export default PoolPage;
