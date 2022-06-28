import { Web3Provider } from '@ethersproject/providers';
import { ParamListBase } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useWalletConnect } from '@walletconnect/react-native-dapp';
import WalletConnectProvider from '@walletconnect/web3-provider';
import React, { useCallback, useContext, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Button from '../components/common/Button';
import { ApplicationScreens } from '../consts';
import ApplicationContext from '../context';

const shortenAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(address.length - 4, address.length)}`;
};

const HomeScreen = ({ navigation }: NativeStackScreenProps<ParamListBase>) => {
  const {
    web3Provider,
    address,
    balance,
    balanceLoading,
    fetchBalance,
    setAddress,
    setWeb3Provider,
  } = useContext(ApplicationContext);
  const connector = useWalletConnect();

  useEffect(() => {
    if (connector.connected) {
      const initProvider = async () => {
        const provider = new WalletConnectProvider({
          infuraId: process.env.INFURA_ID,
          connector,
          qrcode: false,
        });
        await provider.enable();
        const web3Provider = new Web3Provider(provider);
        setWeb3Provider(web3Provider);
        if (!address) {
          await setAddress(connector.accounts[0]);
        }
      };
      initProvider();
    }
  }, [connector.connected]);

  useEffect(() => {
    fetchBalance();
  }, [web3Provider, address]);

  const killSession = useCallback(() => {
    connector.killSession();
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
          <Text>{!balance ? 'Loading...' : `Balance: ${balance} ETH`}</Text>
          <Button
            onPress={() => {
              navigation.navigate(ApplicationScreens.ScanToPay);
            }}
            title="Scan"
            style={styles.button}
          />
          <Button onPress={killSession} title="Log out" style={styles.button} />
        </>
      ) : null}
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

export default HomeScreen;
