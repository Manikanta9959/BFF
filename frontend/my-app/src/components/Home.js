import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Home.css"; // Import external CSS for responsive styles

const Home = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [username, setUsername] = useState(localStorage.getItem("username"));
  const navigate = useNavigate();
  const allowedExtensions = ['txt', 'jpg', 'png', 'json'];

  useEffect(() => {
    if (!username) {
      navigate("/login");
    } else {
      // Fetch the file list from the server using the username
      axios
        .get(`http://localhost:8000/api/v1/files/${username}`)
        .then((response) => {
          if (response.data) {
            setFiles(response.data);
          } else {
            console.error("No files found for the user");
          }
        })
        .catch((error) => {
          console.error("Error fetching file list", error);
        });
    }
  }, [username, navigate]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      const fileExtension = selectedFile.name.split('.').pop().toLowerCase();

      if (!allowedExtensions.includes(fileExtension)) {
        alert("Only .txt, .jpg, .png, and .json files are allowed.");
      } else {
        setSelectedFile(selectedFile);
      }
    }
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

      // After upload, re-fetch the updated list of files
      const fileResponse = await axios.get(
        `http://localhost:8000/api/v1/files/${username}`
      );
      setFiles(fileResponse.data.files);
    } catch (error) {
      console.error("Error uploading file", error);
    }
  };

  const handleFileDownload = (filePath) => {
    const encodedFilePath = encodeURIComponent(filePath);
    
    axios
      .get(`http://localhost:8000/api/v1/download?download_path=${encodedFilePath}`, {
        responseType: "blob",
      })
      .then((response) => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = fileURL;
        link.setAttribute("download", filePath.split("/").pop());
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((error) => {
        console.error("Error downloading file", error);
      });
  };

  return (
    <div className="home-container">
      <h2>Upload Filesssss</h2>
      <form onSubmit={handleFileUpload} className="upload-form">
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
      {uploadMessage && <p className="upload-message">{uploadMessage}</p>}

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
