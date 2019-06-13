import React, { useState } from "react";
import "./Uploads.css";
import axios from "axios";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";

function Uploads() {
  const [selectedFile, setSelectedFile] = useState([null]);
  const [isLoad, setLoadFile] = useState([0]);

  // DOTO
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // DOTO
  const handleUpload = (event) => {
    event.preventDefault();
    const data = new FormData();
    console.log(selectedFile);
    data.append('file', selectedFile, selectedFile.name);
    axios.post('/api/files/upload', data, {
      onUploadProgress: ProgressEvent => {
        setLoadFile((ProgressEvent.loaded / ProgressEvent.total) * 100);
      },
    }).then((res) => {
      console.log(res.statusText);
    });
  };

  return (
    <div className="ag-theme-material x">
      <form className="UploadForm">
        <input type="file" name="name" onChange={handleFileChange} />
        <button onClick={handleUpload}> clickme </button>
      </form>
      <p>{Math.round(isLoad)} %</p>
    </div>
  );
}

export default Uploads;
