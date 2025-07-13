import React, { useState, useEffect } from "react";
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

const SOCKET_STATUSES = ["available", "busy", "out_of_order"];

export default function EditStationScreen({ stationId, onClose }) {
  const [station, setStation] = useState(null);
  const [loading, setLoading] = useState(true);

  // Seçilen istasyonun verilerini çek
  useEffect(() => {
    const subscriber = firestore()
      .collection("stations")
      .doc(stationId)
      .onSnapshot((documentSnapshot) => {
        setStation({ id: documentSnapshot.id, ...documentSnapshot.data() });
        setLoading(false);
      });
    return () => subscriber();
  }, [stationId]);

  // Değişiklikleri kaydetme fonksiyonu
  const handleSaveChanges = async () => {
    setLoading(true);
    try {
      // Sadece düzenlenebilir alanları alıp güncelle
      const { name, address, phoneNumber, sockets } = station;
      await firestore().collection("stations").doc(stationId).update({
        name,
        address,
        phoneNumber,
        sockets,
      });
      Alert.alert("Success", "Station updated successfully!");
      onClose();
    } catch (error) {
      console.error("Error updating station: ", error);
      Alert.alert("Error", "Could not update station.");
    } finally {
      setLoading(false);
    }
  };

  // Bir soketin durumunu değiştiren fonksiyon
  const handleSocketStatusChange = (socketId) => {
    const updatedSockets = station.sockets.map((socket) => {
      if (socket.id === socketId) {
        const currentIndex = SOCKET_STATUSES.indexOf(socket.status);
        const nextIndex = (currentIndex + 1) % SOCKET_STATUSES.length;
        return { ...socket, status: SOCKET_STATUSES[nextIndex] };
      }
      return socket;
    });
    setStation((prev) => ({ ...prev, sockets: updatedSockets }));
  };

  if (loading || !station) {
    return <ActivityIndicator size="large" color="#000" style={{ flex: 1 }} />;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={onClose} style={styles.backButton}>
          <Ionicons name="chevron-back" size={32} color="#007AFF" />
        </Pressable>
        <Text style={styles.title}>Edit Station</Text>
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

        <Text style={styles.socketsTitle}>Sockets</Text>
        {station.sockets.map((socket) => (
          <View key={socket.id} style={styles.socketContainer}>
            <Text style={styles.socketInfo}>
              {socket.type} - {socket.power}kW
            </Text>
            <Pressable onPress={() => handleSocketStatusChange(socket.id)}>
              <Text style={styles.socketStatus}>
                {socket.status.replace("_", " ").toUpperCase()}
              </Text>
            </Pressable>
          </View>
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <ButtonCostum onPressed={handleSaveChanges} disabled={loading}>
          Save Changes
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
  socketsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 24,
    marginBottom: 10,
  },
  socketContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    marginBottom: 10,
  },
  socketInfo: { fontSize: 16 },
  socketStatus: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#007AFF",
    textTransform: "uppercase",
  },
  buttonContainer: { padding: 20 },
});
