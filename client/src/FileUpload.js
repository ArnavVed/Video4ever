// FileUpload.js
// Purpose: A React component to handle file selection, show upload progress,
// and display success/error messages. Uses Axios to post the file to the backend.

import React, { useState } from 'react';
import axios from 'axios';

function FileUpload() {
  const [selectedFile, setSelectedFile] = useState(null);       // Holds the currently selected file
  const [uploadProgress, setUploadProgress] = useState(0);      // Tracks the upload progress percentage
  const [statusMessage, setStatusMessage] = useState(null);     // Holds success or error messages

  const handleFileChange = (e) => {
    // Triggered when user selects a file
    setSelectedFile(e.target.files[0]);
    setStatusMessage(null);
    setUploadProgress(0);
  };

  const handleUpload = () => {
    if (!selectedFile) {
      setStatusMessage("Please select a file first.");
      return;
    }

    // Prepare form data to send to the server
    const formData = new FormData();
    formData.append('file', selectedFile);

    // Make a POST request to the server endpoint using Axios
    axios.post('/api/upload', formData, {
      // Set headers and config for Axios
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        // Update upload progress as file uploads
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(percentCompleted);
      }
    })
    .then(response => {
      if (response.data.success) {
        setStatusMessage("File uploaded successfully!");
      } else {
        setStatusMessage("File upload failed: " + response.data.message);
      }
    })
    .catch(error => {
      setStatusMessage("An error occurred during file upload.");
      console.error(error);
    });
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} /><br/><br/>
      <button onClick={handleUpload}>Upload</button>
      {uploadProgress > 0 && (
        <div style={{ margin: '20px 0', width: '100%', maxWidth: '300px', background: '#eee' }}>
          <div style={{ 
            width: `${uploadProgress}%`, 
            background: 'green', 
            height: '20px', 
            transition: 'width 0.5s ease' 
          }}></div>
        </div>
      )}
      {statusMessage && <p>{statusMessage}</p>}
    </div>
  );
}

export default FileUpload;
