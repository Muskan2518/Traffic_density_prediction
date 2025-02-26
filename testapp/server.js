const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

// Helper function to calculate distance using Haversine formula
function haversineDistance(lat1, lon1, lat2, lon2) {
    const toRadians = (degrees) => degrees * (Math.PI / 180);
    const R = 6371; // Earth's radius in kilometers

    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
}

// Root endpoint
app.get("/", (req, res) => {
    res.send("Weather Travel Warning API is running. Use /weather.");
});

// Get weather along the route between two places
app.get("/weather", async (req, res) => {
    try {
        const { start, end, transportModes } = req.query;

        if (!start || !end || !transportModes) {
            return res.status(400).json({ error: "Missing required query parameters: start, end, transportModes" });
        }

        let startLocation, endLocation, modes;
        try {
            startLocation = JSON.parse(start);
            endLocation = JSON.parse(end);
            modes = JSON.parse(transportModes);
        } catch (error) {
            return res.status(400).json({ error: "Invalid JSON format for start, end, or transportModes" });
        }

        // Calculate distance between start and end locations
        const distance = haversineDistance(
            startLocation.lat,
            startLocation.lng,
            endLocation.lat,
            endLocation.lng
        );

        // Recommend transport mode based on distance
        let recommendedMode;
        if (distance < 10) {
            recommendedMode = "two wheeler";
        } else if (distance < 50) {
            recommendedMode = "four wheeler";
        } else if (distance < 300) {
            recommendedMode = "bus";
        } else if (distance < 1000) {
            recommendedMode = "train";
        } else {
            recommendedMode = "flight";
        }

        // Simulating intermediate points between start and end (straight-line approximation)
        const numPoints = 5;
        const route = [];
        for (let i = 0; i <= numPoints; i++) {
            route.push({
                lat: startLocation.lat + (i * (endLocation.lat - startLocation.lat)) / numPoints,
                lng: startLocation.lng + (i * (endLocation.lng - startLocation.lng)) / numPoints
            });
        }

        // Fetch weather for each route point
        const weatherPromises = route.map(async (loc) => {
            try {
                const weatherRes = await axios.get("https://api.openweathermap.org/data/2.5/weather", {
                    params: {
                        lat: loc.lat,
                        lon: loc.lng,
                        appid: OPENWEATHER_API_KEY,
                        units: "metric"
                    }
                });

                return {
                    location: weatherRes.data.name || `Lat: ${loc.lat}, Lon: ${loc.lng}`,
                    weather: weatherRes.data.weather[0].main
                };
            } catch (err) {
                console.error(`Failed to fetch weather for ${loc.lat}, ${loc.lng}:`, err.message);
                return { location: `Lat: ${loc.lat}, Lon: ${loc.lng}`, weather: "Unknown" };
            }
        });

        const weatherData = await Promise.all(weatherPromises);

        // Determine safest transport mode
        const transportModesList = ["two wheeler", "four wheeler", "bus", "train", "flight"];
        const modeSafety = transportModesList.map(mode => {
            let riskLevel = 0;
            weatherData.forEach(warning => {
                if (["Snow", "Storm", "Heavy Rain", "Extreme Heat", "Fog", "Hail", "Sandstorm"].includes(warning.weather)) {
                    if (mode === "two wheeler") riskLevel += 7;
                    if (mode === "four wheeler") riskLevel += 5;
                    if (mode === "bus") riskLevel += 4;
                    if (mode === "train") riskLevel += 2;
                    if (mode === "flight") riskLevel += 3;
                }
            });
            return { mode, riskLevel };
        });

        modeSafety.sort((a, b) => a.riskLevel - b.riskLevel);

        // Generate warnings if severe weather is detected
        let warnings = [];
        weatherData.forEach(warning => {
            if (["Snow", "Storm", "Heavy Rain", "Extreme Heat", "Fog", "Hail", "Sandstorm"].includes(warning.weather)) {
                warnings.push(`Warning: ${warning.weather} expected at ${warning.location}. Consider a safer mode of transport.`);
            }
        });

        res.json({
            routes: [{ route, warnings: weatherData }],
            safestMode: modeSafety[0],
            recommendedMode,
            distance: `${distance.toFixed(2)} km`,
            warnings
        });
    } catch (error) {
        console.error("Error fetching weather data:", error.message);
        res.status(500).json({ error: "Error fetching weather data" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));