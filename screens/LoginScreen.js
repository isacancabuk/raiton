import { useState } from "react";

import auth from "@react-native-firebase/auth";

import { StyleSheet, Text, View, Image, Pressable } from "react-native";

import Input from "../components/Input";
import Title from "../components/Title";
import ButtonCostum from "../components/ButtonCostum";

export default function LoginScreen({ onLogin, onSwitchToSignUp }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleInputEmail = (enteredText) => {
    setEmail(enteredText);
  };
  const handleInputPassword = (enteredText) => {
    setPassword(enteredText);
  };

  const handleSignUp = () => onSwitchToSignUp();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Email and password fields cannot be empty.");
      return;
    }

    try {
      await auth().signInWithEmailAndPassword(email, password);
      console.log("Login successful!");
    } catch (error) {
      let errorMessage = "An error occurred. Please try again.";
      if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password"
      ) {
        errorMessage = "Invalid email or password.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "That email address is invalid!";
      }

      console.error("Login error:", error);
      Alert.alert("Login Failed", errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require("../assets/images/logo.png")}
          style={styles.image}
        />
        <Title />
      </View>
      <View style={styles.inputContainer}>
        <View>
          <Input onChangeInput={handleInputEmail} inputValue={email}>
            E-mail
          </Input>
          <Input
            onChangeInput={handleInputPassword}
            inputValue={password}
            isSecure={true}
          >
            Password
          </Input>
        </View>
        <View style={styles.forgotContainer}>
          <Pressable>
            <Text style={styles.forgotText}>Forgot Your</Text>

            <Text style={styles.forgotText}>Password?</Text>
          </Pressable>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <ButtonCostum onPressed={handleLogin}>Login</ButtonCostum>
        <ButtonCostum onPressed={handleSignUp}>Sign Up</ButtonCostum>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-around",
  },
  imageContainer: {
    alignItems: "center",
    marginTop: 100,
  },
  image: {
    width: 250,
    height: 250,
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    margin: 20,
  },
  forgotContainer: {
    marginTop: 30,
    justifyContent: "start",
    alignItems: "flex-start",
  },
  forgotText: {
    fontSize: 14,
    paddingBottom: 3,
  },
  buttonContainer: {
    margin: 16,
  },
});
