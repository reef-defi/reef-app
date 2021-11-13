import React from 'react';
import { availableNetworks, Components } from '@reef-defi/react-lib';
import './Nav.css';
import {
  Link, useHistory, useRouteMatch, useLocation,
} from 'react-router-dom';
import { BsArrowLeftRight, BsBagFill, BsHammer } from 'react-icons/bs';
import { useGetSigner } from '../hooks/useGetSigner';
import { useAppDispatch, useAppSelector } from '../store';
import { selectSigner } from '../store/actions/signers';
import { reloadTokens } from '../store/actions/tokens';
import { saveSignerLocalPointer } from '../store/internalStore';
import { ReefLogo, SwapIcon, WalletIcon } from './Icons';
import {
  ADD_LIQUIDITY_URL, CREATE_ERC20_TOKEN_URL, DASHBOARD_URL, POOLS_URL, SWAP_URL, TRANSFER_TOKEN,
} from '../urls';

const menuItems = [
  { title: 'Dashboard', url: DASHBOARD_URL },
  { title: 'Send', url: TRANSFER_TOKEN },
  { title: 'Swap', url: SWAP_URL },
  { title: 'Pools', url: POOLS_URL },
  { title: 'Creator', url: CREATE_ERC20_TOKEN_URL },
];

const Nav = (): JSX.Element => {
  const history = useHistory();
  const { pathname } = useLocation();
  const signer = useGetSigner();
  const dispatch = useAppDispatch();
  const { accounts } = useAppSelector((state) => state.signers);

  const selectAccount = (index: number): void => {
    saveSignerLocalPointer(index);
    dispatch(selectSigner(index));
    dispatch(reloadTokens());
  };

  const menuItemsView = menuItems
    .map((item) => {
      let classes = 'navigation_menu-items_menu-item';
      if (pathname === item.url) {
        classes += ' text-color-dark-accent';
      }
      return (
        <li key={item.title} className={classes}>
          <Link to={item.url} className="navigation_menu-items_menu-item_link">
            {item.title}
          </Link>
        </li>
      );
    });

  return (
    <div className="nav-content navigation d-flex d-flex-space-between">
      <div className="logo-w">
        <button type="button" className="logo-btn" onClick={() => { history.push('/'); }}>
          <div className="svg-w h-100 w-100">
            <ReefLogo />
          </div>
        </button>
      </div>
      <nav className="d-flex justify-content-end d-flex-vert-center">
        <ul className="navigation_menu-items ">
          {menuItemsView}
        </ul>
        <Components.AccountSelector
          accounts={accounts}
          selectedSigner={signer}
          selectAccount={selectAccount}
          reefscanUrl={availableNetworks.mainnet.reefscanUrl}
        />
      </nav>
    </div>

  );
};

export default Nav;
