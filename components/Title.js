import { StyleSheet, Text } from "react-native";
import Colors from "../constants/color";

export default function Title() {
  return <Text style={styles.text}>RATION</Text>;
}

const styles = StyleSheet.create({
  text: {
    marginTop: 10,
    color: Colors.primary500,
    fontSize: 48,
    fontFamily: "Audiowide-Regular",
  },
});
