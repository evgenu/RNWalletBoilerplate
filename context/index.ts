import { createContext } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { Contract } from '@ethersproject/contracts';

interface IApplicationContext {
  web3Provider: Web3Provider | null;
  address: string;
  balance: string;
  balanceLoading: boolean;
  libraryContract: Contract | null;
  tokenContract: Contract | null;
  setLibraryContract: (value: Contract) => void;
  setTokenContract: (value: Contract) => void;
  fetchBalance: () => Promise<void>;
  setAddress: (value: string) => void;
  setWeb3Provider: (value: Web3Provider) => void;
}

const ApplicationContext = createContext<IApplicationContext>({
  web3Provider: null,
  address: '',
  balance: '',
  balanceLoading: false,
  libraryContract: null,
  tokenContract: null,
  setLibraryContract: () => {},
  setTokenContract: () => {},
  fetchBalance: () => Promise.resolve(),
  setAddress: () => {},
  setWeb3Provider: () => {},
});

export default ApplicationContext;
