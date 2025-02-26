from flask import Flask, request, jsonify
import joblib
import pandas as pd

# Load the saved pipeline and Linear Regression model
pipeline = joblib.load("traffic_model.pkl")
lr_model = joblib.load('linear_regression_model.pkl')

print("Models loaded successfully!")

# Initialize Flask app
app = Flask(__name__)

# Helper function to preprocess input data
def preprocess_input(data):
    """
    Preprocess the input data for prediction.
    """
    # Convert JSON data to DataFrame
    input_data = pd.DataFrame([data])

    # Convert DATE_TIME to datetime and extract features
    if 'DATE_TIME' in input_data.columns:
        input_data['DATE_TIME'] = pd.to_datetime(input_data['DATE_TIME'])
        input_data['HOUR'] = input_data['DATE_TIME'].dt.hour
        input_data['DAY_OF_WEEK'] = input_data['DATE_TIME'].dt.dayofweek
        input_data['MONTH'] = input_data['DATE_TIME'].dt.month
        input_data = input_data.drop(columns=['DATE_TIME'])

    return input_data

# Define an API endpoint for predictions using the pipeline
@app.route("/predict", methods=["POST"])
def predict_pipeline():
    """
    Endpoint for making predictions using the pipeline.
    """
    try:
        # Get JSON data from the request
        data = request.get_json()

        # Preprocess the input data
        input_data = preprocess_input(data)

        # Make predictions using the pipeline
        predictions = pipeline.predict(input_data)

        # Format the predictions
        output = {
            "traffic_volume": float(predictions[0][0]),  # Convert to float for JSON serialization
            "congestion_level": float(predictions[0][1])  # Convert to float for JSON serialization
        }

        # Return predictions as JSON
        return jsonify(output)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# Define an API endpoint for predictions using the Linear Regression model
@app.route('/predict_lr', methods=['POST'])
def predict_linear_regression():
    """
    Endpoint for making predictions using the Linear Regression model.
    """
    try:
        # Get JSON data from the request
        data = request.get_json()

        # Preprocess the input data
        input_data = preprocess_input(data)

        # Ensure the columns are in the correct order
        required_features = [
            'LONGITUDE', 'LATITUDE', 'MINIMUM_SPEED', 'MAXIMUM_SPEED', 
            'AVERAGE_SPEED', 'HOUR', 'DAY_OF_WEEK', 'MONTH'
        ]
        input_data = input_data[required_features]

        # Make predictions using the loaded Linear Regression model
        prediction = lr_model.predict(input_data)

        # Return the prediction as a JSON response
        return jsonify({
            'prediction': float(prediction[0])  # Convert to float for JSON serialization
        })
    except Exception as e:
        return jsonify({
            'error': str(e)
        }), 400

# Run the Flask app
if __name__ == "__main__":
    app.run(debug=True)