import React from 'react';
import { StyleSheet, TextInput as NativeTextInput, TextInputProps } from 'react-native';

const TextInput = ({ ...rest }: TextInputProps) => {
  return <NativeTextInput style={styles.input} selectionColor="#5A45FF" {...rest} />;
};

const styles = StyleSheet.create({
  input: {
    width: '100%',
    padding: 8,
    borderWidth: 1,
    borderColor: '#5A45FF',
    marginVertical: 8,
  },
});

export default TextInput;
