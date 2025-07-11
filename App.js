import { useState } from "react";
import { StyleSheet } from "react-native";

import LoginScreen from "./screens/LoginScreen";
import MainScreen from "./screens/MainScreen";
import AdminScreen from "./screens/AdminScreen";
import SignUpScreen from "./screens/SignUpScreen";

export default function App() {
  const [authScreen, setAuthScreen] = useState("login");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };
  const handleSignUp = (statue) => {
    console.log(authScreen);
    setAuthScreen(statue);
  };

  let screen = <LoginScreen onLogin={handleLogin} onSignUp={handleSignUp} />;
  if (authScreen === "signup") screen = <SignUpScreen />;

  if (isLoggedIn) screen = <MainScreen />;

  return <>{screen}</>;
}

const styles = StyleSheet.create({});
