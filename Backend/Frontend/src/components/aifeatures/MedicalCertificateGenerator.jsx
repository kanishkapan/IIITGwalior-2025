import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";

export default function MedicalCertificateGenerator() {
  const [formData, setFormData] = useState({
    patientName: "",
    patientAge: "",
    patientGender: "",
    doctorName: "",
    doctorSpecialty: "",
    diagnosis: "",
    treatment: "",
    recommendedRestDays: "",
    date: new Date().toISOString().split('T')[0],
    medicalLicenseNumber: "",
    hospitalName: "General Medical Center"
  });

  const [certificateText, setCertificateText] = useState("Complete the form and click 'Generate Certificate'");
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [certificates, setCertificates] = useState([]);

  // Generate certificate content
  const getCertificateContent = async () => {
    // Form validation
    if (!formData.patientName || !formData.doctorName || !formData.diagnosis || !formData.date) {
      setValidationError("Please fill in all required fields marked with *");
      return;
    }
    
    setValidationError("");
    setLoading(true);
    
    try {
      // Generate content directly (no API call)
      const generatedText = generateCertificateTemplate();
      setCertificateText(generatedText);
      
      // Add to history
      const newCertificate = {
        id: Date.now(),
        patientName: formData.patientName,
        diagnosis: formData.diagnosis,
        date: formData.date,
        content: generatedText
      };
      
      setCertificates([newCertificate, ...certificates]);
    } catch (error) {
      setCertificateText("Error generating certificate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Template generator function
  const generateCertificateTemplate = () => {
    const today = new Date(formData.date);
    const formattedDate = today.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const returnDate = new Date(today);
    returnDate.setDate(today.getDate() + parseInt(formData.recommendedRestDays || 7));
    const formattedReturnDate = returnDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return `
${formData.hospitalName}
${formData.hospitalName === "General Medical Center" ? "123 Healthcare Avenue, Medical District" : ""}
-------------------------------------------------

MEDICAL CERTIFICATE

Date: ${formattedDate}
Certificate ID: MC-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}

This is to certify that I have examined:

PATIENT INFORMATION:
Name: ${formData.patientName}
${formData.patientAge ? `Age: ${formData.patientAge}` : ""}
${formData.patientGender ? `Gender: ${formData.patientGender}` : ""}

DIAGNOSIS:
${formData.diagnosis}

${formData.treatment ? `TREATMENT PRESCRIBED:
${formData.treatment}` : ""}

RECOMMENDATIONS:
${formData.recommendedRestDays ? 
  `Patient is advised to rest for ${formData.recommendedRestDays} days.
Expected return to work/school date: ${formattedReturnDate}.` : 
  "Patient is advised to rest as needed and follow the prescribed treatment plan."}

This certificate is issued for medical purposes.

Signed,

Dr. ${formData.doctorName}
${formData.doctorSpecialty ? formData.doctorSpecialty : "General Practitioner"}
${formData.medicalLicenseNumber ? `License: ${formData.medicalLicenseNumber}` : ""}
`;
  };

  // Generate and download PDF function
  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Set document properties
    doc.setProperties({
      title: `Medical Certificate - ${formData.patientName}`,
      subject: 'Medical Certificate',
      author: `Dr. ${formData.doctorName}`,
      creator: 'Medical Certificate Generator'
    });
    
    // Add hospital/clinic name
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(34, 139, 34); // Forest green
    doc.text(formData.hospitalName, 105, 20, { align: "center" });
    
    if (formData.hospitalName === "General Medical Center") {
      doc.setFontSize(10);
      doc.text("123 Healthcare Avenue, Medical District", 105, 25, { align: "center" });
    }
    
    doc.setLineWidth(0.5);
    doc.line(20, 30, 190, 30);
    
    // Certificate Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(34, 139, 34);
    doc.text("MEDICAL CERTIFICATE", 105, 40, { align: "center" });
    
    // Main content
    doc.setFont("times", "normal");
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    
    // Date and certificate ID
    const today = new Date(formData.date);
    const formattedDate = today.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    doc.text(`Date: ${formattedDate}`, 20, 50);
    doc.text(`Certificate ID: MC-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`, 20, 57);
    
    doc.text("This is to certify that I have examined:", 20, 67);
    
    // Patient information
    doc.setFont("times", "bold");
    doc.text("PATIENT INFORMATION:", 20, 77);
    doc.setFont("times", "normal");
    doc.text(`Name: ${formData.patientName}`, 25, 84);
    
    let currentY = 84;
    
    if (formData.patientAge) {
      currentY += 7;
      doc.text(`Age: ${formData.patientAge}`, 25, currentY);
    }
    
    if (formData.patientGender) {
      currentY += 7;
      doc.text(`Gender: ${formData.patientGender}`, 25, currentY);
    }
    
    currentY += 10;
    
    // Diagnosis
    doc.setFont("times", "bold");
    doc.text("DIAGNOSIS:", 20, currentY);
    doc.setFont("times", "normal");
    
    // Handle multi-line text for diagnosis
    const diagnosisLines = doc.splitTextToSize(formData.diagnosis, 150);
    diagnosisLines.forEach((line, index) => {
      doc.text(line, 25, currentY + 7 + (index * 7));
    });
    
    currentY += 7 + (diagnosisLines.length * 7) + 5;
    
    // Treatment if provided
    if (formData.treatment) {
      doc.setFont("times", "bold");
      doc.text("TREATMENT PRESCRIBED:", 20, currentY);
      doc.setFont("times", "normal");
      
      const treatmentLines = doc.splitTextToSize(formData.treatment, 150);
      treatmentLines.forEach((line, index) => {
        doc.text(line, 25, currentY + 7 + (index * 7));
      });
      
      currentY += 7 + (treatmentLines.length * 7) + 5;
    }
    
    // Recommendations
    doc.setFont("times", "bold");
    doc.text("RECOMMENDATIONS:", 20, currentY);
    doc.setFont("times", "normal");
    
    if (formData.recommendedRestDays) {
      const returnDate = new Date(today);
      returnDate.setDate(today.getDate() + parseInt(formData.recommendedRestDays));
      const formattedReturnDate = returnDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      doc.text(`Patient is advised to rest for ${formData.recommendedRestDays} days.`, 25, currentY + 7);
      doc.text(`Expected return to work/school date: ${formattedReturnDate}.`, 25, currentY + 14);
      
      currentY += 21;
    } else {
      doc.text("Patient is advised to rest as needed and follow the prescribed treatment plan.", 25, currentY + 7);
      currentY += 14;
    }
    
    // Footer text
    doc.text("This certificate is issued for medical purposes.", 20, currentY);
    
    currentY += 15;
    
    // Signature
    doc.text("Signed,", 20, currentY);
    
    currentY += 10;
    doc.setFont("times", "bold");
    doc.text(`Dr. ${formData.doctorName}`, 20, currentY);
    
    currentY += 7;
    doc.setFont("times", "normal");
    doc.text(formData.doctorSpecialty || "General Practitioner", 20, currentY);
    
    if (formData.medicalLicenseNumber) {
      currentY += 7;
      doc.text(`License: ${formData.medicalLicenseNumber}`, 20, currentY);
    }
    
    // Add a stamp-like certification mark
    doc.setDrawColor(34, 139, 34);
    doc.setLineWidth(0.5);
    doc.circle(160, currentY - 15, 15, 'S');
    doc.setFont("times", "italic");
    doc.setFontSize(8);
    doc.text("CERTIFIED", 160, currentY - 17, { align: "center" });
    doc.text("MEDICAL", 160, currentY - 13, { align: "center" });
    
    // Save PDF
    const fileName = `Medical_Certificate_${formData.patientName.replace(/\s+/g, '_')}.pdf`;
    doc.save(fileName);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      patientName: "",
      patientAge: "",
      patientGender: "",
      doctorName: "",
      doctorSpecialty: "",
      diagnosis: "",
      treatment: "",
      recommendedRestDays: "",
      date: new Date().toISOString().split('T')[0],
      medicalLicenseNumber: "",
      hospitalName: "General Medical Center"
    });
    setCertificateText("Complete the form and click 'Generate Certificate'");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white p-6">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-800 mb-2">Professional Medical Certificate Generator</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">Generate professional medical certificates for your patients with instant PDF download.</p>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-green-700 mb-4 pb-2 border-b border-green-100">Certificate Information</h2>
            
            {validationError && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md border border-red-200">
                {validationError}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name *</label>
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full p-2 border border-green-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={formData.patientName}
                  onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Patient Age</label>
                <input
                  type="number"
                  placeholder="Age"
                  className="w-full p-2 border border-green-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={formData.patientAge}
                  onChange={(e) => setFormData({ ...formData, patientAge: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Patient Gender</label>
                <select
                  className="w-full p-2 border border-green-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={formData.patientGender}
                  onChange={(e) => setFormData({ ...formData, patientGender: e.target.value })}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Doctor Name *</label>
                <input
                  type="text"
                  placeholder="Dr. Full Name"
                  className="w-full p-2 border border-green-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={formData.doctorName}
                  onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Doctor Specialty</label>
                <input
                  type="text"
                  placeholder="e.g. Cardiologist"
                  className="w-full p-2 border border-green-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={formData.doctorSpecialty}
                  onChange={(e) => setFormData({ ...formData, doctorSpecialty: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Medical License #</label>
                <input
                  type="text"
                  placeholder="License Number"
                  className="w-full p-2 border border-green-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={formData.medicalLicenseNumber}
                  onChange={(e) => setFormData({ ...formData, medicalLicenseNumber: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                <input
                  type="date"
                  className="w-full p-2 border border-green-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hospital/Clinic Name</label>
                <input
                  type="text"
                  placeholder="Hospital Name"
                  className="w-full p-2 border border-green-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={formData.hospitalName}
                  onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosis *</label>
                <textarea
                  placeholder="Medical diagnosis and findings"
                  className="w-full p-2 border border-green-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent h-24"
                  value={formData.diagnosis}
                  onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Treatment Plan</label>
                <textarea
                  placeholder="Prescribed medications and treatment"
                  className="w-full p-2 border border-green-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent h-24"
                  value={formData.treatment}
                  onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Recommended Rest (Days)</label>
                <input
                  type="number"
                  placeholder="Number of days"
                  className="w-full p-2 border border-green-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={formData.recommendedRestDays}
                  onChange={(e) => setFormData({ ...formData, recommendedRestDays: e.target.value })}
                />
              </div>
            </div>
            
            <div className="flex gap-4 mt-6">
              <button
                onClick={getCertificateContent}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded transition ease-in-out flex items-center justify-center"
                disabled={loading}
              >
                {loading ? (
                  <span>Generating...</span>
                ) : (
                  <span>Generate Certificate</span>
                )}
              </button>
              
              <button
                onClick={resetForm}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-4 rounded transition ease-in-out"
              >
                Reset
              </button>
            </div>
          </div>
          
          {/* Preview Section */}
          <div>
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-green-700">Certificate Preview</h2>
                <button
                  onClick={generatePDF}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition ease-in-out flex items-center"
                  disabled={certificateText === "Complete the form and click 'Generate Certificate'"}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download PDF
                </button>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 min-h-80">
                <div className="whitespace-pre-line font-serif text-gray-700">{certificateText}</div>
              </div>
            </div>
            
            {/* Certificate History */}
            {certificates.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-green-700 mb-4">Recent Certificates</h2>
                <div className="overflow-y-auto max-h-40">
                  {certificates.map(cert => (
                    <div key={cert.id} className="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer" onClick={() => setCertificateText(cert.content)}>
                      <p className="font-medium">{cert.patientName}</p>
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>{cert.diagnosis.slice(0, 40)}{cert.diagnosis.length > 40 ? '...' : ''}</span>
                        <span>{new Date(cert.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>This medical certificate generator is for demonstration purposes only.</p>
          <p>Always consult with qualified healthcare professionals for official medical documentation.</p>
        </footer>
      </div>
    </div>
  );
}