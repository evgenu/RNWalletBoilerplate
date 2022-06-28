import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { BorrowStatus, IBook } from '../entities';
import { shortenAddress } from '../helpers/ethers';
import Button from './common/Button';

interface IBookOverviewProps {
  item: IBook;
  onGetBook: (id: string, withPermit: boolean) => void;
  onReturnBook: (id: string) => void;
}

const BookOverview = ({ item, onGetBook, onReturnBook }: IBookOverviewProps) => {
  return (
    <View style={styles.card}>
      <Text>ID: {shortenAddress(item.id)}</Text>
      <Text>Title: {item.name}</Text>
      <Text>Copies: {item.copies}</Text>
      <Text>Status: {item.borrowStatus === BorrowStatus.Holding ? 'Taken' : 'Not taken'}</Text>
      <View style={styles.getBookActionsContainer}>
        <Button
          title="Get Book"
          disabled={!item.copies || item.borrowStatus === BorrowStatus.Holding}
          onPress={() => {
            onGetBook(item.id, false);
          }}
          style={styles.getBookButton}
        />
        <Button
          title="Get with permit"
          disabled={!item.copies || item.borrowStatus === BorrowStatus.Holding}
          onPress={() => {
            onGetBook(item.id, true);
          }}
          style={styles.getBookButton}
        />
      </View>
      <Button
        title="Return Book"
        disabled={item.borrowStatus !== BorrowStatus.Holding}
        onPress={() => {
          onReturnBook(item.id);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: 'white',
    paddingVertical: 16,
    paddingHorizontal: 8,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  getBookActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 8,
  },
  getBookButton: {
    width: '45%',
  },
});

export default BookOverview;
