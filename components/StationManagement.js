import { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  FlatList,
  ActivityIndicator,
} from "react-native";

import StationListItem from "./StationListItem";
import Colors from "../constants/color";

import firestore from "@react-native-firebase/firestore";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function StationManagement({ onAddNew, onEdit }) {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const subscriber = firestore()
      .collection("stations")
      .onSnapshot((querySnapshot) => {
        const stationsData = [];
        querySnapshot.forEach((documentSnapshot) => {
          stationsData.push({
            ...documentSnapshot.data(),
            id: documentSnapshot.id,
          });
        });
        setStations(stationsData);
        setLoading(false);
      });
    return () => subscriber();
  }, []);

  if (loading)
    return <ActivityIndicator size="large" color="#000" style={{ flex: 1 }} />;

  return (
    <View style={styles.viewContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Stations</Text>
        <Pressable style={styles.addButton} onPress={onAddNew}>
          <Ionicons name="add-circle" size={32} color={Colors.secondary500} />
        </Pressable>
      </View>
      <FlatList
        data={stations}
        renderItem={({ item }) => (
          <StationListItem item={item} onEdit={onEdit} />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  viewContainer: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: { fontSize: 24, fontWeight: "bold" },
  addButton: { padding: 5 },
  list: { padding: 20 },
});
