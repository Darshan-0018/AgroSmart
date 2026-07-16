"""
Crop Recommendation Flask API
==============================
Serves ML predictions via REST API.
Endpoints:
  POST /predict - Get crop recommendations
  GET  /health  - Health check
  GET  /crops   - List all possible crops
"""

import os
import numpy as np
import joblib
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load model artifacts at startup
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, 'models', 'crop_model.joblib')
SCALER_PATH = os.path.join(BASE_DIR, 'models', 'scaler.joblib')
ENCODER_PATH = os.path.join(BASE_DIR, 'models', 'label_encoder.joblib')

# Crop information database
CROP_INFO = {
    'rice': {'season': 'Kharif', 'water': 'High', 'icon': '🌾', 'description': 'Rice is a staple food crop that requires abundant water and warm temperatures.'},
    'maize': {'season': 'Kharif', 'water': 'Medium', 'icon': '🌽', 'description': 'Maize is a versatile cereal crop used for food, animal feed, and industrial products.'},
    'chickpea': {'season': 'Rabi', 'water': 'Low', 'icon': '🫘', 'description': 'Chickpea is a protein-rich pulse crop grown in cool, dry conditions.'},
    'kidneybeans': {'season': 'Rabi', 'water': 'Medium', 'icon': '🫘', 'description': 'Kidney beans are nutritious legumes that thrive in moderate climates.'},
    'pigeonpeas': {'season': 'Kharif', 'water': 'Low', 'icon': '🫛', 'description': 'Pigeon peas are drought-tolerant pulse crops important for food security.'},
    'mothbeans': {'season': 'Kharif', 'water': 'Low', 'icon': '🫘', 'description': 'Moth beans are drought-resistant legumes suited to arid regions.'},
    'mungbean': {'season': 'Kharif/Summer', 'water': 'Low', 'icon': '🫘', 'description': 'Mung beans are short-duration pulse crops with high nutritional value.'},
    'blackgram': {'season': 'Kharif', 'water': 'Low', 'icon': '🫘', 'description': 'Black gram is a protein-rich legume important in Indian cuisine.'},
    'lentil': {'season': 'Rabi', 'water': 'Low', 'icon': '🫘', 'description': 'Lentils are protein-rich pulses that grow well in cool climates.'},
    'pomegranate': {'season': 'Whole Year', 'water': 'Medium', 'icon': '🍎', 'description': 'Pomegranate is a fruit crop known for its antioxidant-rich seeds.'},
    'banana': {'season': 'Whole Year', 'water': 'High', 'icon': '🍌', 'description': 'Banana is a tropical fruit crop requiring warm, humid conditions.'},
    'mango': {'season': 'Summer', 'water': 'Medium', 'icon': '🥭', 'description': 'Mango is a tropical fruit crop known as the king of fruits in India.'},
    'grapes': {'season': 'Winter', 'water': 'Medium', 'icon': '🍇', 'description': 'Grapes are vine fruits used fresh, dried, or for wine production.'},
    'watermelon': {'season': 'Summer', 'water': 'High', 'icon': '🍉', 'description': 'Watermelon is a refreshing summer fruit with high water content.'},
    'muskmelon': {'season': 'Summer', 'water': 'Medium', 'icon': '🍈', 'description': 'Muskmelon is a sweet summer fruit rich in vitamins and minerals.'},
    'apple': {'season': 'Winter', 'water': 'Medium', 'icon': '🍎', 'description': 'Apple is a temperate fruit crop grown in cooler, hilly regions.'},
    'orange': {'season': 'Winter', 'water': 'Medium', 'icon': '🍊', 'description': 'Orange is a citrus fruit rich in Vitamin C, grown in tropical climates.'},
    'papaya': {'season': 'Whole Year', 'water': 'Medium', 'icon': '🍈', 'description': 'Papaya is a tropical fruit crop that grows rapidly in warm climates.'},
    'coconut': {'season': 'Whole Year', 'water': 'Medium', 'icon': '🥥', 'description': 'Coconut palm is a versatile crop providing fruit, oil, and fiber.'},
    'cotton': {'season': 'Kharif', 'water': 'Medium', 'icon': '🌿', 'description': 'Cotton is a major fiber crop essential for the textile industry.'},
    'jute': {'season': 'Kharif', 'water': 'High', 'icon': '🌿', 'description': 'Jute is a natural fiber crop used for making sacks, bags, and textiles.'},
    'coffee': {'season': 'Whole Year', 'water': 'Medium', 'icon': '☕', 'description': 'Coffee is a plantation crop grown in shaded, hilly tropical regions.'},
}

