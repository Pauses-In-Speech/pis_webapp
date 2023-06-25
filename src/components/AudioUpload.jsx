import React, { useState } from 'react';
import styled from "styled-components";

function AudioUpload() {
  if('REACT_APP_AM_I_IN_A_DOCKER_CONTAINER' in process.env){
    console.log('It is set!');
    console.log(process.env.AM_I_IN_A_DOCKER_CONTAINER);
  } else {
    console.log('No set!');
    console.log(process.env.AM_I_IN_A_DOCKER_CONTAINER);
  }
  const [uploadStatus, setUploadStatus] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    setSelectedFile(file);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      setUploadStatus('No file selected');
      return;
    }

    setUploadStatus('Uploading...');
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('http://0.0.0.0:8000/audio', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setUploadStatus(`File uploaded at: ${data.file_save_location}`);
    } catch (error) {
      setUploadStatus('Upload failed');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <Wrapper>
      <Card>
        <p
          style={{ padding: '0rem 1rem' }}
        >
          Audio
        </p>
        <DragDropArea
          onDrop={handleFileDrop}
          onDragOver={handleDragOver}
        >
          {selectedFile ? <p>Selected file: {selectedFile.name}</p> : <p>Drag and drop a MP3 or WAV file here, or</p>}
          <input type="file" accept=".mp3,.wav" onChange={handleFileSelect} />
        </DragDropArea>
        <div>
          <button onClick={handleFileUpload}>Upload</button>
        </div>
        {uploadStatus && <div>{uploadStatus}</div>}
      </Card>

      <Card>
        {/* TODO: add transcript file upload handling */}
        <p
          style={{ padding: '0rem 1rem' }}
        >
          Transcript
        </p>
        <DragDropArea
          onDrop={handleFileDrop}
          onDragOver={handleDragOver}
        >
          {selectedFile ? <p>Selected file: {selectedFile.name}</p> : <p>Drag and drop a .txt file here, or</p>}
          <input type="file" accept=".txt" onChange={handleFileSelect} />
        </DragDropArea>
        <div>
          <button onClick={handleFileUpload}>Upload</button>
        </div>
        {uploadStatus && <div>{uploadStatus}</div>}
      </Card>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  margin: 4rem 1rem;
  flex-direction: row;
  display: flex;
  justify-content: center;
  gap: 1rem;
`

const Card = styled.div`
  min-height: 14rem;
  border-radius: 2rem;
  overflow: hidden;
  background: gray;
  width: 50%;

  button {
    color: #BF4F74;
    font-size: 1em;
    margin: 0.5em;
    padding: 0.25em 1em;
    border: 2px solid #BF4F74;
    border-radius: 3px;
  }
`

const DragDropArea = styled.div`
  border: 1px dashed #ccc;
  padding: 0.5rem;
  margin-top: 1rem;
  background: gray;

  &:hover {
    background: lightgray;
  }
`;

export default AudioUpload;
// https://stackoverflow.com/questions/30047205/how-can-i-check-if-an-environment-variable-is-set-in-node-js