import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import firestore from "@react-native-firebase/firestore";
import Ionicons from "@expo/vector-icons/Ionicons";

import EditStationScreen from "./EditStationScreen";
import AddStationScreen from "./AddStationScreen";
import UserManagementScreen from "./UserManagementScreen";

const StationListItem = ({ item, onEdit }) => (
  <View style={styles.itemContainer}>
    <View style={styles.itemTextContainer}>
      <Text style={styles.stationName}>{item.name}</Text>
      <Text style={styles.stationAddress}>{item.address}</Text>
    </View>
    <Pressable onPress={() => onEdit(item.id)} style={styles.editButton}>
      <Ionicons name="pencil" size={24} color="#007AFF" />
    </Pressable>
  </View>
);

// Ana Yönetim Paneli Component'i
function StationManagement({ onAddNew, onEdit }) {
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
          <Ionicons name="add-circle" size={32} color="#28a745" />
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

export default function AdminScreen() {
  const [view, setView] = useState("stations"); // 'stations', 'users', 'editStation', 'addStation'
  const [selectedStationId, setSelectedStationId] = useState(null);

  const handleEditStation = (stationId) => {
    setSelectedStationId(stationId);
    setView("editStation");
  };

  const handleBack = () => {
    setSelectedStationId(null);
    setView("stations");
  };

  // Hangi ekranın gösterileceğini belirleyen mantık
  let content;
  switch (view) {
    case "editStation":
      content = (
        <EditStationScreen stationId={selectedStationId} onClose={handleBack} />
      );
      break;
    case "addStation":
      content = <AddStationScreen onClose={handleBack} />;
      break;
    case "users":
      content = <UserManagementScreen />;
      break;
    default:
      content = (
        <StationManagement
          onAddNew={() => setView("addStation")}
          onEdit={handleEditStation}
        />
      );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {content}
      {/* Sadece ana ekranlardayken sekmeleri göster */}
      {(view === "stations" || view === "users") && (
        <View style={styles.footer}>
          <Pressable
            style={styles.footerButton}
            onPress={() => setView("stations")}
          >
            <Ionicons
              name={view === "stations" ? "car-sport" : "car-sport-outline"}
              size={28}
              color="#007AFF"
            />
            <Text style={styles.footerText}>Stations</Text>
          </Pressable>
          <Pressable
            style={styles.footerButton}
            onPress={() => setView("users")}
          >
            <Ionicons
              name={view === "users" ? "people" : "people-outline"}
              size={28}
              color="#007AFF"
            />
            <Text style={styles.footerText}>Users</Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
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
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  itemTextContainer: { flex: 1, marginRight: 10 },
  stationName: { fontSize: 18, fontWeight: "600" },
  stationAddress: { fontSize: 14, color: "#666", marginTop: 4 },
  editButton: { padding: 8 },
  footer: {
    height: 90,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-start",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
  },
  footerButton: { alignItems: "center" },
  footerText: { color: "#007AFF", fontSize: 12, marginTop: 4 },
});
