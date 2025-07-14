import { StyleSheet, View, Text } from "react-native";
import Colors from "../constants/color";

export default function InfoContainer({ name, value }) {
  return (
    <View style={styles.infoContainer}>
      <Text style={styles.label}>{name}</Text>
      <Text style={styles.info}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  infoContainer: {
    width: "100%",
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    fontFamily: "Roboto-Bold",
    fontSize: 24,
    color: Colors.secondary500,
    marginBottom: 8,
  },
  info: {
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    textAlign: "right",
    color: Colors.accent700,
  },
});
