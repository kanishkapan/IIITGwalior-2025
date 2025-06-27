import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Hashed
    role: {
      type: String,
      enum: ["student", "doctor", "admin"],
      required: true,
    },

    phone: { type: String },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ["Male", "Female", "Other"] },

    // Students
    healthRecords: [
      { type: mongoose.Schema.Types.ObjectId, ref: "HealthRecord" },
    ],

    // Doctors
    specialization: { type: String }, // Only for doctors
    availableSlots: [
      {
        date: { type: Date },
        timeSlots: [{ type: String }], // e.g., ["10:00 AM", "2:00 PM"]
      },
    ],
  },
  { timestamps: true }
);

export const User = mongoose.model("User", UserSchema);
