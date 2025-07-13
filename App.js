import { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";

import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

import LoginScreen from "./screens/LoginScreen";
import MainScreen from "./screens/MainScreen";
import AdminScreen from "./screens/AdminScreen";
import SignUpScreen from "./screens/SignUpScreen";
import HistoryScreen from "./screens/HistoryScreen";
import ProfileScreen from "./screens/ProfileScreen";
import ButtonIcon from "./components/ButtonIcon"; // Footer için import

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);
  const [authScreen, setAuthScreen] = useState("login");
  // YENİ STATE: Hangi sekmenin aktif olduğunu tutar
  const [activeScreen, setActiveScreen] = useState("Map");

  async function onAuthStateChanged(user) {
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
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  if (initializing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // Giriş yapılmamışsa, giriş/kayıt ekranlarını göster
  if (!user) {
    if (authScreen === "login") {
      return <LoginScreen onSwitchToSignUp={() => setAuthScreen("signup")} />;
    } else {
      return <SignUpScreen onSwitchToLogin={() => setAuthScreen("login")} />;
    }
  }

  // Admin ise, admin ekranını göster
  if (user.role === "admin") {
    return <AdminScreen />;
  }

  // Normal kullanıcı ise, sekmeli ana uygulamayı göster
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.appContainer}>
        {activeScreen === "Map" && <MainScreen />}
        {activeScreen === "History" && <HistoryScreen />}
        {activeScreen === "Profile" && <ProfileScreen />}
      </View>
      {/* Footer artık burada ve aktif ekranı yönetiyor */}
      <View style={styles.footer}>
        <ButtonIcon
          name="map"
          text="Map"
          isActive={activeScreen === "Map"}
          onPress={() => setActiveScreen("Map")}
        />
        <ButtonIcon
          name="list"
          text="History"
          isActive={activeScreen === "History"}
          onPress={() => setActiveScreen("History")}
        />
        <ButtonIcon
          name="person"
          text="Profile"
          isActive={activeScreen === "Profile"}
          onPress={() => setActiveScreen("Profile")}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  safeArea: { flex: 1, backgroundColor: "white" },
  appContainer: { flex: 1 },
  footer: {
    height: 90,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-start", // İkonları üste daha yakın tutar
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
  },
});
