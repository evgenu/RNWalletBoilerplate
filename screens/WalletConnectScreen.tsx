import { Web3Provider } from '@ethersproject/providers';
import { formatEther } from '@ethersproject/units';
import { useWalletConnect } from '@walletconnect/react-native-dapp';
import WalletConnectProvider from '@walletconnect/web3-provider';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Button from './common/Button';
import ScannToPayScreen from './ScanToPayScreen';

const shortenAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(address.length - 4, address.length)}`;
};

export default function WalletConnectExperience() {
  const connector = useWalletConnect();
  const [web3Provider, setWeb3Provider] = useState<Web3Provider | null>(null);
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState('');
  const [loading, setLoading] = useState(false);

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

  const getBalance = async () => {
    if (web3Provider && address) {
      await setLoading(true);
      const balance = await web3Provider.getBalance(address);
      await setBalance(formatEther(balance));
      await setLoading(false);
    }
  };

  useEffect(() => {
    try {
      getBalance();
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

  return (
    <View style={{ ...styles.container, ...styles.fullHeight }}>
      {!connector.connected && !loading && (
        <Button onPress={connectWallet} title="Connect a wallet" />
      )}
      {connector.connected && loading && <Text>Loading...</Text>}
      {connector.connected && !loading && web3Provider && (
        <>
          <Text>Address: {shortenAddress(address)}</Text>
          <Text>{!balance ? 'Loading...' : `Balance: ${balance} ETH`}</Text>
          <Button onPress={killSession} title="Log out" style={styles.button} />
          <ScannToPayScreen provider={web3Provider} onPay={getBalance} />
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
    flex: 1,
    marginVertical: 32,
    alignItems: 'center',
    justifyContent: 'center',
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
