import { ParamListBase } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useWalletConnect } from '@walletconnect/react-native-dapp';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Button from '../components/common/Button';
import LoginTitle from '../components/LoginTitle';
import { ApplicationScreens } from '../consts';

const WelcomeScreen = ({ navigation }: NativeStackScreenProps<ParamListBase>) => {
  const connector = useWalletConnect();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (connector.connected) {
      navigation.reset({
        index: 0,
        routes: [{ name: ApplicationScreens.Home }],
      });
    }
  }, [connector.connected]);

  const connectWallet = useCallback(async () => {
    await setLoading(true);
    await connector.connect();
  }, [connector]);

  return (
    <View style={{ ...styles.container, ...styles.fullHeight }}>
      {!connector.connected && !loading && (
        <>
          <LoginTitle />
          <Button onPress={connectWallet} title="Connect a wallet" />
        </>
      )}
      {connector.connected && loading && <Text>Loading...</Text>}
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
});

export default WelcomeScreen;
