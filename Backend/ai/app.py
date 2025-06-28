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
users_collection = db["users"]
appointments_collection = db["appointments"]

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
    
    

@app.route("/doctor_insights", methods=["POST"])
def doctor_insights():
    try:
        data = request.json
        doctor_id = data.get("doctorId")
        user_question = data.get("question")

        if not doctor_id or not user_question:
            return jsonify({"error": "Doctor ID and question are required"}), 400

        # Fetch doctor details
        doctor = users_collection.find_one({"_id": ObjectId(doctor_id)})
        if not doctor:
            return jsonify({"error": "Doctor not found"}), 404

        # Fetch doctor's upcoming appointments
        appointments = list(appointments_collection.find({"doctorId": ObjectId(doctor_id)}))

        # Fetch student names for each appointment
        enriched_appointments = []
        for appointment in appointments:
            student = users_collection.find_one({"_id": ObjectId(appointment["studentId"])}, {"name": 1})
            student_name = student["name"] if student else "Unknown Student"
            appointment["studentName"] = student_name
            enriched_appointments.append(appointment)

        # Fetch all health records of patients treated by the doctor
        health_records = list(db["healthrecords"].find({"doctorId": ObjectId(doctor_id)}))

        # Fetch student names for each health record
        enriched_health_records = []
        for record in health_records:
            student = users_collection.find_one({"_id": ObjectId(record["studentId"])}, {"name": 1})
            student_name = student["name"] if student else "Unknown Patient"
            record["patientName"] = student_name
            enriched_health_records.append(record)

        # Convert MongoDB documents to JSON serializable format
        formatted_appointments = convert_objectid(enriched_appointments)
        formatted_health_records = convert_objectid(enriched_health_records)

        # Prepare prompt for Gemini AI (Address the doctor as "You")
        gemini_prompt = f"""
        You are a doctor. Here is your information:

        Your Specialization: {doctor.get("specialization", "N/A")}
        Your Contact: {doctor.get("email")}, {doctor.get("phone")}

        Your Upcoming Appointments:
        {formatted_appointments}

        Your Past Treatments (Health Records):
        {formatted_health_records}

        Based on this data, answer the following question:
        "{user_question}"

        Always address the person asking as "You" instead of their name.
        """

        # Generate response using Gemini AI
        response = model.generate_content(gemini_prompt)
        final_answer = response.text if response and response.text else "Gemini AI could not generate an answer."

        return jsonify({"status": "success", "answer": final_answer})

    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

  

# Run Flask app
if __name__ == "__main__":
    app.run(host="127.0.0.1", port=3053, debug=True)
