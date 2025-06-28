import React, { useState } from 'react';
import { FileText, CheckCircle, Plus } from 'lucide-react';
import jsPDF from 'jspdf';

// Main Prescription Generator Component
const PrescriptionGenerator = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedPrescription, setGeneratedPrescription] = useState('');
  const [formData, setFormData] = useState({
    doctorName: '',
    patientName: '',
    issueDate: new Date().toISOString().split('T')[0],
    diseaseName: '',
    medications: [{ medicineName: '', dose: '', frequency: '', duration: '' }]
  });

  // Handle form changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle medication changes
  const handleMedicationChange = (index, field, value) => {
    const updatedMedications = [...formData.medications];
    updatedMedications[index][field] = value;
    setFormData({
      ...formData,
      medications: updatedMedications
    });
  };

  // Add new medication field
  const addMedication = () => {
    setFormData({
      ...formData,
      medications: [...formData.medications, { medicineName: '', dose: '', frequency: '', duration: '' }]
    });
  };

  // Remove medication field
  const removeMedication = (index) => {
    const updatedMedications = [...formData.medications];
    updatedMedications.splice(index, 1);
    setFormData({
      ...formData,
      medications: updatedMedications
    });
  };

  // Generate prescription using Gemini API
  const generatePrescription = async () => {
    setIsLoading(true);
    try {
      // This is a placeholder for the Gemini API call
      // In a real implementation, you would make an API call to Gemini here
      
      // Sample prompt for Gemini API
      const prompt = `
        Create a formal medical prescription with the following details:
        Doctor: ${formData.doctorName}
        Patient: ${formData.patientName}
        Date: ${formData.issueDate}
        Diagnosis: ${formData.diseaseName}
        Medications:
        ${formData.medications.map(med => 
          `- ${med.medicineName} ${med.dose}, ${med.frequency}, for ${med.duration}`
        ).join('\n')}
        
        Format this as a formal prescription including dosage instructions, warnings, and follow-up recommendations.
      `;
      
      // Simulating API response for demonstration
      setTimeout(() => {
        const sampleResponse = `
        MEDICAL PRESCRIPTION
        
        Dr. ${formData.doctorName}
        
        Patient: ${formData.patientName}
        Date: ${formData.issueDate}
        
        Diagnosis: ${formData.diseaseName}
        
        Rx:
        ${formData.medications.map((med, idx) => 
          `${idx + 1}. ${med.medicineName} - ${med.dose}
             Take ${med.frequency} for ${med.duration}
          `
        ).join('\n')}
        
        Instructions:
        - Take medications as prescribed
        - Complete the full course of treatment
        - Store in a cool, dry place away from children
        
        Follow-up in 7 days if symptoms persist.
        
        ArogyaVault Verified
        `;
        
        setGeneratedPrescription(sampleResponse);
        setIsLoading(false);
      }, 1500);
      
      // In actual implementation:
      // const response = await fetch('YOUR_GEMINI_API_ENDPOINT', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': 'Bearer YOUR_GEMINI_API_KEY'
      //   },
      //   body: JSON.stringify({ prompt })
      // });
      // const data = await response.json();
      // setGeneratedPrescription(data.response);
      // setIsLoading(false);
      
    } catch (error) {
      console.error('Error generating prescription:', error);
      setIsLoading(false);
    }
  };

  // Create and download PDF
  const downloadPDF = () => {
    const doc = new jsPDF();
    
    // Green header
    doc.setFillColor(34, 197, 94); // Tailwind green-500
    doc.rect(0, 0, 210, 20, 'F');
    
    // White text for header
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text("ArogyaVault Medical Prescription", 105, 14, { align: 'center' });
    
    // Reset to black text for body
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    
    // Add content
    const lines = generatedPrescription.split('\n');
    let y = 30;
    
    lines.forEach(line => {
      if (line.trim() === '') return;
      
      // Handle headings with green color
      if (line.includes('MEDICAL PRESCRIPTION') || line.includes('Rx:') || line.includes('Instructions:')) {
        doc.setTextColor(34, 197, 94);
        doc.setFontSize(14);
        doc.text(line, 15, y);
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
      } else if (line.includes('ArogyaVault Verified')) {
        // Skip this line as we'll add a seal instead
      } else {
        doc.text(line, 15, y);
      }
      y += 7;
    });
    
    // Add ArogyaVault seal
    // Draw circular seal
    doc.setDrawColor(34, 197, 94); // Green border
    doc.setLineWidth(0.5);
    doc.circle(105, 250, 20, 'S');
    
    // Inner circle
    doc.setDrawColor(34, 197, 94);
    doc.circle(105, 250, 15, 'S');
    
    // Text in seal
    doc.setTextColor(34, 197, 94);
    doc.setFontSize(10);
    doc.text("AROGYA", 105, 245, { align: 'center' });
    doc.text("VAULT", 105, 250, { align: 'center' });
    doc.text("VERIFIED", 105, 255, { align: 'center' });
    
    // Green footer
    doc.setFillColor(34, 197, 94);
    doc.rect(0, 280, 210, 17, 'F');
    
    // Save the PDF
    doc.save(`prescription_${formData.patientName.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <div className="min-h-screen bg-green-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-green-500 text-white p-4 rounded-t-lg">
          <h1 className="text-2xl font-bold text-center">ArogyaVault Prescription Generator</h1>
        </div>
        
        {/* Main content */}
        <div className="bg-white shadow-md rounded-b-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Input Form */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold text-green-700 mb-4">Prescription Details</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-green-700">Doctor's Name</label>
                  <input
                    type="text"
                    name="doctorName"
                    value={formData.doctorName}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-green-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
                    placeholder="Dr. Name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-green-700">Patient's Name</label>
                  <input
                    type="text"
                    name="patientName"
                    value={formData.patientName}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-green-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
                    placeholder="Patient Name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-green-700">Issue Date</label>
                  <input
                    type="date"
                    name="issueDate"
                    value={formData.issueDate}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-green-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-green-700">Disease/Condition</label>
                  <input
                    type="text"
                    name="diseaseName"
                    value={formData.diseaseName}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-green-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
                    placeholder="Disease or condition"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-2">Medications</label>
                  
                  {formData.medications.map((med, index) => (
                    <div key={index} className="p-3 bg-white rounded-md mb-3 shadow-sm">
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <div>
                          <label className="block text-xs text-green-600">Medicine Name</label>
                          <input
                            type="text"
                            value={med.medicineName}
                            onChange={(e) => handleMedicationChange(index, 'medicineName', e.target.value)}
                            className="mt-1 block w-full rounded-md border-green-200 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 text-sm"
                            placeholder="Medicine name"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-green-600">Dosage</label>
                          <input
                            type="text"
                            value={med.dose}
                            onChange={(e) => handleMedicationChange(index, 'dose', e.target.value)}
                            className="mt-1 block w-full rounded-md border-green-200 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 text-sm"
                            placeholder="e.g. 500mg"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs text-green-600">Frequency</label>
                          <input
                            type="text"
                            value={med.frequency}
                            onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)}
                            className="mt-1 block w-full rounded-md border-green-200 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 text-sm"
                            placeholder="e.g. twice daily"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-green-600">Duration</label>
                          <input
                            type="text"
                            value={med.duration}
                            onChange={(e) => handleMedicationChange(index, 'duration', e.target.value)}
                            className="mt-1 block w-full rounded-md border-green-200 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 text-sm"
                            placeholder="e.g. 7 days"
                          />
                        </div>
                      </div>
                      
                      {formData.medications.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeMedication(index)}
                          className="mt-2 text-xs text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    onClick={addMedication}
                    className="text-green-600 bg-green-100 hover:bg-green-200 px-3 py-1 rounded-md text-sm flex items-center"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add Medication
                  </button>
                </div>
                
                <button
                  type="button"
                  onClick={generatePrescription}
                  disabled={isLoading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md shadow-sm flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Generate Prescription
                    </>
                  )}
                </button>
              </div>
            </div>
            
            {/* Output Preview */}
            <div className="bg-white p-4 border border-green-200 rounded-lg h-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-green-700">Prescription Preview</h2>
                {generatedPrescription && (
                  <button
                    onClick={downloadPDF}
                    className="bg-green-100 text-green-700 hover:bg-green-200 px-3 py-1 rounded-md text-sm flex items-center"
                  >
                    <FileText className="w-4 h-4 mr-1" />
                    Download PDF
                  </button>
                )}
              </div>
              
              {generatedPrescription ? (
                <div className="whitespace-pre-line font-mono text-sm border-l-4 border-green-500 pl-4">
                  {generatedPrescription}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                  <FileText className="w-12 h-12 mb-2" />
                  <p>Fill in the form and generate a prescription</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionGenerator;