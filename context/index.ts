import { createContext } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { Contract } from '@ethersproject/contracts';

interface IApplicationContext {
  web3Provider: Web3Provider | null;
  address: string;
  addressBalance: string;
  libraryBalance: string;
  balanceLoading: boolean;
  libraryContract: Contract | null;
  tokenContract: Contract | null;
  setLibraryContract: (value: Contract) => void;
  setTokenContract: (value: Contract) => void;
  fetchBalance: () => Promise<void>;
  setLibraryBalance: (value: string) => void;
  setAddress: (value: string) => void;
  setWeb3Provider: (value: Web3Provider) => void;
}

const ApplicationContext = createContext<IApplicationContext>({
  web3Provider: null,
  address: '',
  addressBalance: '',
  libraryBalance: '',
  balanceLoading: false,
  libraryContract: null,
  tokenContract: null,
  setLibraryContract: () => {},
  setTokenContract: () => {},
  fetchBalance: () => Promise.resolve(),
  setAddress: () => {},
  setLibraryBalance: () => {},
  setWeb3Provider: () => {},
});

export default ApplicationContext;
