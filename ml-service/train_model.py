"""
Crop Recommendation Model Training Script
==========================================
Trains a Random Forest Classifier on the Crop_recommendation.csv dataset.
Features: N, P, K, temperature, humidity, ph, rainfall
Target: crop label (22 crops)
"""

import os
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix
import joblib

# Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, 'data', 'Crop_recommendation.csv')
MODEL_DIR = os.path.join(BASE_DIR, 'models')
MODEL_PATH = os.path.join(MODEL_DIR, 'crop_model.joblib')
SCALER_PATH = os.path.join(MODEL_DIR, 'scaler.joblib')
ENCODER_PATH = os.path.join(MODEL_DIR, 'label_encoder.joblib')

def load_and_preprocess():
    """Load and preprocess the crop recommendation dataset."""
    print("=" * 60)
    print("CROP RECOMMENDATION MODEL TRAINING")
    print("=" * 60)

    # Load dataset
    df = pd.read_csv(DATA_PATH)
    print(f"\n Dataset shape: {df.shape}")
    print(f" Columns: {list(df.columns)}")
    print(f" Unique crops: {df['label'].nunique()}")
    print(f"\n Sample data:")
    print(df.head())

    # Check for missing values
    missing = df.isnull().sum().sum()
    print(f"\n  Missing values: {missing}")

    # Features and target
    feature_columns = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
    X = df[feature_columns].values
    y = df['label'].values

    # Encode labels
    label_encoder = LabelEncoder()
    y_encoded = label_encoder.fit_transform(y)
    print(f"\n  Label classes: {list(label_encoder.classes_)}")

    # Scale features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    return X_scaled, y_encoded, scaler, label_encoder, feature_columns


def train_model(X, y):
    """Train and evaluate the Random Forest model."""
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    print(f"\n Train size: {X_train.shape[0]}, Test size: {X_test.shape[0]}")

    # Train Random Forest
    print("\n Training Random Forest Classifier...")
    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=None,
        min_samples_split=2,
        min_samples_leaf=1,
        random_state=42,
        n_jobs=-1
    )
    model.fit(X_train, y_train)

    # Evaluate
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)

    print(f"\n Model Accuracy: {accuracy * 100:.2f}%")
    print(f"\n Classification Report:")
    print(classification_report(y_test, y_pred))

    return model, accuracy


def save_artifacts(model, scaler, label_encoder):
    """Save the trained model, scaler, and label encoder."""
    os.makedirs(MODEL_DIR, exist_ok=True)

    joblib.dump(model, MODEL_PATH)
    joblib.dump(scaler, SCALER_PATH)
    joblib.dump(label_encoder, ENCODER_PATH)

    print(f"\n Model saved to: {MODEL_PATH}")
    print(f" Scaler saved to: {SCALER_PATH}")
    print(f" Label encoder saved to: {ENCODER_PATH}")


if __name__ == '__main__':
    # Load and preprocess
    X, y, scaler, label_encoder, feature_columns = load_and_preprocess()

    # Train
    model, accuracy = train_model(X, y)

    # Save
    save_artifacts(model, scaler, label_encoder)

    # Quick test prediction
    print("\n" + "=" * 60)
    print("TEST PREDICTION")
    print("=" * 60)
    test_input = {
        'N': 90, 'P': 42, 'K': 43,
        'temperature': 20.87, 'humidity': 82.0,
        'ph': 6.5, 'rainfall': 202.93
    }
    test_array = np.array([[test_input[col] for col in feature_columns]])
    test_scaled = scaler.transform(test_array)
    prediction = model.predict(test_scaled)
    probabilities = model.predict_proba(test_scaled)[0]
    predicted_crop = label_encoder.inverse_transform(prediction)[0]

    # Get top 3 predictions
    top_3_idx = np.argsort(probabilities)[-3:][::-1]
    top_3_crops = label_encoder.inverse_transform(top_3_idx)
    top_3_probs = probabilities[top_3_idx]

    print(f"\nInput: {test_input}")
    print(f"\n Top 3 Recommendations:")
    for i, (crop, prob) in enumerate(zip(top_3_crops, top_3_probs)):
        print(f"  {i+1}. {crop}: {prob*100:.1f}%")

    print(f"\n Training complete! Model accuracy: {accuracy*100:.2f}%")
