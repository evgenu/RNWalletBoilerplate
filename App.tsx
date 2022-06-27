import "./global";
import "@ethersproject/shims";
import AsyncStorage from "@react-native-async-storage/async-storage";
import WalletConnectProvider from "@walletconnect/react-native-dapp";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { Platform, SafeAreaView, StyleSheet } from "react-native";
import WalletConnectExperience from "./screens/WalletConnectScreen";

const SCHEME_FROM_APP_JSON = "walletconnect";

export default function App() {
  return (
    <WalletConnectProvider
      redirectUrl={
        Platform.OS === "web"
          ? window.location.origin
          : `${SCHEME_FROM_APP_JSON}://`
      }
      storageOptions={{
        asyncStorage: AsyncStorage as any,
      }}
    >
      <SafeAreaView style={styles.container}>
        <WalletConnectExperience />
        <StatusBar style="auto" />
      </SafeAreaView>
    </WalletConnectProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
