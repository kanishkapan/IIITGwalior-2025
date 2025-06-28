from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
import google.generativeai as genai
import os

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# MongoDB Connection
MONGO_URI = "mongodb+srv://tannisa:YXmXxB8C19yRxAFr@arogya-vault.3bg8o.mongodb.net/arogya-vault"
client = MongoClient(MONGO_URI)
db = client["arogya-vault"]
collection = db["healthrecords"]
collection2=db["medicalleaves"]

# Load API Key from .env
from dotenv import load_dotenv
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API")

if not GEMINI_API_KEY:
    raise ValueError("❌ GEMINI_API key is missing! Set it in the .env file.")

# Configure Gemini AI
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-1.5-pro")  # ✅ Fixed model name

# Helper function to convert MongoDB ObjectId to string
def convert_objectid(data):
    """Recursively converts ObjectId fields to strings in a dictionary or list"""
    if isinstance(data, list):
        return [convert_objectid(doc) for doc in data]
    if isinstance(data, dict):
        return {k: str(v) if isinstance(v, ObjectId) else v for k, v in data.items()}
    return data

@app.route("/disease_prediction", methods=["POST"])
def disease_prediction():
    try:
        data = request.json
        symptoms = data.get("symptoms")

        if not symptoms:
            return jsonify({"error": "Symptoms are required"}), 400

        # Convert symptoms list to a formatted string
        symptoms_text = ", ".join(symptoms)

        # Prepare Gemini AI prompt
        gemini_prompt = f"""
        A patient is experiencing the following symptoms: {symptoms_text}.
        Based on these symptoms, predict the most likely disease or condition.
        Provide a detailed explanation along with possible treatments.
        """

        # Generate response using Gemini AI
        response = model.generate_content(gemini_prompt)

        final_prediction = response.text if response and response.text else "Gemini AI could not generate a prediction."

        return jsonify({"status": "success", "prediction": final_prediction})

    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500
    

# API to answer user questions using Gemini AI
@app.route("/ask_question", methods=["POST"])
def ask_question():
    try:
        data = request.json
        user_question = data.get("question")
        student_id = data.get("studentId")

        if not user_question or not student_id:
            return jsonify({"error": "Question and Student ID are required"}), 400

        # Fetch medical records
        records = list(collection.find({"studentId": ObjectId(student_id)}))
        if not records:
            return jsonify({"error": "No medical history found for this student"}), 404

        formatted_records = convert_objectid(records)

        # Prepare Gemini AI prompt
        gemini_prompt = f"""
        The following is the patient's medical history:
        {formatted_records}
        
        Based on this data, answer the following question:
        "{user_question}"
        """

        # Generate response using Gemini AI
        response = model.generate_content(gemini_prompt)

        final_answer = response.text if response and response.text else "Gemini AI could not generate an answer."

        return jsonify({"status": "success", "answer": final_answer})

    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500
    
# API to answer user questions using Gemini AI
@app.route("/leaverelated", methods=["POST"])
def leave_related_question():  # ✅ Unique function name
    try:
        data = request.json
        user_question = data.get("question")
        student_id = data.get("studentId")

        if not user_question or not student_id:
            return jsonify({"error": "Question and Student ID are required"}), 400

        # Fetch leave records from a separate collection (Assuming collection2 is used for leave records)
        records = list(collection2.find({"studentId": ObjectId(student_id)}))
        if not records:
            return jsonify({"error": "No leave history found for this student"}), 404

        formatted_records = convert_objectid(records)

        # Prepare Gemini AI prompt
        gemini_prompt = f"""
        The following is the student's leave record history:
        {formatted_records}
        
        Based on this data, answer the following question:
        "{user_question}"
        """

        # Generate response using Gemini AI
        response = model.generate_content(gemini_prompt)

        final_answer = response.text if response and response.text else "Gemini AI could not generate an answer."

        return jsonify({"status": "success", "answer": final_answer})

    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500


# Run Flask app
if __name__ == "__main__":
    app.run(debug=True)
