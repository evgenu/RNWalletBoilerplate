import { ParamListBase } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const BooksOverviewScreen = ({ navigation }: NativeStackScreenProps<ParamListBase>) => {
  return (
    <View style={styles.container}>
      <Text>BooksOverviewScreen</Text>
    </View>
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
