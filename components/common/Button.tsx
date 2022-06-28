import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface IButtonProps {
  title: string;
  style?: any;
  disabled?: boolean;
  onPress: () => void;
}

const Button = ({ title, style, disabled, onPress }: IButtonProps) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={{ ...styles.button, ...(disabled ? styles.disabled : {}), ...(style ? style : {}) }}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#5A45FF',
    color: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  disabled: {
    backgroundColor: '#D1D1D1',
  },
});

export default Button;
