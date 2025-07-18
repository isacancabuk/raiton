import { useState, useEffect } from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

import LoginScreen from "./screens/LoginScreen";
import MainScreen from "./screens/MainScreen";
import AdminScreen from "./screens/AdminScreen";
import SignUpScreen from "./screens/SignUpScreen";
import HistoryScreen from "./screens/HistoryScreen";
import ProfileScreen from "./screens/ProfileScreen";
import ButtonIcon from "./components/ButtonIcon";
import Colors from "./constants/color";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    "Audiowide-Regular": require("./assets/fonts/Audiowide-Regular.ttf"),
    "Roboto-Light": require("./assets/fonts/Roboto-Light.ttf"),
    "Roboto-Regular": require("./assets/fonts/Roboto-Regular.ttf"),
    "Roboto-Bold": require("./assets/fonts/Roboto-Bold.ttf"),
  });
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);
  const [authScreen, setAuthScreen] = useState("login");
  const [activeScreen, setActiveScreen] = useState("Map");

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

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

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  if (initializing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!user) {
    if (authScreen === "login") {
      return <LoginScreen onSwitchToSignUp={() => setAuthScreen("signup")} />;
    } else {
      return <SignUpScreen onSwitchToLogin={() => setAuthScreen("login")} />;
    }
  }

  if (user.role === "admin") {
    return <AdminScreen />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.appContainer}>
        {activeScreen === "Map" && <MainScreen />}
        {activeScreen === "History" && <HistoryScreen />}
        {activeScreen === "Profile" && <ProfileScreen />}
      </View>
      <View style={styles.footer}>
        <ButtonIcon
          name="book"
          text="History"
          isActive={activeScreen === "History"}
          onPress={() => setActiveScreen("History")}
        />
        <ButtonIcon
          name="map"
          text="Map"
          isActive={activeScreen === "Map"}
          onPress={() => setActiveScreen("Map")}
        />
        <ButtonIcon
          name="person"
          text="Profile"
          isActive={activeScreen === "Profile"}
          onPress={() => setActiveScreen("Profile")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  appContainer: {
    flex: 1,
  },
  footer: {
    height: 90,
    backgroundColor: Colors.textBack500,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-start",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.textBack700,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
