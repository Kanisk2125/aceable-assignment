// import React, { useState } from 'react';
// import axios from 'axios';

// const FileUpload = () => {
//   const [file, setFile] = useState(null);
//   const [message, setMessage] = useState('');
//   const [loading, setLoading] = useState(false); // ⬅️ Spinner state

//   const handleFileChange = (event) => {
//     setFile(event.target.files[0]);
//     setMessage('');
//   };

//   const handleUpload = async () => {
//     if (!file) {
//       setMessage("Please select a file first.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append('file', file);

//     try {
//       setLoading(true); // ⬅️ Show spinner
//       const response = await axios.post('http://127.0.0.1:8000/api/upload/', formData);
//       setLoading(false); // ⬅️ Hide spinner
//       setMessage(response.data.message);
//     } catch (error) {
//       console.error("Error uploading file:", error);
//       setLoading(false); // ⬅️ Hide spinner
//       setMessage("Upload failed.");
//     }
//   };

//   return (
//     <div style={{ padding: '20px' }}>
//       <h2>📂 Upload Event File</h2>
//       <input type="file" onChange={handleFileChange} />
//       <br /><br />
//       <button onClick={handleUpload} disabled={loading}>
//         {loading ? "Uploading..." : "Upload"}
//       </button>
//       <p style={{ color: loading ? 'blue' : 'black' }}>{message}</p>
//     </div>
//   );
// };

// export default FileUpload;
import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setMessage('');
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true); // Start spinner

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/upload/', formData);
      setMessage(response.data.message);
    } catch (error) {
      console.error("Error uploading file:", error);
      setMessage("Upload failed.");
    } finally {
      setLoading(false); // Stop spinner
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>📂 Upload Event File</h2>
      <input type="file" onChange={handleFileChange} />
      <br /><br />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Uploading..." : "Upload"}
      </button>
      <p>{message}</p>
    </div>
  );
};

export default FileUpload;
