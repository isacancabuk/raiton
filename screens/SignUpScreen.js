import { useState } from "react";

import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

import { StyleSheet, View, Image, Pressable, Text, Alert } from "react-native";

import Title from "../components/Title";
import Input from "../components/Input";
import ButtonCostum from "../components/ButtonCostum";
import Logo from "../assets/images/logosvg.svg";
import Colors from "../constants/color";

export default function SignUpScreen({ onSwitchToLogin }) {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [carBrand, setCarBrand] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async () => {
    if (!name || !surname || !carBrand || !email || !password) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    try {
      // 1. Adım: Firebase Authentication ile kullanıcı oluşturma
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password
      );
      const user = userCredential.user;
      console.log("Kullanıcı başarıyla oluşturuldu:", user.uid);

      // 2. Adım: Firestore'a kullanıcı rolünü kaydetme
      await firestore().collection("users").doc(user.uid).set({
        name: name,
        surname: surname,
        carBrand: carBrand,
        role: "user",
        email: email,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
      console.log("User data added to Firestore!");

      Alert.alert(
        "Sign Up Successful!",
        "Your account has been created. You can now log in.",
        [{ text: "OK", onPress: onSwitchToLogin }]
      );
    } catch (error) {
      let errorMessage = "An error occurred. Please try again.";

      if (error.code === "auth/email-already-in-use") {
        errorMessage = "That email address is already in use!";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "That email address is invalid!";
      } else if (error.code === "auth/weak-password") {
        errorMessage =
          "The password is too weak. It must be at least 6 characters long.";
      }

      console.error("Sign up error:", error);
      Alert.alert("Sign Up Failed", errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Logo width={140} height={140} stroke={Colors.primary500} />
        <Title />
      </View>
      <View style={styles.inputContainer}>
        <View>
          <Input onChangeInput={setName} inputValue={name}>
            Your Name
          </Input>
          <Input onChangeInput={setSurname} inputValue={surname}>
            Your Surname
          </Input>
          <Input onChangeInput={setCarBrand} inputValue={carBrand}>
            Your Car Brand
          </Input>
          <Input onChangeInput={setEmail} inputValue={email}>
            E-mail
          </Input>
          <Input
            onChangeInput={setPassword}
            inputValue={password}
            isSecure={true}
          >
            Password
          </Input>
        </View>
        <View style={styles.buttonContainer}>
          <ButtonCostum onPressed={handleSignUp}>Sign Up</ButtonCostum>
        </View>
        <View style={styles.textContainer}>
          <Text>You have an account?</Text>
          <Pressable onPress={onSwitchToLogin}>
            <Text style={styles.textLogin}>Login</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    flexDirection: "row",
    marginTop: 100,
    marginHorizontal: 20,
    alignItems: "center",
  },
  inputContainer: {
    margin: 30,
  },
  buttonContainer: {
    marginTop: 20,
  },
  textContainer: {
    marginTop: 5,
    flexDirection: "row",
  },
  textLogin: {
    marginLeft: 4,
    color: Colors.accent700,
  },
});
