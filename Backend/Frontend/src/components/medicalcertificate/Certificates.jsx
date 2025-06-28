// Certificates.js
import React, { useState } from 'react';
import axios from 'axios';

const Certificates = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    diagnosis: '',
    details: ''
  });
  const [certificate, setCertificate] = useState('');
  const [error, setError] = useState('');

  // Handle changes to the input fields
  const handleChange = (e) => {
    setFormData({ 
      ...formData,
      [e.target.name]: e.target.value 
    });
  };

  // Submit form data to generate a certificate
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // Post the form data to the Express backend
      const res = await axios.post('http://localhost:5173/generate', formData);
      setCertificate(res.data.certificate);
    } catch (err) {
      console.error(err);
      setError('Error generating certificate.');
    }
  };

  // Download the generated certificate as a PDF
  const handleDownload = async () => {
    try {
      // Request the PDF from the backend (certificate is sent in the body)
      const response = await axios.post('http://localhost:5173/download', 
        { certificate },
        { responseType: 'blob' } // important for binary data
      );
      // Create a blob URL for the PDF file and trigger the download
      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: 'application/pdf' })
      );
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'medical_certificate.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
      setError('Error downloading certificate.');
    }
  };

  return (
    <div className="Certificates">
      <h1>Medical Certificate Generator</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Patient Name:</label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div>
          <label htmlFor="age">Age:</label>
          <input 
            type="number" 
            id="age" 
            name="age" 
            value={formData.age} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div>
          <label htmlFor="diagnosis">Diagnosis:</label>
          <input 
            type="text" 
            id="diagnosis" 
            name="diagnosis" 
            value={formData.diagnosis} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div>
          <label htmlFor="details">Additional Details:</label>
          <textarea 
            id="details" 
            name="details" 
            value={formData.details} 
            onChange={handleChange}
          ></textarea>
        </div>
        <button type="submit">Generate Certificate</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {certificate && (
        <div>
          <h2>Generated Certificate</h2>
          <pre style={{ border: '1px solid #ccc', padding: '10px' }}>
            {certificate}
          </pre>
          <button onClick={handleDownload}>Download as PDF</button>
        </div>
      )}
    </div>
  );
};

export default Certificates;
