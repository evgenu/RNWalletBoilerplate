import Web3Auth, { OPENLOGIN_NETWORK } from '@web3auth/react-native-sdk';
import { Buffer } from 'buffer';
import Constants, { AppOwnership } from 'expo-constants';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Button from '../components/Button';

global.Buffer = global.Buffer || Buffer;

const scheme = 'walletconnect-example'; // Or your desired app redirection scheme
let web3auth: Web3Auth;

const resolvedRedirectUrl =
  Constants.appOwnership == AppOwnership.Expo || Constants.appOwnership == AppOwnership.Guest
    ? Linking.createURL('web3auth', {})
    : Linking.createURL('web3auth', { scheme: scheme });

interface IWeb3AuthScreen {
  onClose: () => void;
}

const Web3AuthScreen = ({ onClose }: IWeb3AuthScreen) => {
  const [key, setKey] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    web3auth = new Web3Auth(WebBrowser, {
      clientId: process.env.WEB3AUTH_CLIENT_ID || '',
      network: OPENLOGIN_NETWORK.TESTNET, // or other networks
    });
  }, []);

  const resetState = () => {
    setKey('');
    setErrorMsg('');
  };

  const handleLogin = async () => {
    resetState();
    try {
      const state = await web3auth.login({
        redirectUrl: resolvedRedirectUrl,
      });
      console.log('Auth State -> ', state);
      setKey(state.privKey || 'no key');
    } catch (error) {
      console.error(error);
      setErrorMsg(String(error));
    }
  };

  const handleLogout = async () => {
    resetState();
    try {
      await web3auth.logout({
        redirectUrl: resolvedRedirectUrl,
      });
    } catch (error) {
      console.error(error);
      setErrorMsg(String(error));
    }
  };

  return (
    <View style={styles.container}>
      <Text>Key: {key || 'N/A'}</Text>
      {!!errorMsg && <Text>Error: {errorMsg}</Text>}
      <Text>Linking URL: {resolvedRedirectUrl}</Text>
      <Button label="Login with Web3Auth" onPress={handleLogin} />
      {!!key && <Button label="Logout" onPress={handleLogout} />}
      <Button label="Back" onPress={onClose} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    width: '100%',
  },
});

export default Web3AuthScreen;
