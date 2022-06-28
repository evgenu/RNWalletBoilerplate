import React from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import Button from './common/Button';

interface ITransactionConfirmationDialogProps {
  open: boolean;
  receiver: string;
  amount: string;
  onClose: () => void;
  onConfirm: () => void;
}

const TransactionConfirmationDialog = ({
  open,
  receiver,
  amount,
  onConfirm,
  onClose,
}: ITransactionConfirmationDialogProps) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={open && !!receiver}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>
            Send <Text style={styles.bold}>{amount} ETH</Text> to{' '}
            <Text style={styles.bold}>{receiver}</Text>
          </Text>
          <View style={styles.button}>
            <Button title="Confirm" onPress={onConfirm} />
          </View>
          <View style={styles.button}>
            <Button title="Cancel" onPress={onClose} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    width: '90%',
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    marginVertical: 8,
    width: '100%',
  },
  modalText: {
    marginBottom: 15,
    color: 'black',
    textAlign: 'center',
  },
  bold: {
    fontWeight: 'bold',
  },
});

export default TransactionConfirmationDialog;
