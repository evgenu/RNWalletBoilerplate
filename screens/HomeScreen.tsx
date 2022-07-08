import { Web3Provider } from '@ethersproject/providers';
import { ParamListBase } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useWalletConnect } from '@walletconnect/react-native-dapp';
import WalletConnectProvider from '@walletconnect/web3-provider';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Button from '../components/common/Button';
import { ApplicationScreens } from '../consts';
import ApplicationContext from '../context';
import { shortenAddress } from '../helpers/ethers';
import { getChainData } from '../helpers/utilities';

interface DefaultProps {
  infuraId: string;
}

type ComponentProps = NativeStackScreenProps<ParamListBase> & DefaultProps;

const HomeScreen = ({ navigation, infuraId }: ComponentProps) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const {
    web3Provider,
    address,
    addressBalance,
    balanceLoading,
    walletConnectProvider,
    setWalletConnectProvider,
    fetchBalance,
    setAddress,
    setWeb3Provider,
    setTokenContract,
    setLibraryContract,
  } = useContext(ApplicationContext);
  const connector = useWalletConnect();

  useEffect(() => {
    if (connector.connected) {
      initProvider();
    }
  }, [connector.connected]);

  useEffect(() => {
    if (walletConnectProvider && !isSubscribed) {
      console.log('Subscribe');
      // Subscribe to accounts change
      walletConnectProvider.on('accountsChanged', (accounts: string[]) => {
        console.log('accountsChanged -> ', accounts);
        setAddress(accounts[0]);
      });

      // Subscribe to chainId change
      walletConnectProvider.on('chainChanged', (chainId: number) => {
        console.log('chainChanged -> ', chainId);
        initProvider();
      });

      // Subscribe to session disconnection
      walletConnectProvider.on('disconnect', (code: number, reason: string) => {
        console.log(code, reason);
        killSession();
      });

      setIsSubscribed(true);
    }
  }, [walletConnectProvider, isSubscribed]);

  useEffect(() => {
    fetchBalance();
  }, [web3Provider, address]);

  const initProvider = async () => {
    const provider = new WalletConnectProvider({
      infuraId: infuraId,
      connector,
      qrcode: false,
    });
    await provider.enable();
    setWalletConnectProvider(provider);
    const web3Provider = new Web3Provider(provider);
    setWeb3Provider(web3Provider);
    if (!address) {
      await setAddress(connector.accounts[0]);
    }
  };

  const killSession = useCallback(() => {
    connector.killSession();
    setWeb3Provider(null);
    setWalletConnectProvider(null);
    setTokenContract(null);
    setLibraryContract(null);
    navigation.reset({
      index: 0,
      routes: [{ name: ApplicationScreens.Welcome }],
    });
  }, [connector]);

  return (
    <View style={{ ...styles.container, ...styles.fullHeight }}>
      {balanceLoading ? (
        <Text>Loading...</Text>
      ) : web3Provider ? (
        <>
          <Text>Address: {shortenAddress(address)}</Text>
          <Text>Network: {getChainData(connector.chainId).name}</Text>
          <Text>{!addressBalance ? 'Loading...' : `Balance: ${addressBalance} ETH`}</Text>
          <Button
            onPress={() => {
              navigation.navigate(ApplicationScreens.ScanToPay);
            }}
            title="Scan"
            style={styles.button}
          />
          <Button
            onPress={() => {
              navigation.navigate(ApplicationScreens.Library);
            }}
            title="Library"
            style={styles.button}
          />
          <Button onPress={killSession} title="Log out" style={styles.button} />
        </>
      ) : (
        <>
          <Text>No Web3Provider!</Text>
          <Button onPress={killSession} title="Log out" style={styles.button} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  fullHeight: {
    height: '100%',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  button: {
    width: '100%',
    marginHorizontal: 16,
    marginVertical: 8,
  },
  accountInformationContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountInformation: {
    textAlign: 'center',
    fontSize: 24,
  },
});

HomeScreen.defaultProps = {
  infuraId: process.env.INFURA_ID,
};

export default HomeScreen;