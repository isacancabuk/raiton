import { Pressable, Text, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

// onPress ve isActive propları eklendi
export default function ButtonIcon({ name, text, onPress, isActive }) {
  // Aktif durumuna göre renk ve ikon stilini ayarla
  const iconColor = isActive ? "#007AFF" : "#8A8A8E"; // Apple'ın sistem renkleri
  const textColor = isActive ? "#007AFF" : "#8A8A8E";
  const iconName = isActive ? name : `${name}-outline`;

  return (
    <Pressable style={styles.buttonContainer} onPress={onPress}>
      <Ionicons name={iconName} size={28} color={iconColor} />
      <Text style={[styles.text, { color: textColor }]}>{text}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: "center",
    flex: 1, // Butonların footer'ı eşit şekilde doldurmasını sağlar
  },
  text: {
    marginTop: 2,
    fontSize: 10,
    fontWeight: "500",
  },
});
