import {
  View,
  StyleSheet,
  Alert,
  Pressable,
  Text,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect, useRef } from "react";

import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import * as Location from "expo-location";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import Ionicons from "@expo/vector-icons/Ionicons";

import StationDetailsCard from "../components/StationDetailsCard";
import Colors from "../constants/color";

import Constants from "expo-constants";
const DIRECTIONS_API_KEY = Constants.expoConfig?.extra?.directionsApiKey;

const stationMarkerIcon = require("../assets/images/station_pin.png");

const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    0.5 -
    Math.cos(dLat) / 2 +
    (Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      (1 - Math.cos(dLon))) /
      2;
  return R * 2 * Math.asin(Math.sqrt(a));
};

export default function MainScreen() {
  const mapRef = useRef(null);
  const [stations, setStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [routeDestination, setRouteDestination] = useState(null);
  const [isFinding, setIsFinding] = useState(false);

  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission denied", "Location permission is needed.");
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      const currentUserLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      setUserLocation(currentUserLocation);

      if (mapRef.current) {
        mapRef.current.animateToRegion(
          { ...currentUserLocation, latitudeDelta: 0.05, longitudeDelta: 0.05 },
          1000
        );
      }
    };

    const stationSubscriber = firestore()
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
      });

    getLocation();
    return () => stationSubscriber();
  }, []);

  const findNearestAndDrawRoute = () => {
    if (!userLocation) {
      Alert.alert(
        "Location not found",
        "We couldn't determine your current location."
      );
      return;
    }
    setIsFinding(true);

    const availableStations = stations.filter((station) =>
      station.sockets.some((socket) => socket.status === "available")
    );

    if (availableStations.length === 0) {
      Alert.alert(
        "No Stations",
        "Sorry, there are no available stations right now."
      );
      setIsFinding(false);
      return;
    }

    let closestStation = null;
    let minDistance = Infinity;

    availableStations.forEach((station) => {
      const distance = getDistance(
        userLocation.latitude,
        userLocation.longitude,
        station.location.latitude,
        station.location.longitude
      );
      if (distance < minDistance) {
        minDistance = distance;
        closestStation = station;
      }
    });

    if (closestStation) {
      const firstAvailableSocket = closestStation.sockets.find(
        (s) => s.status === "available"
      );
      handleDrawRoute(closestStation, firstAvailableSocket);
    }
    setIsFinding(false);
  };

  const handleMarkerPress = (station) => {
    setSelectedStation(station);
    setRouteDestination(null);
  };

  const handleCloseCard = () => {
    setSelectedStation(null);
  };

  const handleDrawRoute = async (station, socket) => {
    setRouteDestination(station.location);
    setSelectedStation(null);

    const currentUser = auth().currentUser;
    if (currentUser) {
      firestore().collection("chargeHistory").add({
        userId: currentUser.uid,
        stationId: station.id,
        stationName: station.name,
        socketId: socket.id,
        socketType: socket.type,
        date: firestore.FieldValue.serverTimestamp(),
      });
    }

    try {
      const stationRef = firestore().collection("stations").doc(station.id);
      const updatedSockets = station.sockets.map((s) => {
        if (s.id === socket.id) {
          return { ...s, status: "busy" };
        }
        return s;
      });
      await stationRef.update({ sockets: updatedSockets });
      console.log(`Socket ${socket.id} at station ${station.id} is now busy.`);
    } catch (error) {
      console.error("Error updating socket status: ", error);
      Alert.alert("Error", "Could not update socket status.");
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: 37.0,
          longitude: 35.32,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
        onPress={handleCloseCard}
      >
        {stations.map((station) => (
          <Marker
            key={station.id}
            coordinate={{
              latitude: station.location.latitude,
              longitude: station.location.longitude,
            }}
            title={station.name}
            description={station.address}
            image={stationMarkerIcon}
            onPress={() => handleMarkerPress(station)}
          />
        ))}

        {userLocation && routeDestination && DIRECTIONS_API_KEY && (
          <MapViewDirections
            origin={userLocation}
            destination={routeDestination}
            apikey={DIRECTIONS_API_KEY}
            strokeWidth={5}
            strokeColor="hotpink"
          />
        )}
      </MapView>
      <Pressable
        style={styles.findNearestButton}
        onPress={findNearestAndDrawRoute}
        disabled={isFinding}
      >
        {isFinding ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Ionicons name="navigate-circle-outline" size={24} color="#fff" />
            <Text style={styles.findNearestButtonText}>
              Find Nearest Available
            </Text>
          </>
        )}
      </Pressable>

      <StationDetailsCard
        station={selectedStation}
        visible={!!selectedStation}
        onClose={handleCloseCard}
        onDrawRoute={handleDrawRoute}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  findNearestButton: {
    position: "absolute",
    top: 60,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.secondary500,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  findNearestButtonText: {
    color: Colors.textBack500,
    marginLeft: 8,
    fontSize: 16,
    fontFamily: "Roboto-Bold",
  },
});
