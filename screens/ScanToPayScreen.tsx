import { parseEther } from '@ethersproject/units';
import { ParamListBase } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useContext, useEffect, useState } from 'react';
import { Linking, StyleSheet, Text, View } from 'react-native';
import Button from '../components/common/Button';
import TextInput from '../components/common/TextInput';
import QRCodeScanner from '../components/QRCodeScanner';
import TransactionConfirmationDialog from '../components/TransactionConfirmationDialog';
import { ApplicationScreens } from '../consts';
import ApplicationContext from '../context';

const ScannToPayScreen = ({ navigation }: NativeStackScreenProps<ParamListBase>) => {
  const { web3Provider, addressBalance, fetchBalance } = useContext(ApplicationContext);
  const [walletUri, setWalletUri] = useState('');
  const [scanner, setScanner] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [transactionHash, setTransactionHash] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => toggleScanner, []);

  const toggleScanner = () => {
    setScanner((prevState) => !prevState);
  };

  const onQRCodeScan = async (data: string) => {
    const address = data.split(':')[1];
    setWalletUri(address);
    toggleScanner();
    setConfirmationModalOpen(true);
  };

  const sendTransaction = async () => {
    if (!web3Provider) {
      return;
    }
    setConfirmationModalOpen(false);
    setLoading(true);
    const signer = web3Provider.getSigner();
    const signerAddress = await web3Provider.getSigner().getAddress();
    try {
      const transaction = await signer.sendTransaction({
        from: signerAddress,
        to: walletUri,
        value: parseEther(amount),
      });
      setTransactionHash(transaction.hash);
      const transactionReceipt = await transaction.wait();
      if (transactionReceipt.status !== 1) {
        console.log('Transaction failed!');
      }
    } catch (exception: any) {
      let message = 'Something weng wron! Please try again!';
      if (exception.error && exception.error.message) {
        message = exception.error.message.split(':')[1].trim();
      } else if (exception.message) {
        message = exception.message.split(':')[1].trim();
      }
      console.log(message);
    } finally {
      setWalletUri('');
      setAmount('');
      setTransactionHash('');
      setLoading(false);
      await fetchBalance();
      navigation.navigate(ApplicationScreens.Home);
    }
  };

  return (
    <View style={styles.container}>
      <Text>{!addressBalance ? 'Loading...' : `Balance: ${addressBalance} ETH`}</Text>
      <TextInput
        keyboardType="numeric"
        disabled={loading}
        onChangeText={(text) => setAmount(text)}
        value={amount}
      />
      {!!transactionHash && (
        <Text
          style={styles.transactionLabel}
          onPress={() => Linking.openURL(`https://ropsten.etherscan.io/tx/${transactionHash}`)}
        >
          Pending Transaction
        </Text>
      )}
      <Button
        title="Scan"
        onPress={() => {
          toggleScanner();
          setWalletUri('');
        }}
        disabled={!amount || loading}
        style={styles.button}
      />
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
      <TransactionConfirmationDialog
        open={confirmationModalOpen}
        receiver={walletUri}
        amount={amount}
        onConfirm={sendTransaction}
        onClose={() => {
          setConfirmationModalOpen(false);
          setWalletUri('');
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  button: {
    width: '100%',
  },
  transactionLabel: {
    textDecorationLine: 'underline',
    color: '#5A45FF',
    width: '100%',
    textAlign: 'center',
    marginVertical: 8,
  },
});

export default ScannToPayScreen;
