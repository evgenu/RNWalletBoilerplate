import { ParamListBase } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Button from '../components/common/Button';
import { ApplicationScreens } from '../consts';

const LibraryScreen = ({ navigation }: NativeStackScreenProps<ParamListBase>) => {
  return (
    <View style={styles.container}>
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
