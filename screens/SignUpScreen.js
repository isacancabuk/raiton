import { useState } from "react";

import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

import { StyleSheet, View, Image, Pressable, Text } from "react-native";
import Title from "../components/Title";
import Input from "../components/Input";
import ButtonCostum from "../components/ButtonCostum";

export default function SignUpScreen({ onSwitchToLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async () => {
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
        role: "user",
        email: email,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
      console.log("Kullanıcı rolü Firestore'a eklendi!");

      Alert.alert(
        "Kayıt Başarılı!",
        "Hesabınız başarıyla oluşturuldu. Giriş yapabilirsiniz.",
        [{ text: "Tamam", onPress: onSwitchToLogin }]
      );
    } catch (error) {
      let errorMessage = "Bir hata oluştu. Lütfen tekrar deneyin.";
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "Bu e-posta adresi zaten kullanılıyor!";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Geçersiz bir e-posta adresi girdiniz!";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Şifre çok zayıf. En az 6 karakter olmalı.";
      }
      console.error(error);
      Alert.alert("Kayıt Başarısız", errorMessage);
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
          <Input>Your Name</Input>
          <Input>Your Surname</Input>
          <Input>Your Car Brand</Input>
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
            <Text>Login</Text>
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
    marginTop: 50,
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 200,
  },
  inputContainer: {
    margin: 20,
  },
  buttonContainer: {
    margin: 16,
  },
  textContainer: {
    flexDirection: "row",
  },
});
