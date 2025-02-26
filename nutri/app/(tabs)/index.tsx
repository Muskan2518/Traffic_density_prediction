import React, { useState } from "react";
import { View, Text, Button, Alert, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { TextInput, Title, Subheading } from "react-native-paper";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import axios from "axios";

const OPEN_ROUTE_SERVICE_API_KEY = "5b3ce3597851110001cf6248ec4d4fda233e465d883c49de39628563";

const RouteMap = () => {
  // State to hold user inputs
  const [dateTime, setDateTime] = useState("");
  const [cityName, setCityName] = useState(""); // State for city name
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");
  const [minimumSpeed, setMinimumSpeed] = useState("");
  const [maximumSpeed, setMaximumSpeed] = useState("");
  const [averageSpeed, setAverageSpeed] = useState("");
  const [responseData, setResponseData] = useState(null);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  // Show date picker
  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  // Handle date selection
  const handleDateConfirm = (date) => {
    setDateTime(date.toISOString().slice(0, 19).replace("T", " "));
    setDatePickerVisible(false);
  };

  // Hide date picker without making any changes
  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  // Function to fetch coordinates from OpenRouteService API
  const fetchCoordinates = async () => {
    if (!cityName) {
      Alert.alert("Input Error", "Please enter a city name.");
      return;
    }

    try {
      const response = await axios.get(
        `https://api.openrouteservice.org/geocode/search?api_key=${OPEN_ROUTE_SERVICE_API_KEY}&text=${cityName}`
      );
      const cityData = response.data.features[0]?.geometry?.coordinates;

      if (cityData) {
        setLongitude(cityData[0]);
        setLatitude(cityData[1]);
      } else {
        Alert.alert("Error", "City not found.");
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      Alert.alert("Error", "Failed to fetch city coordinates.");
    }
  };

  const fetchRouteData = async () => {
    // Validate that all inputs are provided
    if (
      !dateTime ||
      !longitude ||
      !latitude ||
      !minimumSpeed ||
      !maximumSpeed ||
      !averageSpeed
    ) {
      Alert.alert("Input Error", "Please fill in all fields.");
      return;
    }

    // Construct the data object with user inputs
    const data = {
      DATE_TIME: dateTime,
      LONGITUDE: parseFloat(longitude),
      LATITUDE: parseFloat(latitude),
      MINIMUM_SPEED: parseFloat(minimumSpeed),
      MAXIMUM_SPEED: parseFloat(maximumSpeed),
      AVERAGE_SPEED: parseFloat(averageSpeed),
    };

    try {
      // Sending a POST request with the provided data
      const response = await axios.post(
        "https://9c38-119-235-51-125.ngrok-free.app/predict_lr",
        data
      );
      // Log response for debugging
      console.log("Response Data:", response.data);
      // Set the response data to state
      setResponseData(response.data);
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "Failed to fetch route data.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Title style={styles.title}>Route Data</Title>

        <Subheading style={styles.subheading}>Enter the route details:</Subheading>

        {/* Search bar for city name */}
        <TextInput
          label="City Name"
          style={styles.input}
          value={cityName}
          onChangeText={setCityName}
          onEndEditing={fetchCoordinates}
        />

        {/* Longitude and Latitude (auto-filled based on city name) */}
        <TextInput
          label="Longitude"
          style={styles.input}
          value={longitude.toString()}
          editable={false}
        />

        <TextInput
          label="Latitude"
          style={styles.input}
          value={latitude.toString()}
          editable={false}
        />

        {/* Date and Time Picker */}
        <TouchableOpacity style={styles.input} onPress={showDatePicker}>
          <Text style={styles.inputText}>{dateTime || "Select Date and Time"}</Text>
        </TouchableOpacity>

        {/* Minimum Speed */}
        <TextInput
          label="Minimum Speed"
          style={styles.input}
          value={minimumSpeed}
          onChangeText={setMinimumSpeed}
          keyboardType="numeric"
        />

        {/* Maximum Speed */}
        <TextInput
          label="Maximum Speed"
          style={styles.input}
          value={maximumSpeed}
          onChangeText={setMaximumSpeed}
          keyboardType="numeric"
        />

        {/* Average Speed */}
        <TextInput
          label="Average Speed"
          style={styles.input}
          value={averageSpeed}
          onChangeText={setAverageSpeed}
          keyboardType="numeric"
        />

        {/* Button to fetch data */}
        <Button title="Fetch Route Data" onPress={fetchRouteData} color="#6200ea" />

        {/* Displaying the response */}
        {responseData && (
          <View style={styles.responseContainer}>
            <Text style={styles.responseTitle}>Response Data:</Text>
            <Text style={styles.responseText}>Number of vehicles 
            { responseData.prediction}</Text>
          </View>
        )}
      </ScrollView>

      {/* Date Picker Modal */}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="datetime"
        onConfirm={handleDateConfirm}
        onCancel={hideDatePicker}
        date={new Date()}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  subheading: {
    fontSize: 18,
    marginBottom: 10,
    color: "#555",
  },
  input: {
    width: "100%",
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  inputText: {
    fontSize: 16,
    padding: 10,
    color: "#333",
  },
  responseContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  responseTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  responseText: {
    fontSize: 14,
    color: "#333",
    whiteSpace: "pre-wrap",
    wordWrap: "break-word",
  },
});

export default RouteMap;
