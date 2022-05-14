/* eslint-disable @typescript-eslint/no-empty-function */
import {
  Components,
  utils,
  ReefSigner,
  reefTokenWithAmount,
  Token,
  createEmptyTokenWithAmount,
} from '@reef-defi/react-lib';
import React, { useEffect, useState } from 'react';
import * as ethers from 'ethers';
import { CardComponentTypes } from './types';

import { CardBridgeFiller } from '../../assets/abi/CardBridgeFiller';

const { calculateAmount } = utils;
const { Card } = Components;
const {
  ComponentCenter, MT, CenterColumn,
} = Components.Display;
const { Button } = Components.Button;
const { LoadingButtonIconWithText } = Components.Loading;
const { TokenAmountFieldMax } = Components;
const { Input } = Components.Input;
const { SubCard } = Card;

const CardComponent = ({
  tokens,
  account,
  currentAccount,
}: CardComponentTypes): JSX.Element => {
  const [token, setToken] = useState(reefTokenWithAmount());
  const [isLoading, setIsLoading] = useState(false);

  const [cardAddress, setCardAddress] = useState('');

  const text = 'Top Up';

  useEffect(() => {
    const alignedToken = tokens.find(({ address }) => address === token.address);

    if (alignedToken) {
      setToken({ ...token, balance: alignedToken.balance });
    }
  }, [tokens]);

  const onTokenSelect = (newToken: Token): void => setToken({ ...createEmptyTokenWithAmount(false), ...newToken });

  const onAmountChange = (amount: string): void => setToken({ ...token, amount });

  const loadingStatus = (
    status: string,
    isPoolLoading: boolean,
    isPriceLoading: boolean,
  ): string => {
    if (status) {
      return status;
    }
    if (isPoolLoading) {
      return 'Loading pool';
    }
    if (isPriceLoading) {
      return 'Loading prices';
    }
    return '';
  };

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const handleClick = async () => {
    // console.log('button clicked account', account);
    // console.log('button clicked network', network);
    // console.log('button clicked buy', buyToken);
    // console.log('button clicked sell', sellToken);
    // console.log('button clicked accs', accounts);
    // console.log('button clicked to');
    // console.log (cardAddress, reefAmount);

    // probably display errors in popups
    if (Number(token.amount) < 100) throw new Error('amount must be greater than 100');
    let addr;
    try {
      addr = ethers.utils.getAddress(cardAddress);
    } catch (e) {
      throw new Error('invalid recipient address provided');
    }
    const amount = calculateAmount(token);

    // you probably want the address to be in a config file (also this is the testnet address, will have a separate one on mainnet)
    const bridgeContract = new ethers.Contract(
      '0xF9525775eD30aaef496304F3dDBC5fa70f0f70ef',
      CardBridgeFiller,
      account.signer,
    );

    setIsLoading(true);

    try {
      const tx = await bridgeContract.topUp(addr, {
        value: amount,
      });

      const receipt = await tx.wait();
      const hash = receipt.transactionHash;

      // we will probably need to display this in a popup
      console.log(`success! tx hash: ${hash}`);

      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      throw e;
    }
  };

  const getText = () : string => {
    if (isLoading) {
      return 'Loading...';
    }
    if (cardAddress.length === 0) {
      return 'Card address is required';
    }
    if (token.amount === '') {
      return 'Amount is required';
    }
    return text;
  };

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const handleAddressChange = (e: any) => {
    setCardAddress(e);
  };

  return (
    <ComponentCenter>
      <Card.Card>
        <Card.CardHeader>
          <Card.CardHeaderBlank />
          <Card.CardTitle title="Card" />
          <Card.CardHeaderBlank />
        </Card.CardHeader>
        {/* <CardInputSection
          buy={buy}
          sell={sell}
          tokens={tokens}
          account={account}
          accounts={accounts}
          currentAccount={currentAccount}
        /> */}
        <SubCard>
          <MT size="1">
            <Input
              className="form-control form-control-lg border-rad"
              value={cardAddress}
              onChange={handleAddressChange}
              placeholder="Card Address"
            />
          </MT>
          <MT size="2" />
        </SubCard>
        <MT size="1">
          {/* <NumberInput
            className="form-control form-control-lg border-rad"
            value={reefAmount}
            onChange={handleAmountChange}
            placeholder="Amount of REEF to send"
          /> */}
          <TokenAmountFieldMax
            signer={currentAccount}
            token={token}
            tokens={tokens}
            id="sell-token-field"
            onTokenSelect={onTokenSelect}
            onAmountChange={onAmountChange}
          />
        </MT>
        {/* <CardInputHolder
          buy={buy}
          sell={sell}
          tokens={tokens}
          account={account}
        /> */}
        <MT size="2" />
        <CenterColumn>
          <div className="btn-container">
            <Button disabled={isLoading || cardAddress.length === 0 || token.amount === ''} onClick={handleClick}>
              {isLoading ? (
                <LoadingButtonIconWithText
                  text={loadingStatus('', false, false)}
                />
              ) : (
                getText()
              )}
            </Button>
          </div>
        </CenterColumn>
      </Card.Card>
    </ComponentCenter>
  );
};
export default CardComponent;
