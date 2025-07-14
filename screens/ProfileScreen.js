import React, { useState, useEffect } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";

import Title from "../components/Title";
import ButtonCostum from "../components/ButtonCostum";
import InfoContainer from "../components/InfoContainer";

import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

export default function ProfileScreen() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = auth().currentUser;
    if (currentUser) {
      const subscriber = firestore()
        .collection("users")
        .doc(currentUser.uid)
        .onSnapshot((documentSnapshot) => {
          if (documentSnapshot.exists) {
            setUserData(documentSnapshot.data());
          } else {
            console.log("User does not exist in Firestore");
          }
          setLoading(false);
        });
      return () => subscriber();
    }
  }, []);

  const handleLogout = () => {
    auth().signOut();
  };

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#000" style={styles.loader} />
    );
  }

  return (
    <View style={styles.container}>
      <Title />
      <InfoContainer name="E-mail:" value={userData.email} />
      <InfoContainer name="Name:" value={userData.name} />
      <InfoContainer name="Surname:" value={userData.surname} />
      <InfoContainer name="Car Brand:" value={userData.carBrand} />
      <View style={styles.logoutButtonContainer}>
        <ButtonCostum onPressed={handleLogout}>Logout</ButtonCostum>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    marginHorizontal: 10,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  logoutButtonContainer: {
    marginTop: "auto",
    width: "100%",
  },
});
