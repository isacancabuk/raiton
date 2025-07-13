import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import firestore from "@react-native-firebase/firestore";
import Ionicons from "@expo/vector-icons/Ionicons";
import ButtonCostum from "../components/ButtonCostum";

export default function AddStationScreen({ onClose }) {
  const [loading, setLoading] = useState(false);
  const [station, setStation] = useState({
    name: "",
    address: "",
    phoneNumber: "",
    latitude: "",
    longitude: "",
    sockets: [{ id: 1, type: "AC", power: 22, status: "available" }],
  });

  const handleAddSocket = () => {
    const newSocket = {
      id: station.sockets.length + 1,
      type: "AC",
      power: 22,
      status: "available",
    };
    setStation((prev) => ({ ...prev, sockets: [...prev.sockets, newSocket] }));
  };

  const handleSaveStation = async () => {
    if (!station.name || !station.latitude || !station.longitude) {
      Alert.alert(
        "Error",
        "Station Name, Latitude, and Longitude are required."
      );
      return;
    }
    setLoading(true);
    try {
      const location = new firestore.GeoPoint(
        parseFloat(station.latitude),
        parseFloat(station.longitude)
      );
      await firestore().collection("stations").add({
        name: station.name,
        address: station.address,
        phoneNumber: station.phoneNumber,
        sockets: station.sockets,
        location: location,
      });
      Alert.alert("Success", "New station added successfully!");
      onClose();
    } catch (error) {
      console.error("Error adding station: ", error);
      Alert.alert("Error", "Could not add new station.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={onClose} style={styles.backButton}>
          <Ionicons name="chevron-back" size={32} color="#007AFF" />
        </Pressable>
        <Text style={styles.title}>Add New Station</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Station Name</Text>
        <TextInput
          style={styles.input}
          value={station.name}
          onChangeText={(text) =>
            setStation((prev) => ({ ...prev, name: text }))
          }
        />

        <Text style={styles.label}>Address</Text>
        <TextInput
          style={styles.input}
          value={station.address}
          onChangeText={(text) =>
            setStation((prev) => ({ ...prev, address: text }))
          }
        />

        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          value={station.phoneNumber}
          onChangeText={(text) =>
            setStation((prev) => ({ ...prev, phoneNumber: text }))
          }
          keyboardType="phone-pad"
        />

        <View style={styles.geoContainer}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <Text style={styles.label}>Latitude</Text>
            <TextInput
              style={styles.input}
              value={station.latitude}
              onChangeText={(text) =>
                setStation((prev) => ({ ...prev, latitude: text }))
              }
              keyboardType="numeric"
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Longitude</Text>
            <TextInput
              style={styles.input}
              value={station.longitude}
              onChangeText={(text) =>
                setStation((prev) => ({ ...prev, longitude: text }))
              }
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.socketsHeader}>
          <Text style={styles.socketsTitle}>Sockets</Text>
          <Pressable onPress={handleAddSocket}>
            <Ionicons name="add-circle-outline" size={28} color="#007AFF" />
          </Pressable>
        </View>
        {station.sockets.map((socket, index) => (
          <View key={index} style={styles.socketContainer}>
            <Text style={styles.socketInfo}>Socket {socket.id}</Text>
          </View>
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <ButtonCostum onPressed={handleSaveStation} disabled={loading}>
          Save Station
        </ButtonCostum>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: { padding: 5 },
  title: { fontSize: 22, fontWeight: "bold", marginLeft: 10 },
  form: { padding: 20 },
  label: { fontSize: 16, color: "#666", marginBottom: 8, marginTop: 16 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  geoContainer: { flexDirection: "row", justifyContent: "space-between" },
  socketsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 24,
  },
  socketsTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  socketContainer: {
    padding: 16,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    marginBottom: 10,
  },
  socketInfo: { fontSize: 16 },
  buttonContainer: { padding: 20 },
});
