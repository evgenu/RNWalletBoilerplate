import { formatEther, parseEther } from '@ethersproject/units';
import { ParamListBase } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import BookOverview from '../components/BookOverview';
import ApplicationContext from '../context';
import { BorrowStatus, IBook } from '../entities';
import { prepareSignature } from '../helpers/ethers';

const BORROW_FEE_STRING = '0.05';
const BORROW_FEE = parseEther(BORROW_FEE_STRING);

const BooksOverviewScreen = ({ navigation }: NativeStackScreenProps<ParamListBase>) => {
  const { libraryContract, tokenContract, web3Provider, address } = useContext(ApplicationContext);
  const [loading, setLoading] = useState(true);
  const [loadingTokenBalance, setLoadingTokenBalance] = useState(true);
  const [books, setBooks] = useState<IBook[]>([]);
  const [tokenBalance, setTokenBalance] = useState('');

  useEffect(() => {
    fetchBooks();
    unsubscribe();
    subscribe();
    getTokenBalance();
    return () => {
      unsubscribe();
    };
  }, [libraryContract]);

  const getTokenBalance = async () => {
    if (tokenContract) {
      try {
        const balance = await tokenContract.balanceOf(address);
        await setTokenBalance(formatEther(balance));
        await setLoadingTokenBalance(false);
      } catch (error) {
        console.log('Error -> ', JSON.stringify(error));
        await setLoadingTokenBalance(false);
      }
    }
  };

  const approve = async () => {
    if (tokenContract) {
      const approveTransaction = await tokenContract.approve(
        process.env.LIBRARY_CONTRACT_ADDRESS || '',
        BORROW_FEE
      );
      const approveTransactionReceipt = await approveTransaction.wait();
      if (approveTransactionReceipt.status !== 1) {
        console.log('Error');
        // showNotification("Error!")
      }
    }
  };

  const fetchBooks = async () => {
    if (libraryContract) {
      const totalBooks = await libraryContract.getAllBooksLength();
      const totalBooksNumber = Number(totalBooks);
      const bookIds = [];
      if (!!totalBooksNumber) {
        for (let index = 0; index < totalBooksNumber; index++) {
          const bookId = await libraryContract.bookIds(index);
          bookIds.push(bookId);
        }
        if (bookIds.length) {
          const books: IBook[] = [];
          for (let index = 0; index < bookIds.length; index++) {
            const bookId = bookIds[index];
            const book = await libraryContract.books(bookId);
            const borrowStatus: BorrowStatus = await libraryContract.getCurrentBorrowStatus(bookId);
            books.push({
              id: bookId,
              name: book.name,
              copies: book.copies,
              borrowStatus,
            });
          }
          await setBooks(books);
          await setLoading(false);
        }
      } else {
        await setLoading(false);
      }
    }
  };

  const getBook = async (id: string, withPermit?: boolean) => {
    if (libraryContract && tokenContract && web3Provider) {
      await setLoading(true);
      try {
        let transaction;
        if (withPermit) {
          const { v, r, s, deadline } = await prepareSignature(
            tokenContract,
            address,
            web3Provider,
            BORROW_FEE
          );
          transaction = await libraryContract.getBookWithPermit(id, BORROW_FEE, deadline, v, r, s);
        } else {
          await approve();
          transaction = await libraryContract.getBook(id);
        }
        const transactionReceipt = await transaction.wait();
        if (transactionReceipt.status !== 1) {
          // showNotification("Get book failed!");
          console.log('Get book failed!');
        }
      } catch (exception: any) {
        if (exception) {
          if (exception.error) {
            // showNotification(exception.error.message);
            console.log(exception.error.message);
          } else {
            // showNotification(exception.message);
            console.log(exception.message);
          }
        }
        await setLoading(false);
      }
    }
  };

  const returnBook = async (id: string) => {
    if (libraryContract) {
      await setLoading(true);
      try {
        const transaction = await libraryContract.returnBook(id);
        const transactionReceipt = await transaction.wait();
        if (transactionReceipt.status !== 1) {
          console.log('Return book failed!');
          // showNotification("Return book failed!")
        }
      } catch (exception: any) {
        if (exception) {
          if (exception.error) {
            console.log(exception.error.message);
            // showNotification(exception.error.message);
          } else {
            console.log(exception.message);
            // showNotification(exception.message);
          }
        }
        await setLoading(false);
      }
    }
  };

  const subscribe = () => {
    if (libraryContract) {
      libraryContract.on('BookAdded', handleBookAddedEvent);
      libraryContract.on('BookTaken', handleBookTakenEvent);
      libraryContract.on('BookReturned', handleBookReturnedEvent);
    }
  };

  const unsubscribe = () => {
    if (libraryContract) {
      libraryContract.off('BookAdded', handleBookAddedEvent);
      libraryContract.off('BookTaken', handleBookTakenEvent);
      libraryContract.off('BookReturned', handleBookReturnedEvent);
    }
  };

  const handleBookReturnedEvent = async (bookId: string) => {
    // showNotification(`Book '${bookId}' returned successfully!`);
    console.log(`Book '${bookId}' returned successfully!`);
    await fetchBooks();
    await getTokenBalance();
  };

  const handleBookAddedEvent = async (bookId: string, name: string, copies: number, _: any) => {
    console.log('BookId -> ', bookId);
    console.log('name -> ', name);
    console.log('copies -> ', copies);
    // showNotification(`Book '${name}' was added successfully!`);
    console.log(`Book '${name}' was added successfully!`);
    await fetchBooks();
  };

  const handleBookTakenEvent = async (bookId: string) => {
    // showNotification(`Book '${bookId}' taken successfully!`);
    console.log(`Book '${bookId}' taken successfully!`);
    await fetchBooks();
    await getTokenBalance();
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text>
          Balance: {loadingTokenBalance ? 'Loading balance...' : `${tokenBalance} LIB` || 'N/A'}
        </Text>
        {loading && <Text>Loading books...</Text>}
        {!loading &&
          books.map((item) => (
            <BookOverview key={item.id} item={item} onGetBook={getBook} onReturnBook={returnBook} />
          ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 8,
  },
});

export default BooksOverviewScreen;
