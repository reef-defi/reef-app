import React from 'react';
import { Components, TokenWithAmount, utils } from '@reef-defi/react-lib';
import { TokenPill } from './TokenPill';
import './Nfts.css';

const { isDataSet, DataProgress } = utils;

const placeholderImage = 'https://cryptotelegram.com/wp-content/uploads/2021/04/reef-crypto-explained.jpg';

export const Skeleton = (): JSX.Element => (
  <div className="nft-skeleton">
    <div className="nft-skeleton__image" />
    <div className="nft-skeleton__name" />
  </div>
);

export const Nfts = (): JSX.Element => (
  <div className="nfts">
    <div className="col-12">
      <div className="nfts__container">

        {/* <div className="nfts__item">
          <div
            className="nfts__item-image"
            style={{ backgroundImage: `url(${placeholderImage})` }}
          />
          <div className="nfts__item-info">
            <div className="nfts__item-name">NFT Title</div>
          </div>
        </div> */}

        {/* <Skeleton />
        <Skeleton />
        <Skeleton /> */}

      </div>
    </div>

    <div>No NFTs in your wallet.</div>

  </div>

);
