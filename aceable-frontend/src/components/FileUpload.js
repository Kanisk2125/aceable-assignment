import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/upload/', formData);
      setMessage(response.data.message);
    } catch (error) {
      console.error("Error uploading file:", error);
      setMessage("Upload failed.");
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Upload Event File</h2>
      <input type="file" onChange={handleFileChange} />
      <br /><br />
      <button onClick={handleUpload}>Upload</button>
      <p>{message}</p>
    </div>
  );
};

export default FileUpload;
