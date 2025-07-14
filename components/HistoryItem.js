import { StyleSheet, View, Text } from "react-native";

import Colors from "../constants/color";

export default function HistoryItem({ item }) {
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
}

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: Colors.accent500,
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.accent700,
  },
  stationName: {
    fontFamily: "Roboto-Bold",
    fontSize: 18,
    color: Colors.primary700,
  },
  socketInfo: {
    fontSize: 14,
    fontFamily: "Roboto-Light",
    color: Colors.primary500,
    marginTop: 4,
  },
  dateText: {
    fontFamily: "Roboto-Light",
    fontSize: 12,
    color: Colors.accent700,
    marginTop: 8,
    textAlign: "right",
  },
});
