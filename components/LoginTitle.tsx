import React from "react"
import { StyleSheet, Text, View } from "react-native";

const LoginTitle = () => {
  return (
    <View style={styles.titleContainer}>
      <Text style={styles.title}>
        React-Native DAPP Boilerplate
      </Text>
    </View>
  );
}

export default LoginTitle;

const styles = StyleSheet.create({
  titleContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    fontSize: 48,
    fontWeight: 'bold'
  }
});