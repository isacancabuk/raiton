import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";

import HistoryItem from "../components/HistoryItem";
import Colors from "../constants/color";

import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

export default function HistoryScreen() {
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const currentUser = auth().currentUser;
    if (!currentUser) return;

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

        historyData.sort(
          (a, b) => (b.date?.seconds || 0) - (a.date?.seconds || 0)
        );

        setHistory(historyData);
        setLoading(false);
      });

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
    backgroundColor: Colors.textBack500,
    marginTop: 50,
  },
  title: {
    fontFamily: "Roboto-Bold",
    color: Colors.primary700,
    fontSize: 32,
    margin: 20,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.primary500,
    textAlign: "center",
    marginTop: 50,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    paddingHorizontal: 20,
  },
});
