import { StyleSheet, TextInput } from "react-native";

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
    width: 250,
    fontSize: 18,
    paddingVertical: 8,
    marginBottom: 8,
    borderColor: "black",
    borderBottomWidth: 1,
  },
});
