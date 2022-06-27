import React, { useState, useCallback, useEffect } from 'react';
import { Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, View } from 'react-native';
import { useWalletConnect } from '@walletconnect/react-native-dapp';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { Web3Provider } from '@ethersproject/providers';
import { formatEther } from '@ethersproject/units';
import QRCodeScanner from './QRCodeScanner';
import Button from './common/Button';

const shortenAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(address.length - 4, address.length)}`;
};

export default function WalletConnectExperience() {
  const connector = useWalletConnect();
  const [web3Provider, setWeb3Provider] = useState<Web3Provider | null>(null);
  const [scanner, setScanner] = useState(false);
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState('');
  const [loading, setLoading] = useState(true);
  const [walletUri, setWalletUri] = useState('');

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
        await setWeb3Provider(web3Provider);
        if (!address) {
          await setAddress(connector.accounts[0]);
        }
      };
      initProvider();
    }
  }, [connector.connect]);

  useEffect(() => {
    try {
      if (web3Provider && address) {
        const getBalance = async () => {
          const balance = await web3Provider.getBalance(address);
          await setBalance(formatEther(balance));
          await setLoading(false);
        };
        getBalance();
      }
    } catch (e) {
      console.log(e);
    }
  }, [web3Provider, address]);

  const connectWallet = useCallback(async () => {
    const state = await connector.connect();
    await setAddress(state.accounts[0]);
  }, [connector]);

  const killSession = useCallback(() => {
    return connector.killSession();
  }, [connector]);

  const toggleScanner = () => {
    setScanner((prevState) => !prevState);
  };

  const onQRCodeScan = async (data: string) => {
    const address = data.split(':')[1];
    setWalletUri(address);
    toggleScanner();
    // setConfirmationModalOpen(true);
  };

  return (
    <View style={{ ...styles.container, ...styles.fullHeight }}>
      {!connector.connected && !loading && (
        <Button onPress={connectWallet} label="Connect a wallet" />
      )}
      {connector.connected && loading && <Text>Loading...</Text>}
      {connector.connected && !loading && (
        <>
          <Text>Address: {shortenAddress(address)}</Text>
          <Text>{!balance ? 'Loading...' : `Balance: ${balance} ETH`}</Text>
          <Button onPress={killSession} label="Log out" style={styles.button} />
          <Button label="Scan to send O.5 ETH" onPress={toggleScanner} style={styles.button} />
          {!!walletUri && <Text>Address to send: {walletUri}</Text>}
          {scanner && (
            <QRCodeScanner
              onError={() => {
                console.log('Error!');
                toggleScanner();
              }}
              onClose={toggleScanner}
              onScann={onQRCodeScan}
            />
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fullHeight: {
    height: '100%',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: '100%',
    marginHorizontal: 16,
    marginVertical: 8,
  },
});
