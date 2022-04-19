export interface UrlAddressParams {
  address1: string;
  address2: string;
}

export const DEFAULT_SWAP_URL = '/swap';
export const SPECIFIED_SWAP_URL = '/swap/:address1/:address2';
export const POOLS_URL = '/pools';
export const SETTINGS_URL = '/settings';
export const DASHBOARD_URL = '/dashboard';
export const DEFAULT_ADD_LIQUIDITY_URL = '/add-supply';
export const ADD_LIQUIDITY_URL = '/add-supply/:address1/:address2';
export const POOL_CHART_URL = '/chart/:address';
export const REMOVE_LIQUIDITY_URL = '/remove-supply/:address1/:address2';
export const TRANSFER_TOKEN = '/send';
export const CREATE_ERC20_TOKEN_URL = '/create-token';
export const BONDS_URL = '/bonds';
