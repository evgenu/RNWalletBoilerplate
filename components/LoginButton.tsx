import React from "react";
import Button from "./Button";

const LoginButton = ({ onPress }: any) => {
  return (
    <Button onPress={onPress} label="Connect a wallet" />
  );
}

export default LoginButton;