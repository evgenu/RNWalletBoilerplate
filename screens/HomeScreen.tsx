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
import { shortenAddress } from '../helpers/ethers';
import { LIBRARY_CONTRACT_ADDRESS, INFURA_ID } from '@env';

const HomeScreen = ({ navigation }: NativeStackScreenProps<ParamListBase>) => {
  const {
    web3Provider,
    address,
    addressBalance,
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
          infuraId: INFURA_ID,
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

export default HomeScreen;
