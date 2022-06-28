import React from 'react';
import { StyleSheet, TextInput as NativeTextInput, TextInputProps } from 'react-native';

interface ITextInputProps extends TextInputProps {
  disabled?: boolean;
}

const TextInput = ({ disabled, ...rest }: ITextInputProps) => {
  return (
    <NativeTextInput
      editable={!disabled}
      selectTextOnFocus={!disabled}
      style={{ ...styles.input, ...(disabled ? styles.disabled : {}) }}
      selectionColor="#5A45FF"
      {...rest}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    width: '100%',
    padding: 8,
    borderWidth: 1,
    borderColor: '#5A45FF',
    marginVertical: 8,
  },
  disabled: {
    backgroundColor: '#D1D1D1',
    borderColor: '#B1B1B1',
  },
});

export default TextInput;