try:
    model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)
    label_encoder = joblib.load(ENCODER_PATH)
    MODEL_LOADED = True
    print("[SUCCESS] Model loaded successfully!")
    print(f"   Classes: {list(label_encoder.classes_)}")
except Exception as e:
    MODEL_LOADED = False
    print(f"[ERROR] Error loading model: {e}")
    print("   Run 'python train_model.py' first to train the model.")


FEATURE_ORDER = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']


@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint."""
    return jsonify({
        'status': 'healthy',
        'model_loaded': MODEL_LOADED,
        'features': FEATURE_ORDER,
        'num_classes': len(label_encoder.classes_) if MODEL_LOADED else 0
    })


@app.route('/crops', methods=['GET'])
def get_crops():
    """Return list of all possible crop predictions."""
    if not MODEL_LOADED:
        return jsonify({'error': 'Model not loaded'}), 503

    crops = []
    for crop_name in label_encoder.classes_:
        info = CROP_INFO.get(crop_name, {})
        crops.append({
            'name': crop_name,
            'season': info.get('season', 'Unknown'),
            'water': info.get('water', 'Medium'),
            'icon': info.get('icon', '🌱'),
            'description': info.get('description', '')
        })

    return jsonify({'crops': crops})


@app.route('/predict', methods=['POST'])
def predict():
    """
    Predict crop recommendation based on soil and weather features.

    Expected JSON body:
    {
        "N": 90,          # Nitrogen content ratio
        "P": 42,          # Phosphorus content ratio
        "K": 43,          # Potassium content ratio
        "temperature": 20.87,  # Temperature in Celsius
        "humidity": 82.0,      # Humidity percentage
        "ph": 6.5,             # pH value of soil
        "rainfall": 202.93     # Rainfall in mm
    }
    """
    if not MODEL_LOADED:
        return jsonify({'error': 'Model not loaded. Run train_model.py first.'}), 503

    try:
        data = request.get_json()

        if not data:
            return jsonify({'error': 'No JSON data provided'}), 400

        # Validate all required features
        missing = [f for f in FEATURE_ORDER if f not in data]
        if missing:
            return jsonify({
                'error': f'Missing required features: {missing}',
                'required_features': FEATURE_ORDER
            }), 400

        # Extract features in correct order
        features = np.array([[float(data[f]) for f in FEATURE_ORDER]])

        # Validate ranges
        if not (0 <= data['ph'] <= 14):
            return jsonify({'error': 'pH must be between 0 and 14'}), 400
        if not (0 <= data['humidity'] <= 100):
            return jsonify({'error': 'Humidity must be between 0 and 100'}), 400

        # Scale and predict
        features_scaled = scaler.transform(features)
        prediction = model.predict(features_scaled)
        probabilities = model.predict_proba(features_scaled)[0]

        # Get top 5 predictions
        top_5_idx = np.argsort(probabilities)[-5:][::-1]
        top_5_crops = label_encoder.inverse_transform(top_5_idx)
        top_5_probs = probabilities[top_5_idx]

        recommendations = []
        for crop_name, prob in zip(top_5_crops, top_5_probs):
            info = CROP_INFO.get(crop_name, {})
            recommendations.append({
                'crop': crop_name,
                'confidence': round(float(prob) * 100, 2),
                'season': info.get('season', 'Unknown'),
                'water_requirement': info.get('water', 'Medium'),
                'icon': info.get('icon', '🌱'),
                'description': info.get('description', '')
            })

        predicted_crop = label_encoder.inverse_transform(prediction)[0]

        return jsonify({
            'success': True,
            'prediction': predicted_crop,
            'recommendations': recommendations,
            'input_features': data
        })

    except ValueError as e:
        return jsonify({'error': f'Invalid input values: {str(e)}'}), 400
    except Exception as e:
        return jsonify({'error': f'Prediction failed: {str(e)}'}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
