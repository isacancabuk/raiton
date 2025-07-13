import { StyleSheet, Pressable, Text } from "react-native";

// disabled prop'u eklendi
export default function ButtonCostum({
  onPressed,
  children,
  disabled = false,
}) {
  return (
    // disabled durumuna göre stil ve onPress olayı ayarlandı
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
    height: 44,
    backgroundColor: "red",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  buttonDisabled: {
    backgroundColor: "#ccc", // Devre dışı rengi
  },
  buttonText: {
    fontSize: 22,
    color: "white", // Yazı rengi beyaz yapıldı
  },
  buttonTextDisabled: {
    color: "#999",
  },
});
