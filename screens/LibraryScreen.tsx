import { isAddress } from '@ethersproject/address';
import { formatEther } from '@ethersproject/units';
import { ParamListBase } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LIRARY from '../abis/Library.json';
import LIRARY_TOKEN from '../abis/LibraryToken.json';
import Button from '../components/common/Button';
import { ApplicationScreens } from '../consts';
import ApplicationContext from '../context';
import { getContract } from '../helpers/ethers';

const LibraryScreen = ({ navigation }: NativeStackScreenProps<ParamListBase>) => {
  const {
    address,
    web3Provider,
    tokenContract,
    libraryContract,
    libraryBalance,
    setLibraryBalance,
    setLibraryContract,
    setTokenContract,
  } = useContext(ApplicationContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initContractInstances();
  }, []);

  useEffect(() => {
    getLibraryBalance();
  }, [tokenContract]);

  useEffect(() => {
    unsubscribe();
    subscribe();
    return () => {
      unsubscribe();
    };
  }, [libraryContract]);

  const subscribe = () => {
    if (libraryContract) {
      libraryContract.on('BookAdded', getLibraryBalance);
      libraryContract.on('BookTaken', getLibraryBalance);
      libraryContract.on('BookReturned', getLibraryBalance);
    }
  };

  const unsubscribe = () => {
    if (libraryContract) {
      libraryContract.off('BookAdded', getLibraryBalance);
      libraryContract.off('BookTaken', getLibraryBalance);
      libraryContract.off('BookReturned', getLibraryBalance);
    }
  };

  const getLibraryBalance = async () => {
    if (tokenContract) {
      try {
        const libraryBalance = await tokenContract.balanceOf(process.env.LIBRARY_CONTRACT_ADDRESS);
        setLibraryBalance(formatEther(libraryBalance));
        setLoading(false);
      } catch (error) {
        console.log('Error -> ', JSON.stringify(error));
      }
    }
  };

  const initContractInstances = () => {
    if (isAddress(address) && web3Provider) {
      const libraryContract = getContract(
        process.env.LIBRARY_CONTRACT_ADDRESS || '',
        LIRARY.abi,
        web3Provider,
        address
      );
      const tokenContract = getContract(
        process.env.LIBRARY_TOKEN_ADDRESS || '',
        LIRARY_TOKEN.abi,
        web3Provider,
        address
      );
      setTokenContract(tokenContract);
      setLibraryContract(libraryContract);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Library balance: {loading ? 'Loading...' : libraryBalance}</Text>
      <Button
        style={styles.button}
        title="Add book"
        onPress={() => {
          navigation.navigate(ApplicationScreens.AddBook);
        }}
      />
      <Button
        style={styles.button}
        title="Books overview"
        onPress={() => {
          navigation.navigate(ApplicationScreens.BooksOverview);
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
    margin: 8,
  },
});

export default LibraryScreen;
