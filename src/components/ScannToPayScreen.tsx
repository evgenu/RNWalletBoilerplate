import { Web3Provider } from '@ethersproject/providers';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Button from './common/Button';
import TextInput from './common/TextInput';
import QRCodeScanner from './QRCodeScanner';
import TransactionConfirmationDialog from './TransactionConfirmationDialog';

interface IScannToPayScreen {
  provider: Web3Provider;
}

const ScannToPayScreen = ({ provider }: IScannToPayScreen) => {
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
    setWalletUri('');
    setAmount('');
  };

  return (
    <View style={styles.container}>
      <TextInput keyboardType="numeric" onChangeText={(text) => setAmount(text)} value={amount} />
      <Button
        title="Scan"
        onPress={() => {
          toggleScanner();
          setWalletUri('');
        }}
        disabled={!amount}
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
});

export default ScannToPayScreen;
