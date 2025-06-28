from flask import Flask, request, jsonify, g
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
import google.generativeai as genai
import os, jwt, traceback
from functools import wraps
from dotenv import load_dotenv

# Note: You'll need to implement these services or comment them out for now
# import encryptionService  # Use your existing Node-style service or Python port
# import ipfsService        # Use your existing service to fetch encrypted payload

load_dotenv()

app = Flask(__name__)
CORS(app, supports_credentials=True)

# DB setup
client = MongoClient(os.getenv("MONGO_URI"))
db = client["arogya-vault"]
users_collection = db["users"]
health_records_collection = db["healthrecords"]
leave_collection = db["medicalleaves"]
appointments_collection = db["appointments"]

# Gemini + JWT secrets
genai.configure(api_key=os.getenv("GEMINI_API"))
model = genai.GenerativeModel("gemini-2.0-flash-exp")  # Updated model name
JWT_SECRET = os.getenv("JWT_SECRET")
assert JWT_SECRET, "Missing JWT_SECRET"

# Auth middleware
def auth_middleware(roles=[]):
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            token = request.cookies.get("jwt") or request.headers.get("Authorization", "").split("Bearer ")[-1]
            if not token:
                return jsonify({"message": "Unauthorized"}), 401
            try:
                decoded = jwt.decode(token, JWT_SECRET, algorithms=["HS256"], options={"require": ["exp"]})
                g.user = {"_id": decoded["id"], "role": decoded["role"]}
                if roles and g.user["role"] not in roles:
                    return jsonify({"message": "Access Denied"}), 403
                return f(*args, **kwargs)
            except jwt.ExpiredSignatureError:
                return jsonify({"message": "Token expired"}), 401
            except jwt.InvalidTokenError as e:
                return jsonify({"message": f"Invalid token: {str(e)}"}), 403
            except Exception as e:
                traceback.print_exc()
                return jsonify({"message": f"Internal Server Error: {str(e)}"}), 500
        return wrapper
    return decorator

# Helpers
def get_user_name(uid):
    if not uid:
        return "Unknown"
    try:
        u = users_collection.find_one({"_id": ObjectId(uid)}, {"name": 1})
        return u["name"] if u else "Unknown"
    except Exception as e:
        print(f"Error getting user name: {e}")
        return "Unknown"

def decrypt_record(r, private_key=None):
    """
    For now, return the record as-is since encryption services aren't available
    You can implement this later when you have the encryption services ready
    """
    # if r.get("isEncrypted") and r.get("ipfsHash"):
    #     pkg = ipfsService.retrieveHealthRecord(r["ipfsHash"], private_key)
    #     return pkg  # decrypted full contents
    return r

# Health check endpoint
@app.route("/", methods=["GET"])
def health_check():
    return jsonify({
        "status": "AI Server is running",
        "endpoints": [
            "/ask_question",
            "/leaverelated", 
            "/doctor_insights"
        ]
    })

# 1. Student: Ask questions about medical history
@app.route("/ask_question", methods=["POST"])
@auth_middleware(["student"])
def ask_question():
    try:
        q = request.json.get("question") or ""
        if not q:
            return jsonify({"error": "Question is required"}), 400
        
        uid = g.user["_id"]
        user = users_collection.find_one({"_id": ObjectId(uid)})
        
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        # For now, skip private key requirement since encryption services aren't available
        # priv = user.get("decryptedPrivateKey")
        # if not priv:
        #     return jsonify({"error": "Missing private key for decryption"}), 403
        
        recs = list(health_records_collection.find({"studentId": ObjectId(uid)}))
        enriched = []
        
        for r in recs:
            # Skip decryption for now
            dec = decrypt_record(r)
            doctor_name = get_user_name(r.get("doctorId")) if r.get("doctorId") else r.get("externalDoctorName", "External Doctor")
            
            enriched.append({
                "Date": str(r.get("date", r.get("createdAt", "Unknown"))),
                "Diagnosis": dec.get("diagnosis", "Not specified"),
                "Treatment": dec.get("treatment", "Not specified"),
                "Prescription": dec.get("prescription", "Not specified"),
                "Doctor": doctor_name,
                "Hospital": r.get("externalHospitalName", "Internal")
            })
        
        if not enriched:
            return jsonify({
                "status": "success", 
                "answer": "I don't have any medical history records for you yet. Please add some health records first."
            })
        
        prompt = f"""
        You are a helpful medical AI assistant. Based on the patient's medical history, answer their question.
        
        Patient: {user.get('name', 'Patient')}
        Medical History: {enriched}
        
        Patient's Question: "{q}"
        
        Please provide a helpful response based on their medical history. If the question requires professional medical advice, remind them to consult with a healthcare provider.
        """
        
        resp = model.generate_content(prompt)
        return jsonify({"status": "success", "answer": resp.text})
        
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

