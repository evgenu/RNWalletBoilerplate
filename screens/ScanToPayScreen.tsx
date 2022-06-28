import { Web3Provider } from '@ethersproject/providers';
import { parseEther } from '@ethersproject/units';
import React, { useState } from 'react';
import { Linking, StyleSheet, Text, View } from 'react-native';
import Button from '../components/common/Button';
import TextInput from '../components/common/TextInput';
import QRCodeScanner from './QRCodeScanner';
import TransactionConfirmationDialog from './TransactionConfirmationDialog';

interface IScannToPayScreen {
  provider: Web3Provider;
  onPay: () => void;
}

const ScannToPayScreen = ({ provider, onPay }: IScannToPayScreen) => {
  const [walletUri, setWalletUri] = useState('');
  const [scanner, setScanner] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [transactionHash, setTransactionHash] = useState('');
  const [loading, setLoading] = useState(false);

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
    setConfirmationModalOpen(false);
    setLoading(true);
    const signer = provider.getSigner();
    const signerAddress = await provider.getSigner().getAddress();
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
    } catch (exception) {
    } finally {
      setWalletUri('');
      setAmount('');
      setTransactionHash('');
      setLoading(false);
      onPay();
    }
  };

  return (
    <View style={styles.container}>
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
    width: '100%',
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
