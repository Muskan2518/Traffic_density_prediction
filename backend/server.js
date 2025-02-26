
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const tf = require("@tensorflow/tfjs-node"); // <-- Use tfjs-node for Node.js

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Load TensorFlow.js Model
let model;
async function loadModel() {
    try {
        const modelPath = "file://C:/Users/rosha/Downloads/New folder/model.json"; // Use forward slashes

        model = await tf.loadLayersModel(modelPath);

        console.log("✅ Model Loaded Successfully!");
    } catch (error) {
        console.error("❌ Error loading model:", error);
    }
}

loadModel(); // Load model on startup

// Predict Traffic Congestion
app.post("/predict", async (req, res) => {
    try {
        if (!model) {
            return res.status(500).json({ error: "Model is not loaded yet." });
        }

        const { longitude, latitude, minSpeed, maxSpeed, avgSpeed, hour, day, dayOfWeek } = req.body;

        // Convert input into a tensor
        const inputTensor = tf.tensor2d([[longitude, latitude, minSpeed, maxSpeed, avgSpeed, hour, day, dayOfWeek]]);

        // Make prediction
        const prediction = model.predict(inputTensor);
        const output = prediction.dataSync()[0]; // Get the first value

        res.json({ congestionLevel: output });
    } catch (error) {
        console.error("❌ Prediction Error:", error);
        res.status(500).json({ error: "Prediction failed" });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
