import './global';
import '@ethersproject/shims';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WalletConnectProvider from '@walletconnect/react-native-dapp';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { Platform, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import WalletConnectScreen from './screens/WalletConnectScreen';

const SCHEME_FROM_APP_JSON = 'walletconnect';

export default function App() {
  return (
    <WalletConnectProvider
      redirectUrl={Platform.OS === 'web' ? window.location.origin : `${SCHEME_FROM_APP_JSON}://`}
      storageOptions={{
        asyncStorage: AsyncStorage as any,
      }}
    >
      <SafeAreaView>
        <ScrollView
          contentContainerStyle={styles.fullHeight}
          contentInsetAdjustmentBehavior="automatic"
        >
          <WalletConnectScreen />
          <StatusBar style="auto" />
        </ScrollView>
      </SafeAreaView>
    </WalletConnectProvider>
  );
}

const styles = StyleSheet.create({
  fullHeight: {
    height: '100%',
    padding: 8,
  },
});
