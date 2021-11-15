import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Components, reefTokenWithAmount, Token, TokenWithAmount,
} from '@reef-defi/react-lib';
import { RIcon, SendIcon, SwapIcon } from '../../common/Icons';
import { useAppSelector } from '../../store';

export const ActionButtons = (): JSX.Element => {
  const history = useHistory();
  const { tokens: txTokens } = useAppSelector((state) => state.tokens);
  const [txToken, setTxToken] = useState(reefTokenWithAmount());
  const [txAmount, setTxAmount] = useState('0');
  return (
    <div className="dashboard_actions col-12 col-md-6 d-flex d-flex-end d-flex-vert-center">
      <div className="mr-1">
        <button
          type="button"
          className="button-light dashboard_actions_button dashboard_actions_button-swap radius-border"
          onClick={() => {
            history.push('/swap');
          }}
        >
          <div className="svg-w fill-white">
            <SwapIcon />
          </div>
          <span className="dashboard_actions_button_text">Swap</span>
        </button>
      </div>
      <div className="mr-1">
        <button
          type="button"
          className="button-light dashboard_actions_button dashboard_actions_button-send radius-border"
          onClick={() => {
            history.push('/send');
          }}
        >
          <div className="svg-w fill-white">
            <SendIcon />
          </div>
          <span className="dashboard_actions_button_text">Send</span>
        </button>
      </div>
      <div className="">
        <button
          type="button"
          className="button-light dashboard_actions_button dashboard_actions_button-buy radius-border"
        >
          <div className="svg-w fill-white">
            <RIcon />
          </div>
          <span className="dashboard_actions_button_text">Buy</span>
        </button>
      </div>
    </div>
  );
};