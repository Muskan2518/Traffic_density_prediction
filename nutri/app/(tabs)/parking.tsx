import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, FlatList, StyleSheet, TouchableOpacity, Linking } from "react-native";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import axios from "axios";

export default function ParkingFinder() {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [parkingSpots, setParkingSpots] = useState([]);
  const [mapRegion, setMapRegion] = useState(null);

  // Request Location Permission
  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Permission Denied: You need to allow location access to find parking.");
      return;
    }
    getLocation();
  };

  // Get Current Location
  const getLocation = async () => {
    setLoading(true);
    try {
      const loc = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = loc.coords;
      setLocation({ latitude, longitude });
      setMapRegion({ latitude, longitude, latitudeDelta: 0.05, longitudeDelta: 0.05 });
      fetchParkingSpots(latitude, longitude);
    } catch (error) {
      alert("Error fetching location.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch Nearby Parking Spots from OpenStreetMap Overpass API
  const fetchParkingSpots = async (lat, lon) => {
    try {
      const query = `[out:json];node["amenity"="parking"](around:5000,${lat},${lon});out;`;
      const response = await axios.get(
        `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`
      );

      if (response.data.elements.length > 0) {
        const spots = response.data.elements.map((spot) => ({
          id: spot.id,
          name: spot.tags?.name || "Unnamed Parking Spot",
          latitude: spot.lat,
          longitude: spot.lon,
        }));
        setParkingSpots(spots);
      } else {
        setParkingSpots([]);
      }
    } catch (error) {
      console.error("Error fetching parking spots:", error);
      setParkingSpots([]);
    }
  };

  // Handle clicking on a parking spot
  const handleParkingSpotPress = (lat, lon) => {
    setMapRegion({
      latitude: lat,
      longitude: lon,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });

    if (location) {
      const url = `https://www.google.com/maps/dir/?api=1&origin=${location.latitude},${location.longitude}&destination=${lat},${lon}&travelmode=driving`;
      Linking.openURL(url); // Open Google Maps with directions
    } else {
      alert("User location not found!");
    }
  };

  useEffect(() => {
    requestLocationPermission();
  }, []);

  return (
    <View style={styles.container}>
      {/* Map View */}
      <MapView
        style={styles.map}
        region={mapRegion}
        onRegionChangeComplete={(region) => setMapRegion(region)}
      >
        {/* User Location Marker */}
        {location && (
          <Marker coordinate={location} title="You are here" pinColor="red" />
        )}

        {/* Parking Spot Markers */}
        {parkingSpots.map((spot) => (
          <Marker
            key={spot.id}
            coordinate={{ latitude: spot.latitude, longitude: spot.longitude }}
            title={spot.name}
            pinColor="blue"
            onPress={() => handleParkingSpotPress(spot.latitude, spot.longitude)}
          />
        ))}
      </MapView>

      {/* Parking Spots List */}
      <View style={styles.listContainer}>
        <Text style={styles.heading}>🅿️ Nearby Parking Spots</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#007bff" />
        ) : parkingSpots.length > 0 ? (
          <FlatList
            data={parkingSpots}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.parkingSpot}
                onPress={() => handleParkingSpotPress(item.latitude, item.longitude)}
              >
                <Text style={styles.parkingText}>📍 {item.name}</Text>
                <Text>🗺 Lat: {item.latitude.toFixed(5)}, Lon: {item.longitude.toFixed(5)}</Text>
                <Text style={styles.directionsText}>🚗 Get Directions</Text>
              </TouchableOpacity>
            )}
          />
        ) : (
          <Text style={styles.noSpots}>⚠ No nearby parking spots found.</Text>
        )}
      </View>
    </View>
  );
}

// Styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  map: {
    width: "100%",
    height: "50%",
  },
  listContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  parkingSpot: {
    backgroundColor: "#e3f2fd",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  parkingText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  directionsText: {
    color: "#007bff",
    fontSize: 14,
    marginTop: 5,
  },
  noSpots: {
    textAlign: "center",
    fontSize: 16,
    color: "red",
  },
});
