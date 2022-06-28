import { createContext } from 'react';
import { Web3Provider } from '@ethersproject/providers';

interface IApplicationContext {
  web3Provider: Web3Provider | null;
  address: string;
  balance: string;
  balanceLoading: boolean;
  fetchBalance: () => Promise<void>;
  setAddress: (value: string) => void;
  setWeb3Provider: (value: Web3Provider) => void;
}

const ApplicationContext = createContext<IApplicationContext>({
  web3Provider: null,
  address: '',
  balance: '',
  balanceLoading: false,
  fetchBalance: () => Promise.resolve(),
  setAddress: () => {},
  setWeb3Provider: () => {},
});

export default ApplicationContext;
