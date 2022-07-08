import { Wallet } from '@ethersproject/wallet';
import { ParamListBase } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Web3Auth, { OPENLOGIN_NETWORK } from '@web3auth/react-native-sdk';
import { Buffer } from 'buffer';
import Constants, { AppOwnership } from 'expo-constants';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import jwtDecode from 'jwt-decode';
import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Button from '../components/common/Button';
import ApplicationContext from '../context';
import JWTTokenData from '../types/JWTTokenData';

global.Buffer = global.Buffer || Buffer;

const scheme = 'walletconnect-example'; // Or your desired app redirection scheme
let web3auth: Web3Auth;

const resolvedRedirectUrl =
  Constants.appOwnership == AppOwnership.Expo || Constants.appOwnership == AppOwnership.Guest
    ? Linking.createURL('web3auth', {})
    : Linking.createURL('web3auth', { scheme: scheme });

const Web3AuthScreen = ({ navigation }: NativeStackScreenProps<ParamListBase>) => {
  const { web3AuthWallet, setWeb3AuthWallet } = useContext(ApplicationContext);
  const [idToken, setIdToken] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [_, setTokenData] = useState<JWTTokenData | null>(null);

  useEffect(() => {
    web3auth = new Web3Auth(WebBrowser, {
      clientId: process.env.WEB3AUTH_CLIENT_ID || '',
      network: OPENLOGIN_NETWORK.TESTNET, // or other networks
    });
  }, []);

  useEffect(() => {
    if (idToken) {
      const tokenDecoded: JWTTokenData = jwtDecode(idToken);
      setTokenData(tokenDecoded);
    }
  }, [idToken]);

  const resetState = () => {
    setErrorMsg('');
    setIdToken('');
    setTokenData(null);
    setWeb3AuthWallet(null);
  };

  const handleLogin = async () => {
    resetState();
    try {
      const state = await web3auth.login({
        redirectUrl: resolvedRedirectUrl,
      });
      let privateKey = state.privKey || '';
      const wallet = new Wallet(privateKey);
      setWeb3AuthWallet(wallet);

      setIdToken((state.userInfo as any)?.idToken);
    } catch (error) {
      console.error(error);
      setErrorMsg(String(error));
    }
  };

  const handleLogout = async () => {
    try {
      await web3auth.logout({
        redirectUrl: resolvedRedirectUrl,
      });
      resetState();
    } catch (error) {
      console.error(error);
      setErrorMsg(String(error));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Address: {web3AuthWallet ? web3AuthWallet.address : 'N/A'}</Text>
      {!!errorMsg && <Text>Error: {errorMsg}</Text>}
      {!web3AuthWallet && <Button style={styles.button} title="Login" onPress={handleLogin} />}
      {!!web3AuthWallet && <Button style={styles.button} title="Logout" onPress={handleLogout} />}
      <Button style={styles.button} title="Back" onPress={() => navigation.goBack()} />
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
  button: {
    width: '100%',
    marginVertical: 8,
  },
  text: {
    textAlign: 'center',
  },
});

export default Web3AuthScreen;
