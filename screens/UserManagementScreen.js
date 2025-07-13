import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import firestore from "@react-native-firebase/firestore";

const UserListItem = ({ item, onToggleRole }) => (
  <View style={styles.itemContainer}>
    <View>
      <Text style={styles.userName}>
        {item.name} {item.surname}
      </Text>
      <Text style={styles.userEmail}>{item.email}</Text>
    </View>
    <Pressable onPress={() => onToggleRole(item.id, item.role)}>
      <Text
        style={[
          styles.role,
          item.role === "admin" ? styles.roleAdmin : styles.roleUser,
        ]}
      >
        {item.role.toUpperCase()}
      </Text>
    </Pressable>
  </View>
);

export default function UserManagementScreen() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const subscriber = firestore()
      .collection("users")
      .onSnapshot((querySnapshot) => {
        const usersData = [];
        querySnapshot.forEach((documentSnapshot) => {
          usersData.push({
            ...documentSnapshot.data(),
            id: documentSnapshot.id,
          });
        });
        setUsers(usersData);
        setLoading(false);
      });
    return () => subscriber();
  }, []);

  const handleToggleRole = (userId, currentRole) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    Alert.alert(
      "Confirm Role Change",
      `Are you sure you want to change this user's role to ${newRole}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: () => {
            firestore()
              .collection("users")
              .doc(userId)
              .update({ role: newRole });
          },
        },
      ]
    );
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#000" style={{ flex: 1 }} />;
  }

  return (
    <FlatList
      data={users}
      renderItem={({ item }) => (
        <UserListItem item={item} onToggleRole={handleToggleRole} />
      )}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: 20, backgroundColor: "#fff" },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  userName: { fontSize: 18, fontWeight: "600" },
  userEmail: { fontSize: 14, color: "#666", marginTop: 4 },
  role: {
    fontSize: 14,
    fontWeight: "bold",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    overflow: "hidden",
  },
  roleAdmin: { backgroundColor: "#ffc107", color: "#000" },
  roleUser: { backgroundColor: "#e0e0e0", color: "#000" },
});
