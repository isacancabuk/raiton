import { useState, useEffect } from "react";
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
import auth from "@react-native-firebase/auth";

import EditStationScreen from "./EditStationScreen";
import AddStationScreen from "./AddStationScreen";
import UserManagementScreen from "./UserManagementScreen";
import ButtonCostum from "../components/ButtonCostum";
import StationManagement from "../components/StationManagement";
import Colors from "../constants/color";

export default function AdminScreen() {
  const [view, setView] = useState("stations");
  const [selectedStationId, setSelectedStationId] = useState(null);

  const handleEditStation = (stationId) => {
    setSelectedStationId(stationId);
    setView("editStation");
  };

  const handleBack = () => {
    setSelectedStationId(null);
    setView("stations");
  };
  const handleLogout = () => {
    auth().signOut();
  };

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
    <View style={styles.container}>
      {content}
      <ButtonCostum onPressed={handleLogout}>Sign Out</ButtonCostum>
      {(view === "stations" || view === "users") && (
        <View style={styles.footer}>
          <Pressable
            style={styles.footerButton}
            onPress={() => setView("stations")}
          >
            <Ionicons
              name={view === "stations" ? "car-sport" : "car-sport-outline"}
              size={28}
              color={Colors.secondary500}
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
              color={Colors.secondary500}
            />
            <Text style={styles.footerText}>Users</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.textBack500,
    marginTop: 50,
  },
  editButton: {
    padding: 8,
  },
  footer: {
    height: 90,
    backgroundColor: Colors.textBack500,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-start",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.textBack700,
  },
  footerButton: {
    alignItems: "center",
  },
  footerText: {
    color: Colors.secondary500,
    fontSize: 12,
    marginTop: 4,
  },
});
