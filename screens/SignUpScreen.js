import { StyleSheet, View, Image, Pressable } from "react-native";
import Title from "../components/Title";
import Input from "../components/Input";
import ButtonCostum from "../components/ButtonCostum";

export default function SignUpScreen() {
  const handleSignUp = () => {
    console.log("signed up");
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
          <Input>E-mail</Input>
          <Input isSecure={true}>Password</Input>
        </View>
        <View style={styles.buttonContainer}>
          <ButtonCostum onPressed={handleSignUp}>Sign Up</ButtonCostum>
        </View>
        <View style={styles.textContainer}>
          <Text>You have an account?</Text>
          <Pressable>
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
