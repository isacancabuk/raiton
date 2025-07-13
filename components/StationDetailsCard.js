import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import ButtonCostum from "./ButtonCostum";

const getStatusStyle = (status) => {
  switch (status.toLowerCase()) {
    case "available":
      return { color: "#28a745", text: "Available" };
    case "busy":
      return { color: "#dc3545", text: "Busy" };
    default:
      return { color: "#6c757d", text: "Out of Order" };
  }
};

const StationDetailsCard = ({ station, visible, onClose, onDrawRoute }) => {
  // Seçilen soketi tutmak için state
  const [selectedSocket, setSelectedSocket] = useState(null);

  // Kart her açıldığında seçimi sıfırla
  useEffect(() => {
    if (!visible) {
      setSelectedSocket(null);
    }
  }, [visible]);

  if (!station) {
    return null;
  }

  const handleSocketSelect = (socket) => {
    setSelectedSocket(socket);
  };

  const handleDrawRoutePress = () => {
    if (selectedSocket) {
      onDrawRoute(station, selectedSocket);
    }
  };

  const isRouteButtonDisabled =
    !selectedSocket || selectedSocket.status !== "available";

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.cardContainer}>
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <Text style={styles.stationName}>{station.name}</Text>
            <Text style={styles.stationAddress}>{station.address}</Text>
            <View style={styles.infoRow}>
              <Ionicons name="call-outline" size={16} color="#555" />
              <Text style={styles.stationPhone}>{station.phoneNumber}</Text>
            </View>
            <View style={styles.divider} />
            <Text style={styles.socketsTitle}>Select a Socket</Text>
            {station.sockets.map((socket) => {
              const statusStyle = getStatusStyle(socket.status);
              const isSelected =
                selectedSocket && selectedSocket.id === socket.id;
              return (
                // Her soket satırı artık seçilebilir
                <Pressable
                  key={socket.id}
                  style={[
                    styles.socketRow,
                    isSelected && styles.selectedSocketRow,
                  ]}
                  onPress={() => handleSocketSelect(socket)}
                >
                  <View style={styles.socketTypeContainer}>
                    <Ionicons
                      name="flash"
                      size={24}
                      color={isSelected ? "#fff" : "#007bff"}
                    />
                    <View>
                      <Text
                        style={[
                          styles.socketType,
                          isSelected && styles.selectedText,
                        ]}
                      >
                        {socket.type}
                      </Text>
                      <Text
                        style={[
                          styles.socketPower,
                          isSelected && styles.selectedText,
                        ]}
                      >
                        {socket.power} kW
                      </Text>
                    </View>
                  </View>
                  <View>
                    <Text
                      style={[
                        styles.socketStatus,
                        { color: isSelected ? "#fff" : statusStyle.color },
                      ]}
                    >
                      {statusStyle.text}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>
          <View style={styles.buttonWrapper}>
            <ButtonCostum
              onPressed={handleDrawRoutePress}
              disabled={isRouteButtonDisabled}
            >
              Rota Çiz
            </ButtonCostum>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  // ... diğer stiller aynı ...
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  cardContainer: {
    maxHeight: "60%",
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
  },
  scrollViewContent: { paddingHorizontal: 20 },
  stationName: { fontSize: 24, fontWeight: "bold", marginBottom: 4 },
  stationAddress: { fontSize: 16, color: "#555", marginBottom: 12 },
  infoRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  stationPhone: { fontSize: 16, color: "#555", marginLeft: 8 },
  divider: { height: 1, backgroundColor: "#eee", marginVertical: 16 },
  socketsTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
  socketRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedSocketRow: { backgroundColor: "#007bff" },
  socketTypeContainer: { flexDirection: "row", alignItems: "center" },
  socketType: { fontSize: 16, fontWeight: "500", marginLeft: 12 },
  selectedText: { color: "#fff" },
  socketPower: { fontSize: 14, color: "#777", marginLeft: 12 },
  socketStatus: { fontSize: 16, fontWeight: "bold" },
  buttonWrapper: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    backgroundColor: "white",
  },
});

export default StationDetailsCard;
