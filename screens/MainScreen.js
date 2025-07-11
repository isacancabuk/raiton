import { View, Text, StyleSheet } from "react-native";

export default function MainScreen() {
  return (
    <View style={styles.container}>
      <Text>Login successfull</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 100,
  },
});
