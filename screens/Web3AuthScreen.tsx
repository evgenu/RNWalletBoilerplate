import React from 'react';
import { StyleSheet, View } from 'react-native';
import Button from '../components/Button';

interface IWeb3AuthScreen {
  onClose: () => void;
}

const Web3AuthScreen = ({ onClose }: IWeb3AuthScreen) => {
  return (
    <View style={styles.container}>
      <Button label="Back" onPress={onClose} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    width: '100%',
  },
});

export default Web3AuthScreen;
