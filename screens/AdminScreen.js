import { StyleSheet, View, Text } from "react-native";

import auth from "@react-native-firebase/auth";
import ButtonCostum from "../components/ButtonCostum";

export default function AdminScreen() {
  const handleLogout = () => {
    auth()
      .signOut()
      .then(() => console.log("User signed out!"));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Admin Login Successful</Text>
      <View style={styles.buttonContainer}>
        <ButtonCostum onPressed={handleLogout}>Logout</ButtonCostum>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  buttonContainer: {
    width: "80%",
  },
});
