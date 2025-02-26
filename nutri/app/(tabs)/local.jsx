import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';

const TrafficPrediction = () => {
  const [trafficData, setTrafficData] = useState(null);
  const [loading, setLoading] = useState(false);

  // State to store user inputs
  const [date, setDate] = useState('');
  const [areaName, setAreaName] = useState('');
  const [roadName, setRoadName] = useState('');
  const [averageSpeed, setAverageSpeed] = useState('');
  const [travelTimeIndex, setTravelTimeIndex] = useState('');
  const [congestionLevel, setCongestionLevel] = useState('');
  const [roadCapacityUtilization, setRoadCapacityUtilization] = useState('');
  const [incidentReports, setIncidentReports] = useState('');
  const [environmentalImpact, setEnvironmentalImpact] = useState('');
  const [publicTransportUsage, setPublicTransportUsage] = useState('');
  const [trafficSignalCompliance, setTrafficSignalCompliance] = useState('');
  const [parkingUsage, setParkingUsage] = useState('');
  const [pedestrianCyclistCount, setPedestrianCyclistCount] = useState('');
  const [weatherConditions, setWeatherConditions] = useState('');
  const [roadworkActivity, setRoadworkActivity] = useState('');

  const fetchTrafficData = async () => {
    setLoading(true);

    try {
      const response = await fetch('https://9c38-119-235-51-125.ngrok-free.app/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date,
          area_name: areaName,
          'road/intersection_name': roadName,
          average_speed: parseFloat(averageSpeed),
          travel_time_index: parseFloat(travelTimeIndex),
          congestion_level: parseFloat(congestionLevel),
          road_capacity_utilization: parseFloat(roadCapacityUtilization),
          incident_reports: parseInt(incidentReports, 10),
          environmental_impact: parseFloat(environmentalImpact),
          public_transport_usage: parseFloat(publicTransportUsage),
          traffic_signal_compliance: parseFloat(trafficSignalCompliance),
          parking_usage: parseFloat(parkingUsage),
          pedestrian_and_cyclist_count: parseInt(pedestrianCyclistCount, 10),
          weather_conditions: weatherConditions,
          roadwork_and_construction_activity: roadworkActivity,
        }),
      });

      const data = await response.json();
      setTrafficData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Enter Date (YYYY-MM-DD)"
          placeholderTextColor="#ddd"
          value={date}
          onChangeText={setDate}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Area Name"
          placeholderTextColor="#ddd"
          value={areaName}
          onChangeText={setAreaName}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Road Name"
          placeholderTextColor="#ddd"
          value={roadName}
          onChangeText={setRoadName}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Average Speed"
          placeholderTextColor="#ddd"
          value={averageSpeed}
          onChangeText={setAverageSpeed}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Travel Time Index"
          placeholderTextColor="#ddd"
          value={travelTimeIndex}
          onChangeText={setTravelTimeIndex}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Congestion Level"
          placeholderTextColor="#ddd"
          value={congestionLevel}
          onChangeText={setCongestionLevel}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Road Capacity Utilization"
          placeholderTextColor="#ddd"
          value={roadCapacityUtilization}
          onChangeText={setRoadCapacityUtilization}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Incident Reports"
          placeholderTextColor="#ddd"
          value={incidentReports}
          onChangeText={setIncidentReports}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Environmental Impact"
          placeholderTextColor="#ddd"
          value={environmentalImpact}
          onChangeText={setEnvironmentalImpact}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Public Transport Usage"
          placeholderTextColor="#ddd"
          value={publicTransportUsage}
          onChangeText={setPublicTransportUsage}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Traffic Signal Compliance"
          placeholderTextColor="#ddd"
          value={trafficSignalCompliance}
          onChangeText={setTrafficSignalCompliance}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Parking Usage"
          placeholderTextColor="#ddd"
          value={parkingUsage}
          onChangeText={setParkingUsage}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Pedestrian and Cyclist Count"
          placeholderTextColor="#ddd"
          value={pedestrianCyclistCount}
          onChangeText={setPedestrianCyclistCount}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Weather Conditions"
          placeholderTextColor="#ddd"
          value={weatherConditions}
          onChangeText={setWeatherConditions}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Roadwork and Construction Activity"
          placeholderTextColor="#ddd"
          value={roadworkActivity}
          onChangeText={setRoadworkActivity}
        />

        <Button title="Get Traffic Data" onPress={fetchTrafficData} color="#6200EE" />

        {loading ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : (
          <ScrollView style={styles.scrollContainer}>
            {trafficData ? (
              <>
                <Text style={styles.resultTitle}>Traffic Prediction Data:</Text>
                <View style={styles.jsonWrapper}>
                  <Text style={styles.jsonText}>
                    {JSON.stringify(trafficData, null, 2)}
                  </Text>
                </View>
              </>
            ) : (
              <Text style={styles.resultText}>No data available</Text>
            )}
          </ScrollView>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    marginTop: 20,
    width: '100%',
  },
  loadingText: {
    fontSize: 16,
    color: '#333',
    marginTop: 10,
  },
  resultTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  resultText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4, // For Android shadow
    fontFamily: 'Courier New',
    whiteSpace: 'pre-wrap', // Maintain line breaks in the JSON string
  },
  jsonWrapper: {
    padding: 15,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    width: '100%',
    maxHeight: 300,
    overflow: 'scroll',
  },
  jsonText: {
    color: '#fff',
    fontFamily: 'Courier New',
    fontSize: 14,
  },
  input: {
    height: 45,
    borderColor: '#4CAF50',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
    width: '100%',
    backgroundColor: '#333',
    color: '#fff',
    borderRadius: 8,
    fontSize: 16,
  },
});

export default TrafficPrediction;
