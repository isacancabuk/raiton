import { StyleSheet, Pressable, Text } from "react-native";
import Colors from "../constants/color";

export default function ButtonCostum({
  onPressed,
  children,
  disabled = false,
}) {
  return (
    <Pressable
      style={[styles.button, disabled && styles.buttonDisabled]}
      onPress={onPressed}
      disabled={disabled}
    >
      <Text style={[styles.buttonText, disabled && styles.buttonTextDisabled]}>
        {children}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 50,
    backgroundColor: Colors.secondary500,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  buttonDisabled: {
    backgroundColor: Colors.accent700,
  },
  buttonText: {
    fontFamily: "Roboto-Bold",
    fontSize: 26,
    color: Colors.textBack500,
  },
  buttonTextDisabled: {
    color: "#999",
  },
});
