import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [username, setUsername] = useState(localStorage.getItem("username"));
  const navigate = useNavigate();

  useEffect(() => {
    if (!username) {
      navigate("/login");
    } else {
      axios
        .get(`http://localhost:8000/api/v1/files/${username}`)
        .then((response) => {
          setFiles(response.data.files);
        })
        .catch((error) => {
          console.error("Error fetching file list", error);
        });
    }
  }, [username, navigate]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert("Please select a file.");
      return;
    }
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("user_id", username);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setUploadMessage(response.data.message);
      // Update file list after upload
      const fileResponse = await axios.get(
        `http://localhost:8000/api/v1/files/${username}`
      );
      console.log(fileResponse.data)
      setFiles(fileResponse.data);
    } catch (error) {
      console.error("Error uploading file", error);
    }
  };

  const handleFileDownload = (filePath) => {
    // URL encode the file path to ensure proper handling of special characters
    const encodedFilePath = encodeURIComponent(filePath);
    
    axios
      .get(`http://localhost:8000/api/v1/download?download_path=${encodedFilePath}`, {
        responseType: "blob", // Ensure the response is treated as a binary blob
      })
      .then((response) => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = fileURL;
        link.setAttribute("download", filePath.split("/").pop()); // Set the file name from the path
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); // Clean up after download
      })
      .catch((error) => {
        console.error("Error downloading file", error);
      });
  };
  

  return (
    <div>
      <h2>Welcome to the Home Page</h2>
      <h3>Upload a File</h3>
      <form onSubmit={handleFileUpload}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
      {uploadMessage && <p>{uploadMessage}</p>}

      <h3>Your Files</h3>
      <ul className="file-list">
        {Array.isArray(files) && files.length > 0 ? (
            files.map((file) => (
            <li key={file.file_id} className="file-item">
                <div className="file-details">
                <div className="file-name">{file.file_name}</div>
                <div className="file-date">{new Date(file.created_at).toLocaleString()}</div>
                </div>
                <button
                className="download-button"
                onClick={() => handleFileDownload(file.file_path)}
                >
                Download
                </button>
            </li>
            ))
        ) : (
            <p>No files available.</p>
        )}
        </ul>

    </div>
  );
};

export default Home;
