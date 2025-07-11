import { StyleSheet, Pressable, Text } from "react-native";

export default function ButtonCostum({ onPressed, children }) {
  return (
    <Pressable style={styles.button} onPress={onPressed}>
      <Text style={styles.buttonText}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 44,
    backgroundColor: "red",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 22,
  },
});
