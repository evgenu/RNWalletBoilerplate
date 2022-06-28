import { View, Text, StyleSheet } from 'react-native';
import React from 'react';

const LibraryScreen = () => {
  return (
    <View style={styles.container}>
      <Text>LibraryScreen</Text>
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
});

export default LibraryScreen;
