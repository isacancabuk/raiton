import { View, StyleSheet, Alert } from "react-native";
import { useState, useEffect, useRef } from "react";

import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import * as Location from "expo-location";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

import StationDetailsCard from "../components/StationDetailsCard";

// app.json'daki 'extra' alanından API anahtarını güvenli bir şekilde okumak için
import Constants from "expo-constants";
const DIRECTIONS_API_KEY = Constants.expoConfig?.extra?.directionsApiKey;

const stationMarkerIcon = require("../assets/images/station_pin.png");

export default function MainScreen() {
  const mapRef = useRef(null);
  const [stations, setStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [routeDestination, setRouteDestination] = useState(null);

  useEffect(() => {
    if (!DIRECTIONS_API_KEY) {
      console.error(
        "Directions API key is not set in app.json. Please add it under expo.extra.directionsApiKey"
      );
      Alert.alert("Configuration Error", "Directions API key is missing.");
    }

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

  const handleMarkerPress = (station) => {
    setSelectedStation(station);
    setRouteDestination(null);
  };

  const handleCloseCard = () => {
    setSelectedStation(null);
  };

  const handleDrawRoute = (station, socket) => {
    setRouteDestination(station.location);
    setSelectedStation(null);

    const currentUser = auth().currentUser;
    if (currentUser) {
      firestore()
        .collection("chargeHistory")
        .add({
          userId: currentUser.uid,
          stationId: station.id,
          stationName: station.name,
          socketId: socket.id,
          socketType: socket.type,
          date: firestore.FieldValue.serverTimestamp(),
        })
        .then(() => {
          console.log("Charge history added!");
        })
        .catch((error) => {
          console.error("Error adding charge history: ", error);
          Alert.alert("Error", "Could not save to your history.");
        });
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
});
