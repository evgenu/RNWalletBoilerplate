import React from "react";
import Button from "./Button";

const LogoutButton = ({ onPress }: any) => {
  return (
    <Button onPress={onPress} label="Log out" />
  );
}

export default LogoutButton;