# 2. Student: Ask about leave history
@app.route("/leaverelated", methods=["POST"])
@auth_middleware(["student"])
def leave_related_question():
    try:
        data = request.json
        user_question = data.get("question")
        student_id = g.user.get('_id')
        
        print(f"Using student ID from token: {student_id}")
        
        if not user_question:
            return jsonify({"error": "Question is required"}), 400
        
        # Get leave records (without encryption for now)
        leave_records = list(leave_collection.find({"studentId": ObjectId(student_id)}))
        
        if not leave_records:
            return jsonify({
                "status": "success",
                "answer": "You don't have any medical leave history yet."
            })
        
        formatted_records = []
        for record in leave_records:
            try:
                # For now, use records as-is without decryption
                formatted_records.append({
                    "reason": record.get("reason", "Not specified"),
                    "startDate": str(record.get("startDate", "Unknown")),
                    "endDate": str(record.get("endDate", "Unknown")),
                    "status": record.get("status", "Unknown"),
                    "doctorNote": record.get("doctorNote", "No note"),
                    "createdAt": str(record.get("createdAt", "Unknown"))
                })
            except Exception as record_error:
                print(f"Error processing record: {record_error}")
                continue
        
        if not formatted_records:
            return jsonify({"error": "Could not process leave records"}), 500
        
        # Prompt to Gemini
        gemini_prompt = f"""
        You are a helpful AI assistant for a college health management system.
        
        The following is the student's medical leave history:
        {formatted_records}
        
        Based on this data, answer the following question:
        "{user_question}"
        
        Provide helpful information about their leave history and any patterns or insights.
        """
        
        response = model.generate_content(gemini_prompt)
        final_answer = response.text if response and response.text else "I couldn't generate an answer for your question."
        
        return jsonify({"status": "success", "answer": final_answer})
        
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

# 3. Doctor: Ask for professional insights
@app.route("/doctor_insights", methods=["POST"])
@auth_middleware(["doctor"])
def doctor_insights():
    try:
        q = request.json.get("question") or ""
        if not q:
            return jsonify({"error": "Question is required"}), 400
        
        did = g.user["_id"]
        doc = users_collection.find_one({"_id": ObjectId(did)})
        
        if not doc:
            return jsonify({"error": "Doctor not found"}), 404
        
        # Skip private key requirement for now
        # priv = doc.get("decryptedPrivateKey")
        # if not priv:
        #     return jsonify({"error": "Missing private key to decrypt patient records"}), 403
        
        name = doc.get("name", "Doctor")
        specialization = doc.get("specialization", "General")
        slots = doc.get("availableSlots", [])
        
        # Get appointments for this doctor
        appts = list(appointments_collection.find({"doctorId": ObjectId(did)}))
        
        # Get health records created by this doctor
        recs = list(health_records_collection.find({"doctorId": ObjectId(did)}))
        
        enriched_recs = []
        for r in recs:
            dec = decrypt_record(r)  # Skip decryption for now
            patient_name = get_user_name(r.get("studentId"))
            
            enriched_recs.append({
                "Patient": patient_name,
                "Diagnosis": dec.get("diagnosis", "Not specified"),
                "Treatment": dec.get("treatment", "Not specified"), 
                "Prescription": dec.get("prescription", "Not specified"),
                "Date": str(r.get("date", r.get("createdAt", "Unknown")))
            })
        
        # Format appointments
        formatted_appts = []
        for appt in appts:
            patient_name = get_user_name(appt.get("studentId"))
            formatted_appts.append({
                "Patient": patient_name,
                "DateTime": str(appt.get("slotDateTime", "Unknown")),
                "Status": appt.get("status", "Unknown")
            })
        
        prompt = f"""
        You are an AI assistant helping Dr. {name}, a {specialization} specialist.
        
        Doctor Information:
        - Name: Dr. {name}
        - Specialization: {specialization}
        - Available slots: {len(slots)} slots configured
        
        Recent Appointments: {formatted_appts}
        Patient Records: {enriched_recs}
        
        Doctor's Question: "{q}"
        
        Please provide professional insights based on the available data. Focus on patterns, recommendations, and professional medical perspectives.
        """
        
        resp = model.generate_content(prompt)
        return jsonify({"status": "success", "answer": resp.text})
        
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
    

# Update the disease_prediction endpoint to remove auth requirement
@app.route("/disease_prediction", methods=["POST"])
def disease_prediction():
    try:
        data = request.json
        symptoms = data.get("symptoms", [])
        additional_info = data.get("additionalInfo", "")
        
        if not symptoms:
            return jsonify({"error": "Symptoms are required for prediction"}), 400
        
        # Create prompt for Gemini without user-specific data
        prompt = f"""
        You are a medical AI assistant helping with disease prediction based on symptoms.
        
        Current Symptoms: {', '.join(symptoms)}
        Additional Information: {additional_info}
        
        Based on the provided symptoms, please:
        1. Suggest possible conditions/diseases (with confidence levels)
        2. Recommend immediate actions or precautions
        3. Suggest when to seek medical attention
        4. Provide general health advice
        
        Important: Always emphasize that this is not a substitute for professional medical diagnosis and the patient should consult a healthcare provider for proper evaluation.
        
        Format your response in a clear, structured manner.
        """
        
        response = model.generate_content(prompt)
        
        return jsonify({
            "status": "success",
            "prediction": response.text,
            "symptoms_analyzed": symptoms,
            "timestamp": str(ObjectId().generation_time)
        })
        
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500


if __name__ == "__main__":
    port = int(os.getenv("AI_PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
