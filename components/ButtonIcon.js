import { Pressable, Text, StyleSheet } from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";

export default function ButtonIcon({ name, text }) {
  return (
    <Pressable style={styles.buttonContainer}>
      <Ionicons name={name} size={24} color="black" />
      <Text>{text}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: "center",
  },
});
