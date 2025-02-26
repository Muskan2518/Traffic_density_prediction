import React, { useState } from "react";
import { View, TextInput, Button, FlatList, TouchableOpacity, Text, Alert, ScrollView, Linking } from "react-native";
import MapView, { Marker } from "react-native-maps";
import axios from "axios";

const OPEN_ROUTE_SERVICE_API_KEY = "5b3ce3597851110001cf6248ec4d4fda233e465d883c49de39628563";

const RouteMap = () => {
  const [startQuery, setStartQuery] = useState("");
  const [endQuery, setEndQuery] = useState("");
  const [startSearchResults, setStartSearchResults] = useState([]);
  const [endSearchResults, setEndSearchResults] = useState([]);
  const [startLocation, setStartLocation] = useState(null);
  const [endLocation, setEndLocation] = useState(null);
  const [warnings, setWarnings] = useState([]);
  const [safestMode, setSafestMode] = useState(null);

  const searchLocation = async (query, setResults, locationType) => {
    if (!query.trim()) return;
    try {
      const response = await axios.get(
        `https://api.openrouteservice.org/geocode/search?api_key=${OPEN_ROUTE_SERVICE_API_KEY}&text=${query}`
      );
      if (response.data.features.length > 0) {
        setResults(response.data.features);
      } else {
        Alert.alert("No Results", `No locations found for "${query}".`);
      }
    } catch (error) {
      Alert.alert("Error", `Failed to fetch ${locationType}.`);
    }
  };

  const handleLocationSelect = (item, setLocation, setQuery, setResults) => {
    const selected = {
      lat: item.geometry.coordinates[1],
      lng: item.geometry.coordinates[0],
      name: item.properties.label,
    };
    setLocation(selected);
    setQuery(selected.name);
    setResults([]);
  };

  const fetchRouteData = async () => {
    if (!startLocation || !endLocation) {
      Alert.alert("Missing Data", "Please select both Start and End locations.");
      return;
    }
    const url = `https://729b-119-235-51-125.ngrok-free.app/weather?start=${JSON.stringify(startLocation)}&end=${JSON.stringify(endLocation)}&transportModes=["two wheeler","four wheeler","bus","train","flight"]`;

    try {
      const response = await axios.get(url);
      console.log(response.data); // Log the response to verify the structure
  
      // Extract warnings from the first route object if available
      const routeWarnings = response.data.routes[0]?.warnings || [];
      setWarnings(routeWarnings);
  
      // Extract safest mode information if needed
      setSafestMode(response.data.safestMode || null);
    } catch (error) {
      console.error(error); // Log the error for debugging
      Alert.alert("Error", "Failed to fetch route data.");
    }
  };

  const openGoogleMaps = () => {
    if (startLocation && endLocation) {
      const url = `https://www.google.com/maps/dir/?api=1&origin=${startLocation.lat},${startLocation.lng}&destination=${endLocation.lat},${endLocation.lng}&travelmode=driving`;
      Linking.openURL(url).catch((err) => console.error("Error opening map:", err));
    } else {
      Alert.alert("Missing Location", "Please select both Start and End locations.");
    }
  };

  return (
    <View style={{ flex: 1, padding: 10, backgroundColor: "#222" }}>
      <TextInput
        placeholder="Enter Start Location"
        placeholderTextColor="#bbb"
        style={{ height: 40, borderBottomWidth: 1, borderBottomColor: "#fff", marginBottom: 10, fontSize: 16, color: "white" }}
        value={startQuery}
        onChangeText={setStartQuery}
        onSubmitEditing={() => searchLocation(startQuery, setStartSearchResults, "Start")}
      />
      <FlatList
        data={startSearchResults}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleLocationSelect(item, setStartLocation, setStartQuery, setStartSearchResults)}>
            <Text style={{ padding: 10, backgroundColor: "#444", color: "white", marginBottom: 5 }}>{item.properties.label}</Text>
          </TouchableOpacity>
        )}
      />

      <TextInput
        placeholder="Enter Destination"
        placeholderTextColor="#bbb"
        style={{ height: 40, borderBottomWidth: 1, borderBottomColor: "#fff", marginBottom: 10, fontSize: 16, color: "white" }}
        value={endQuery}
        onChangeText={setEndQuery}
        onSubmitEditing={() => searchLocation(endQuery, setEndSearchResults, "Destination")}
      />
      <FlatList
        data={endSearchResults}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleLocationSelect(item, setEndLocation, setEndQuery, setEndSearchResults)}>
            <Text style={{ padding: 10, backgroundColor: "#444", color: "white", marginBottom: 5 }}>{item.properties.label}</Text>
          </TouchableOpacity>
        )}
      />

      <Button title="Submit" onPress={fetchRouteData} color="blue" />

      {/* Render Warnings with Previous Styling */}
      {warnings.length > 0 && (
        <ScrollView
          style={{
            marginTop: 10,
            padding: 15,
            backgroundColor: "#2c3e50", // Darker background for better contrast
            borderRadius: 15,
            borderWidth: 1,
            borderColor: "#34495e", // Slightly lighter border for a sleek effect
            shadowColor: "#000", // Add shadow effect
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 6,
            elevation: 5, // Android shadow support
          }}
        >
          <Text
            style={{
              color: "#f39c12", // Gold color for the title
              fontSize: 20,
              fontWeight: "bold",
              marginBottom: 12,
              textAlign: "center", // Center-align the title
            }}
          >
            ⚠️ Warnings:
          </Text>
          {warnings.map((warning, index) => (
            <View
              key={index}
              style={{
                marginBottom: 15,
                padding: 12,
                backgroundColor: "#34495e", // Slightly lighter background for individual warnings
                borderRadius: 10,
                borderWidth: 1,
                borderColor: "#1abc9c", // Soft turquoise border for elegance
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              {warning.location && (
                <Text
                  style={{
                    color: "white",
                    fontSize: 16,
                    marginBottom: 6,
                    fontStyle: "italic", // Italicized text for the location
                  }}
                >
                  📍 Location: {warning.location}
                </Text>
              )}
              {warning.weather && (
                <Text
                  style={{
                    color: "white",
                    fontSize: 16,
                    marginBottom: 6,
                    fontWeight: "500", // Slightly bolder text for weather info
                  }}
                >
                  🌦 Weather: {warning.weather}
                </Text>
              )}
            </View>
          ))}
          {/* Open Map Button after Warnings */}
          <Button title="Open Google Maps" onPress={openGoogleMaps} color="green" />
        </ScrollView>
      )}

      {/* Safest Mode Info */}
      {safestMode && (
        <View style={{ marginTop: 10, padding: 10, backgroundColor: "#333", borderRadius: 5 }}>
          <Text style={{ color: "yellow", fontSize: 16 }}>Safest Mode:</Text>
          <Text style={{ color: "white", fontSize: 14 }}>
            Mode: {safestMode.mode} | Risk Level: {safestMode.riskLevel}
          </Text>
        </View>
      )}

      <MapView
        style={{ flex: 1, marginTop: 10, height: "60%" }} // Increased height for map
        initialRegion={{
          latitude: 20.5937,
          longitude: 78.9629,
          latitudeDelta: 20,
          longitudeDelta: 20,
        }}
      >
        {startLocation && <Marker coordinate={{ latitude: startLocation.lat, longitude: startLocation.lng }} title="Start" />}
        {endLocation && <Marker coordinate={{ latitude: endLocation.lat, longitude: endLocation.lng }} title="Destination" />}
      </MapView>
    </View>
  );
};

export default RouteMap;
