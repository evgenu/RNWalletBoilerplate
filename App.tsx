import './global';
import '@ethersproject/shims';
import 'dotenv/config';
import { Contract } from '@ethersproject/contracts';
import { Web3Provider } from '@ethersproject/providers';
import { formatEther } from '@ethersproject/units';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WalletConnectProvider from '@walletconnect/react-native-dapp';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Platform } from 'react-native';
import { ApplicationScreens } from './consts';
import ApplicationContext from './context';
import AddBookScreen from './screens/AddBookScreen';
import BooksOverviewScreen from './screens/BooksOverviewScreen';
import HomeScreen from './screens/HomeScreen';
import LibraryScreen from './screens/LibraryScreen';
import ScannToPayScreen from './screens/ScanToPayScreen';
import WelcomeScreen from './screens/WelcomeScreen';

const Stack = createNativeStackNavigator();

const SCHEME_FROM_APP_JSON = 'walletconnect';

export default function App() {
  const [web3Provider, setWeb3Provider] = useState<Web3Provider | null>(null);
  const [libraryContract, setLibraryContract] = useState<Contract | null>(null);
  const [tokenContract, setTokenContract] = useState<Contract | null>(null);
  const [addressBalance, setAddressBalance] = useState('');
  const [libraryBalance, setLibraryBalance] = useState('');
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [address, setAddress] = useState('');

  const getBalance = async () => {
    if (web3Provider && address && !balanceLoading) {
      try {
        await setBalanceLoading(true);
        const balance = await web3Provider.getBalance(address);
        await setAddressBalance(formatEther(balance));
        await setBalanceLoading(false);
      } catch (e) {
        console.log(e);
      }
    }
  };

  return (
    <WalletConnectProvider
      redirectUrl={Platform.OS === 'web' ? window.location.origin : `${SCHEME_FROM_APP_JSON}://`}
      storageOptions={{
        asyncStorage: AsyncStorage as any,
      }}
    >
      <ApplicationContext.Provider
        value={{
          web3Provider,
          addressBalance,
          balanceLoading,
          address,
          libraryContract,
          tokenContract,
          libraryBalance,
          setTokenContract,
          setLibraryContract,
          fetchBalance: getBalance,
          setAddress,
          setLibraryBalance,
          setWeb3Provider,
        }}
      >
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name={ApplicationScreens.Welcome}
              component={WelcomeScreen}
              options={{ header: () => null }}
            />
            <Stack.Screen name={ApplicationScreens.Home} component={HomeScreen} />
            <Stack.Screen name={ApplicationScreens.ScanToPay} component={ScannToPayScreen} />
            <Stack.Screen name={ApplicationScreens.Library} component={LibraryScreen} />
            <Stack.Screen name={ApplicationScreens.AddBook} component={AddBookScreen} />
            <Stack.Screen name={ApplicationScreens.BooksOverview} component={BooksOverviewScreen} />
          </Stack.Navigator>
          <StatusBar style="auto" />
        </NavigationContainer>
      </ApplicationContext.Provider>
    </WalletConnectProvider>
  );
}
