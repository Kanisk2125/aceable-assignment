import React, { useState } from 'react';
import './App.css';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [searchData, setSearchData] = useState({
    search_field: '',
    search_value: '',
    start_time: '',
    end_time: '',
  });
  const [results, setResults] = useState([]);
  const [searchStatus, setSearchStatus] = useState('');

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/upload/', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      setUploadStatus(response.ok ? result.message : 'Upload failed.');
    } catch {
      setUploadStatus('Upload failed.');
    }
  };

  const handleInputChange = (e) => {
    setSearchData({
      ...searchData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = async () => {
    setSearchStatus('Searching...');
    try {
      const response = await fetch('http://127.0.0.1:8000/api/search/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchData),
      });

      const data = await response.json();
      if (response.ok) {
        setResults(data.results);
        setSearchStatus(`Found ${data.total_found} result(s) in ${data.search_time_seconds}s`);
      } else {
        setSearchStatus('Search failed.');
      }
    } catch {
      setSearchStatus('Search failed.');
    }
  };

  return (
    <div className="App">
      <h1>Aceable Event Management</h1>

      <div className="section">
        <h2>📂 Upload Event File</h2>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload</button>
        <p>{uploadStatus}</p>
      </div>

      <div className="section">
        <h2>🔍 Search Events</h2>
        <input
          type="text"
          name="search_field"
          placeholder="Search Field (e.g., srcaddr, instance-id, status)"
          value={searchData.search_field}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="search_value"
          placeholder="Search Value (e.g., eni-293216456)"
          value={searchData.search_value}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="start_time"
          placeholder="Start Time (optional)"
          value={searchData.start_time}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="end_time"
          placeholder="End Time (optional)"
          value={searchData.end_time}
          onChange={handleInputChange}
        />
        <button onClick={handleSearch}>Search</button>
        <p>{searchStatus}</p>
      </div>

      {results.length > 0 && (
        <div className="section results-table">
          <h3>Results:</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Serial No</th>
                  <th>Account ID</th>
                  <th>Instance ID</th>
                  <th>srcaddr</th>
                  <th>dstaddr</th>
                  <th>starttime</th>
                  <th>endtime</th>
                  <th>action</th>
                  <th>status</th>
                  <th>File</th>
                </tr>
              </thead>
              <tbody>
                {results.map((item, index) => (
                  <tr key={index}>
                    <td>{item.event['serialno']}</td>
                    <td>{item.event['account-id']}</td>
                    <td>{item.event['instance-id']}</td>
                    <td>{item.event['srcaddr']}</td>
                    <td>{item.event['dstaddr']}</td>
                    <td>{item.event['starttime']}</td>
                    <td>{item.event['endtime']}</td>
                    <td>{item.event['action']}</td>
                    <td>{item.event['log-status']}</td>
                    <td>{item.file}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

