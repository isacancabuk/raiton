import { View, Text, StyleSheet } from "react-native";

import auth from "@react-native-firebase/auth";
import ButtonCostum from "../components/ButtonCostum";
import ButtonIcon from "../components/ButtonIcon";

export default function MainScreen() {
  const handleLogout = () => {
    auth().signOut();
  };

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}></View>
      <View style={styles.footer}>
        <ButtonIcon name="save" text="History" />
        <ButtonIcon name="map" text="Map" />
        <ButtonIcon name="person" text="Profile" />
      </View>
      {/* <ButtonCostum onPressed={handleLogout}>Logout</ButtonCostum> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 100,
  },
  mapContainer: {
    flex: 8,
    backgroundColor: "blue",
  },
  footer: {
    flex: 1,
    backgroundColor: "yellow",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
});
