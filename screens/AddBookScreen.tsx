import { ParamListBase } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useContext, useState } from 'react';
import { Linking, StyleSheet, Text, View } from 'react-native';
import Button from '../components/common/Button';
import TextInput from '../components/common/TextInput';
import ApplicationContext from '../context';

enum InputNames {
  BookName = 'book-name',
  BookCopies = 'book-copies',
}

const AddBookScreen = ({ navigation }: NativeStackScreenProps<ParamListBase>) => {
  const { libraryContract } = useContext(ApplicationContext);
  const [name, setName] = useState('');
  const [copies, setCopies] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [transactionHash, setTransactionHash] = useState('');
  const [loading, setLoading] = useState(false);

  const addBookHandler = async () => {
    if (!libraryContract) {
      return;
    }
    try {
      await setLoading(true);
      const transaction = await libraryContract.addBook(name, copies);
      await setTransactionHash(transaction.hash);
      const transactionReceipt = await transaction.wait();
      if (transactionReceipt.status !== 1) {
        // Handle error
      }
    } catch (exc: any) {
      let message = 'Something weng wron! Please try again!';
      if (exc.error && exc.error.message) {
        message = exc.error.message.split(':')[1].trim();
      } else if (exc.message) {
        message = exc.message.split(':')[1].trim();
      }
      setErrorMessage(message);
    }
    await clearInputs();
    await setTransactionHash('');
    await setLoading(false);
  };

  const clearInputs = async () => {
    await setName('');
    await setCopies(null);
  };

  const handleInputChange = async (name: InputNames, value: string) => {
    setErrorMessage('');
    if (name === InputNames.BookName) {
      setName(value);
    } else {
      setCopies(Number(value));
    }
  };
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        disabled={loading}
        value={name}
        placeholder="Book name"
        onChangeText={(text) => {
          handleInputChange(InputNames.BookName, text);
        }}
      />
      <TextInput
        style={styles.input}
        disabled={loading}
        value={copies ? String(copies) : ''}
        placeholder="Book copies"
        onChangeText={(text) => {
          handleInputChange(InputNames.BookCopies, text);
        }}
        keyboardType="numeric"
      />
      <Button
        title="Add Book"
        onPress={addBookHandler}
        disabled={loading || !name || copies === null}
        style={styles.button}
      />
      {!!transactionHash && (
        <Text
          style={styles.transactionLabel}
          onPress={() => Linking.openURL(`https://ropsten.etherscan.io/tx/${transactionHash}`)}
        >
          Processing transaction
        </Text>
      )}
      {!!errorMessage && <Text style={styles.errorLabel}>Error: {String(errorMessage)}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 8,
  },
  input: {
    marginVertical: 8,
  },
  button: {
    width: '100%',
    marginVertical: 8,
  },
  transactionLabel: {
    textDecorationLine: 'underline',
    color: '#5A45FF',
    width: '100%',
    textAlign: 'center',
    marginVertical: 8,
  },
  errorLabel: {
    backgroundColor: 'rgb(214, 75, 71)',
    color: 'white',
    padding: 4,
  },
});

export default AddBookScreen;
