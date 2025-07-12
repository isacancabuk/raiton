import { View, StyleSheet, Alert } from "react-native";
import { useState, useEffect, useRef } from "react";

import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";

import auth from "@react-native-firebase/auth";
import ButtonIcon from "../components/ButtonIcon";

export default function MainScreen() {
  // Haritayı programatik olarak kontrol etmek için bir referans oluşturuyoruz
  const mapRef = useRef(null);

  // Haritanın başlangıçta odaklanacağı konumu belirliyoruz (İstanbul)
  const initialRegion = {
    latitude: 41.0082,
    longitude: 28.9784,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  // Component ilk yüklendiğinde konum izni istemek ve konumu almak için useEffect kullanıyoruz
  useEffect(() => {
    const getLocation = async () => {
      // 1. Adım: Kullanıcıdan konum izni iste
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission denied",
          "Location permission is needed to show your position on the map."
        );
        return;
      }

      // 2. Adım: Kullanıcının mevcut konumunu al
      let location = await Location.getCurrentPositionAsync({});

      // 3. Adım: Haritayı kullanıcının konumuna odakla
      const userLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.005, // Daha yakın bir zoom seviyesi
        longitudeDelta: 0.005,
      };

      // Haritayı yeni konuma animasyonla kaydır
      if (mapRef.current) {
        mapRef.current.animateToRegion(userLocation, 1000); // 1000ms = 1 saniye
      }
    };

    getLocation();
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef} // Referansı MapView'e atıyoruz
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={initialRegion}
        showsUserLocation={true}
        showsMyLocationButton={true}
        mapPadding={{ top: 0, right: 0, bottom: 90, left: 0 }}
      >
        {/* İstasyon işaretçileri (Marker) buraya gelecek (Faz 3) */}
      </MapView>

      <View style={styles.footer}>
        <ButtonIcon name="save" text="History" />
        <ButtonIcon name="map" text="Map" />
        <ButtonIcon name="person" text="Profile" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 90,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
});
