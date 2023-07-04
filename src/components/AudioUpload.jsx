import React, { useState } from 'react';
import styled from "styled-components";
import { Box, Text, Button, Heading, Stack, Flex, Input } from '@chakra-ui/react';

function AudioUpload({ onSpeechObjectSelect }) {
  if('REACT_APP_AM_I_IN_A_DOCKER_CONTAINER' in process.env){
    console.log('It is set!');
    console.log(process.env.REACT_APP_AM_I_IN_A_DOCKER_CONTAINER);
  } else {
    console.log('No set!');
    console.log(process.env.REACT_APP_AM_I_IN_A_DOCKER_CONTAINER);
  }
  const [audioUploadStatus, setAudioUploadStatus] = useState('');
  const [transcriptUploadStatus, setTranscriptUploadStatus] = useState('');
  const [selectedAudioFile, setSelectedAudioFile] = useState(null);
  const [selectedTranscriptFile, setSelectedTranscriptFile] = useState(null);

  const handleAudioFileSelect = (e) => {
    const file = e.target.files[0];
    setSelectedAudioFile(file);
  };

  const handleTranscriptFileSelect = (e) => {
    const file = e.target.files[0];
    setSelectedTranscriptFile(file);
  };

  const handleAudioFileDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    setSelectedAudioFile(file);
  };

  const handleTranscriptFileDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    setSelectedTranscriptFile(file);
  };

  const handleAudioFileUpload = async () => {
    if (!selectedAudioFile) {
      setAudioUploadStatus('No file selected');
      return;
    }

    setAudioUploadStatus('Uploading...');
    const formData = new FormData();
    formData.append('file', selectedAudioFile);

    try {
      const response = await fetch('http://0.0.0.0:8000/audio', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setAudioUploadStatus(`File uploaded at: ${data.audio_id}`);
      onSpeechObjectSelect(data.audio_id);
    } catch (error) {
      setAudioUploadStatus('Upload failed');
    }
  };

  const handleTranscriptFileUpload = async () => {
    if (!selectedTranscriptFile) {
      setTranscriptUploadStatus('No file selected');
      return;
    }

    setTranscriptUploadStatus('Uploading...');
    const formData = new FormData();
    formData.append('file', selectedTranscriptFile);

    try {
      const response = await fetch('http://0.0.0.0:8000/audio', { // change the upload link
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setTranscriptUploadStatus(`File uploaded at: ${data.audio_id}`);
      onSpeechObjectSelect(data.audio_id); // TODO: remove this line
    } catch (error) {
      setTranscriptUploadStatus('Upload failed');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <Flex m={4} gap={4}>
      <Box minH={14} rounded="lg" bg="pink.100" width="50%" borderRadius={15} border="1px">
        <Heading size="md" p={4}>Audio</Heading>
        <Box bg="pink.100" p={4}
          onDrop={handleAudioFileDrop}
          onDragOver={handleDragOver}
          _hover={{ bg: "purple.200" }}
        >
          {selectedAudioFile ? <Text ml={4}>Selected file: {selectedAudioFile.name}</Text> : <Text>Drag and drop a MP3 or WAV file here, or</Text>}
          <Input type="file" accept=".mp3,.wav" onChange={handleAudioFileSelect} />
        </Box>
        <Button m={4} onClick={handleAudioFileUpload}>Upload</Button>
        {audioUploadStatus && <Text>{audioUploadStatus}</Text>}
      </Box>

      <Card>
        {/* TODO: add transcript file upload handling */}
        <p
          style={{ padding: '0rem 1rem' }}
        >
          Transcript
        </p>
        <DragDropArea
          onDrop={handleTranscriptFileDrop}
          onDragOver={handleDragOver}
        >
          {selectedTranscriptFile ? <p>Selected file: {selectedTranscriptFile.name}</p> : <p>Drag and drop a .txt file here, or</p>}
          <input type="file" accept=".txt" onChange={handleTranscriptFileSelect} />
        </DragDropArea>
        <div>
          <button onClick={handleTranscriptFileUpload}>Upload</button>
        </div>
        {transcriptUploadStatus && <div>{transcriptUploadStatus}</div>}
      </Card>
    </Flex>
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