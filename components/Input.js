import { StyleSheet, TextInput } from "react-native";
import Colors from "../constants/color";

export default function Input({
  children,
  onChangeInput,
  inputValue,
  isSecure = false,
}) {
  return (
    <TextInput
      placeholder={children}
      autoCapitalize="none"
      autoCorrect={false}
      maxLength={18}
      secureTextEntry={isSecure}
      value={inputValue}
      onChangeText={onChangeInput}
      style={styles.input}
    ></TextInput>
  );
}

const styles = StyleSheet.create({
  input: {
    color: Colors.primary700,
    width: 250,
    fontSize: 20,
    fontFamily: "Roboto-Regular",
    paddingVertical: 8,
    marginBottom: 14,
    borderColor: Colors.primary500,
    borderBottomWidth: 1,
  },
});
