import { Web3Provider } from '@ethersproject/providers';
import { formatEther } from '@ethersproject/units';
import { useWalletConnect } from '@walletconnect/react-native-dapp';
import WalletConnectProvider from '@walletconnect/web3-provider';
import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LoginButton from '../components/LoginButton';
import LoginTitle from '../components/LoginTitle';
import LogoutButton from '../components/LogoutButton';

const shortenAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(address.length - 4, address.length)}`;
};

export default function WalletConnectExperience() {
  const connector = useWalletConnect();
  const [web3Provider, setWeb3Provider] = React.useState<Web3Provider | null>(null);
  const [address, setAddress] = React.useState('');
  const [balance, setBalance] = React.useState('');
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
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

  React.useEffect(() => {
    try {
      if (web3Provider && address) {
        const getBalance = async () => {
          const balance = await web3Provider.getBalance(address);
          await setBalance(Number(formatEther(balance)).toFixed(4));
          await setLoading(false);
        };
        getBalance();
      }
    } catch (e) {
      setLoading(false);
      console.log(e);
    }
  }, [web3Provider, address]);

  const connectWallet = React.useCallback(async () => {
    const state = await connector.connect();
    await setAddress(state.accounts[0]);
  }, [connector]);

  const killSession = React.useCallback(() => {
    return connector.killSession();
  }, [connector]);

  return (
    <>
      {!connector.connected ? (
        <>
          <LoginTitle />
          <LoginButton onPress={connectWallet} />
        </>
      ) : (
        <>
          <View style={styles.accountInformationContainer}>
            <Text style={styles.accountInformation}>{shortenAddress(connector.accounts[0])}</Text>
            <Text style={styles.accountInformation}>
              {loading ? 'Loading...' : `Balance: ${balance || 'N/A'} ETH`}
            </Text>
          </View>
          <LogoutButton onPress={killSession} />
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#5A45FF',
    color: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
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
