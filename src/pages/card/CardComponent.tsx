/* eslint-disable @typescript-eslint/no-empty-function */
import {
  Components,
  utils,
  ReefSigner,
  appState,
  hooks,
  reefTokenWithAmount,
  TokenWithAmount,
} from '@reef-defi/react-lib';
import React, { useEffect, useState } from 'react';
import * as ethers from 'ethers';
import { CardComponentTypes, CardInputHolderTypes } from './types';

import { CardBridgeFiller } from '../../assets/abi/CardBridgeFiller';

const { Card } = Components;
const {
  ComponentCenter, MT, CenterColumn, FlexColumn, FlexRow,
} = Components.Display;
const { OpenModalButton } = Components.Modal;
const { Button } = Components.Button;
const { LoadingButtonIconWithText } = Components.Loading;
const { TokenAmountFieldMax, TokenAmountFieldImpactPrice, AccountListModal } = Components;
const { NumberInput, Input } = Components.Input;
const { SwitchTokenButton } = Components.Button;
const { MiniText } = Components.Text;
const { SubCard } = Card;

const filterCurrentAccount = (
  accounts: ReefSigner[],
  selected: ReefSigner,
): ReefSigner[] => accounts.filter((a) => a.address !== selected.address);

const CardInputHolder = ({
  buy,
  sell,
  tokens,
  account,
}: CardInputHolderTypes): JSX.Element => {
  const changeSellToken = (): void => {};
  const changeBuyToken = (): void => {};
  const setSellAmount = (): void => {};
  const setBuyAmount = (): void => {};
  const onSwitch = (): void => {};

  return (
    <>
      <TokenAmountFieldMax
        token={sell}
        tokens={tokens}
        signer={account}
        id="sell-token-field"
        onAmountChange={setSellAmount}
        onTokenSelect={changeSellToken}
      />
      <SwitchTokenButton onClick={onSwitch} />
      <TokenAmountFieldImpactPrice
        token={buy}
        tokens={tokens}
        signer={account}
        id="buy-token-field"
        percentage={utils.calculateImpactPercentage(sell, buy)}
        onAmountChange={setBuyAmount}
        onTokenSelect={changeBuyToken}
      />
    </>
  );
};

const CardInputSection = ({
  buy,
  sell,
  tokens,
  account,
  accounts,
  currentAccount,
}: CardInputHolderTypes): JSX.Element => {
  const [to, setTo] = useState('');
  const isLoading = false;

  const REEF_TOKEN = reefTokenWithAmount();

  const [value, setValue] = useState<number | null>(null);

  const setSellAmount = (sellAmount: any): void => setValue(sellAmount);
  const changeSellToken = (): void => {};
  const [foundToAccountAddress, setFoundToAccountAddress] = useState<ReefSigner | null>();
  const [availableTxAccounts, setAvailableTxAccounts] = useState<ReefSigner[]>(
    [],
  );

  const [txToken, setTxToken] = useState({
    ...tokens[0],
    amount: '0',
  } as TokenWithAmount);

  const onAccountSelect = (_: any, selected: ReefSigner): void => {
    const selectAcc = async (): Promise<void> => {
      let addr = '';
      if (txToken?.address === REEF_TOKEN.address) {
        addr = await selected.signer.getSubstrateAddress();
      }
      if (!addr && selected.isEvmClaimed) {
        addr = selected.evmAddress;
      }
      setTo(addr);
    };
    selectAcc();
  };

  useEffect(() => {
    if (!to || !accounts || !accounts.length) {
      setFoundToAccountAddress(null);
      return;
    }
    const foundToAddrAccount = accounts.find(
      (a: any) => a.address.toLowerCase() === to.toLowerCase()
        || a.evmAddress.toLowerCase() === to.toLowerCase(),
    );
    if (foundToAddrAccount) {
      setFoundToAccountAddress(foundToAddrAccount);
      return;
    }
    setFoundToAccountAddress(null);
  }, [to, accounts]);
  useEffect(() => {
    const exceptCurrent = filterCurrentAccount(accounts, currentAccount);
    if (txToken?.address === REEF_TOKEN.address) {
      setAvailableTxAccounts(exceptCurrent);
      return;
    }
    setAvailableTxAccounts(exceptCurrent.filter((a) => !!a.isEvmClaimed));
  }, [accounts, currentAccount, txToken]);

  return (
    <>
      <MT />
      <SubCard>
        <FlexColumn>
          <Input
            value={to}
            maxLength={70}
            onChange={(toVal: string) => setTo(toVal.trim())}
            placeholder="Card top-up address"
            disabled={isLoading}
          />
          <MT size="2" />
          <FlexRow className="d-flex-vert-base">
            {foundToAccountAddress && (
              <span className="pl-1rem">
                <MiniText>
                  Selected account:&nbsp;
                  {foundToAccountAddress?.name}
                </MiniText>
              </span>
            )}
            <OpenModalButton
              id="selectMyAddress"
              disabled={isLoading}
              className="btn-empty link-text text-xs text-primary pl-1rem"
            >
              Select account
            </OpenModalButton>
          </FlexRow>
        </FlexColumn>
      </SubCard>
      <MT size="2" />
      <TokenAmountFieldMax
        token={sell}
        tokens={tokens}
        signer={account}
        id="sell-token-field"
        onAmountChange={setSellAmount}
        onTokenSelect={changeSellToken}
      />
      <AccountListModal
        id="selectMyAddress"
        accounts={availableTxAccounts}
        selectAccount={onAccountSelect}
        title={(
          <div>
            Select account&nbsp;
            {txToken?.address !== REEF_TOKEN.address && (
              <span className="text-xs">(Ethereum VM enabled)</span>
            )}
          </div>
        )}
      />
    </>
  );
};

const CardComponent = ({
  tokens,
  network,
  account,
  accounts,
  buyToken,
  sellToken,
  currentAccount,
}: CardComponentTypes): JSX.Element => {
  const [buy, setBuy] = useState(buyToken);
  const [sell, setSell] = useState(sellToken);
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);

  const [cardAddress, setCardAddress] = useState('');
  const [reefAmount, setReefAmount] = useState<string>('');

  const text = 'Top Up';

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
    if (Number(reefAmount) < 100) throw new Error('amount must be greater than 100');
    let addr;
    try {
      addr = ethers.utils.getAddress(cardAddress);
    } catch (e) {
      throw new Error('invalid recipient address provided');
    }
    const amount = ethers.BigNumber.from(reefAmount).mul(
      ethers.BigNumber.from(10).pow(18),
    );

    console.log(addr, amount, addr.length);

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
    if (cardAddress.length ===0) {
      return 'Card address is required';
    }
    if (reefAmount === '') {
      return 'Amount is required';
    }
    return text;
  };

  const changeSellToken = (): void => {};

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const handleAddressChange = (e: any) => {
    setCardAddress(e);
  };

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const handleAmountChange = (e: any) => {
    setReefAmount(e || '');
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
            token={sell}
            tokens={tokens}
            signer={account}
            id="sell-token-field"
            onAmountChange={handleAmountChange}
            onTokenSelect={changeSellToken}
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
            <Button disabled={isLoading || cardAddress.length === 0 || reefAmount === ''} onClick={handleClick}>
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
