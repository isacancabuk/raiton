import React from "react";
import { View, Text, StyleSheet } from "react-native";
import ButtonCostum from "../components/ButtonCostum";
import auth from "@react-native-firebase/auth";

// Bu ekran, kullanıcı bilgilerini ve çıkış butonunu barındıracak.
export default function ProfileScreen() {
  const handleLogout = () => {
    auth().signOut();
  };

  const user = auth().currentUser;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.info}>{user?.email}</Text>
      </View>
      <View style={styles.logoutButtonContainer}>
        <ButtonCostum onPressed={handleLogout}>Logout</ButtonCostum>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 24,
  },
  infoContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: "#666",
  },
  info: {
    fontSize: 18,
    marginTop: 4,
  },
  logoutButtonContainer: {
    marginTop: "auto", // Butonu en alta iter
  },
});
