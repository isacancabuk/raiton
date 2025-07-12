import { useState, useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";

import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

import LoginScreen from "./screens/LoginScreen";
import MainScreen from "./screens/MainScreen";
import AdminScreen from "./screens/AdminScreen";
import SignUpScreen from "./screens/SignUpScreen";

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);
  const [authScreen, setAuthScreen] = useState("login");

  const onAuthStateChanged = async (user) => {
    if (user) {
      const userDocument = await firestore()
        .collection("users")
        .doc(user.uid)
        .get();
      const userData = userDocument.data();
      setUser({ ...user, role: userData.role });
    } else {
      setUser(null);
    }
    if (initializing) {
      setInitializing(false);
    }
  };

  // Component ilk yüklendiğinde oturum dinleyicisini başlat
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  if (initializing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff0000" />
      </View>
    );
  }

  let screen;
  if (!user) {
    if (authScreen === "login") {
      screen = <LoginScreen onSwitchToSignUp={() => setAuthScreen("signup")} />;
    } else {
      screen = <SignUpScreen onSwitchToLogin={() => setAuthScreen("login")} />;
    }
  } else {
    if (user.role === "admin") {
      screen = <AdminScreen />;
    } else {
      screen = <MainScreen />;
    }
  }

  return <View style={styles.container}>{screen}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
