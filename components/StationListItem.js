import { StyleSheet, View, Text, Pressable } from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";
import Colors from "../constants/color";

export default function StationListItem({ item, onEdit }) {
  return (
    <View style={styles.itemContainer}>
      <View style={styles.itemTextContainer}>
        <Text style={styles.stationName}>{item.name}</Text>
        <Text style={styles.stationAddress}>{item.address}</Text>
      </View>
      <Pressable onPress={() => onEdit(item.id)} style={styles.editButton}>
        <Ionicons name="pencil" size={24} color={Colors.primary700} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.textBack700,
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  itemTextContainer: {
    flex: 1,
    marginRight: 10,
  },
  stationName: {
    fontSize: 18,
    fontWeight: "600",
  },
  stationAddress: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
});
