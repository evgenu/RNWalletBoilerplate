import { Contract } from '@ethersproject/contracts';
import { Web3Provider } from '@ethersproject/providers';
import { Wallet } from '@ethersproject/wallet';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { createContext } from 'react';

interface IApplicationContext {
  web3Provider: Web3Provider | null;
  address: string;
  addressBalance: string;
  libraryBalance: string;
  balanceLoading: boolean;
  libraryContract: Contract | null;
  tokenContract: Contract | null;
  web3AuthWallet: Wallet | null;
  walletConnectProvider: WalletConnectProvider | null;
  setLibraryContract: (value: Contract | null) => void;
  setTokenContract: (value: Contract | null) => void;
  fetchBalance: () => Promise<void>;
  setLibraryBalance: (value: string) => void;
  setAddress: (value: string) => void;
  setWeb3Provider: (value: Web3Provider | null) => void;
  setWalletConnectProvider: (value: WalletConnectProvider | null) => void;
  setWeb3AuthWallet: (value: Wallet | null) => void;
}

const ApplicationContext = createContext<IApplicationContext>({
  web3Provider: null,
  address: '',
  addressBalance: '',
  libraryBalance: '',
  balanceLoading: false,
  libraryContract: null,
  tokenContract: null,
  walletConnectProvider: null,
  web3AuthWallet: null,
  setLibraryContract: () => {},
  setTokenContract: () => {},
  fetchBalance: () => Promise.resolve(),
  setAddress: () => {},
  setLibraryBalance: () => {},
  setWeb3Provider: () => {},
  setWalletConnectProvider: () => {},
  setWeb3AuthWallet: () => {},
});

export default ApplicationContext;
