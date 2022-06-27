import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface IButtonProps {
  label: string;
  style?: any;
  onPress: () => void;
}

const Button = ({ label, style, onPress }: IButtonProps) => {
  return (
    <TouchableOpacity onPress={onPress} style={{ ...styles.button, ...(style ? style : {}) }}>
      <Text style={styles.text}>{label}</Text>
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
});

export default Button;