import { useState } from "react";
import { motion } from "framer-motion";
import React from "react";
const patients = [
  { id: 1, name: "John Doe", license: "MED12345", hash: "0xabc123xyz456hash789" },
  { id: 2, name: "Jane Smith", license: "MED67890", hash: "0xdef456ghi789hash012" },
  { id: 3, name: "Alice Brown", license: "MED11223", hash: "0xjkl789mno012hash345" },
  { id: 4, name: "Kanishka Pandey ", license: "MED99999", hash: "Not Found" },
  { id: 5, name: "Urvashi Maramt ", license: "MED88888", hash: "Not Found" },
];

export default function VerificationScreen() {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [verified, setVerified] = useState(false);

  const handleVerify = () => {
    setVerified(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-200 flex justify-center items-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-lg border-2 border-green-300">
        
        <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">Medical Certificate Verification</h2>
        
        <ul className="mb-6 space-y-3">
          {patients.map((patient) => (
            <motion.li
              key={patient.id}
              whileHover={{ scale: 1.05 }}
              className="cursor-pointer p-4 border rounded-lg bg-white shadow-md flex justify-between items-center transition-all hover:bg-green-200 hover:shadow-lg"
              onClick={() => {
                setSelectedPatient(patient);
                setVerified(false);
              }}
            >
              <span className={`font-semibold ${patient.hash === "Not Found" ? "text-red-600" : "text-green-700"}`}>{patient.name}</span>
              <span className="text-gray-600">{patient.license}</span>
            </motion.li>
          ))}
        </ul>

        {selectedPatient && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className={`mt-4 p-6 border-2 rounded-xl shadow-lg ${selectedPatient.hash === "Not Found" ? "bg-red-50 border-red-400" : "bg-green-50 border-green-300"}`}
          >
            <h3 className={`text-lg font-semibold mb-2 ${selectedPatient.hash === "Not Found" ? "text-red-600" : "text-green-700"}`}>Certificate Details</h3>
            <p><span className="font-medium text-gray-700">Patient:</span> {selectedPatient.name}</p>
            <p><span className="font-medium text-gray-700">License Number:</span> {selectedPatient.license}</p>
            <p className={`break-all font-medium ${selectedPatient.hash === "Not Found" ? "text-red-600" : "text-gray-600"}`}>
              <span className="text-gray-700">Blockchain Hash:</span> {selectedPatient.hash}
            </p>
            
            <motion.button
              whileTap={{ scale: 0.9 }}
              className={`mt-4 w-full px-6 py-3 rounded-xl shadow-md transition-all ${selectedPatient.hash === "Not Found" ? "bg-red-600 hover:bg-red-700 text-white" : "bg-green-600 hover:bg-green-700 text-white"}`}
              onClick={handleVerify}
            >
              Verify
            </motion.button>
            
            {verified && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className={`mt-4 font-medium text-center ${selectedPatient.hash === "Not Found" ? "text-red-600" : "text-green-700"}`}
              >
                {selectedPatient.hash === "Not Found" 
                  ? "❌ Verification Failed: This certificate is not found on the blockchain."
                  : "✅ Verified: This certificate is issued by the platform and stored on the Polygon blockchain."}
              </motion.p>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}