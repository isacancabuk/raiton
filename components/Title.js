import { StyleSheet, Text } from "react-native";

export default function Title() {
  return <Text style={styles.text}>RATION</Text>;
}

const styles = StyleSheet.create({
  text: {
    fontSize: 48,
  },
});
