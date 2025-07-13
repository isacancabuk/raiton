import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

// Her bir geçmiş kaydını gösterecek olan component
const HistoryItem = ({ item }) => {
  // Firestore'dan gelen tarih objesini okunabilir bir formata çevir
  const date = item.date
    ? item.date.toDate().toLocaleString("tr-TR")
    : "Tarih bilgisi yok";

  return (
    <View style={styles.itemContainer}>
      <Text style={styles.stationName}>{item.stationName}</Text>
      <Text style={styles.socketInfo}>
        Socket: {item.socketType} (ID: {item.socketId})
      </Text>
      <Text style={styles.dateText}>{date}</Text>
    </View>
  );
};

export default function HistoryScreen() {
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const currentUser = auth().currentUser;
    if (!currentUser) return;

    // Sadece mevcut kullanıcıya ait geçmiş kayıtlarını dinle
    const subscriber = firestore()
      .collection("chargeHistory")
      .where("userId", "==", currentUser.uid)
      .onSnapshot((querySnapshot) => {
        const historyData = [];
        querySnapshot.forEach((documentSnapshot) => {
          historyData.push({
            ...documentSnapshot.data(),
            id: documentSnapshot.id,
          });
        });

        // Kayıtları en yeniden en eskiye doğru sırala
        historyData.sort(
          (a, b) => (b.date?.seconds || 0) - (a.date?.seconds || 0)
        );

        setHistory(historyData);
        setLoading(false);
      });

    // Component kaldırıldığında dinleyiciyi kapat
    return () => subscriber();
  }, []);

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Charge History</Text>
      {history.length === 0 ? (
        <Text style={styles.subtitle}>
          Your past charging sessions will appear here.
        </Text>
      ) : (
        <FlatList
          data={history}
          renderItem={({ item }) => <HistoryItem item={item} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    margin: 20,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    paddingHorizontal: 20,
  },
  itemContainer: {
    backgroundColor: "#f8f8f8",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },
  stationName: {
    fontSize: 18,
    fontWeight: "600",
  },
  socketInfo: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
  dateText: {
    fontSize: 12,
    color: "#888",
    marginTop: 8,
    textAlign: "right",
  },
});
