export interface AddressVar {
  address: string;
}

interface ContractData {
  symbol: string;
  name: string;
  decimals: number
}

export interface PoolData {
  id: number;
  address: string;
  token_contract_1: {
    address: string;
    verified_contract: {
      contract_data: ContractData;
    };
  };
  token_contract_2: {
    address: string;
    verified_contract: {
      contract_data: ContractData;
    };
  };
}