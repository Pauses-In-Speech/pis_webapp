import React, { useRef, useState } from 'react';
import { Box, Text, Button, Heading, Flex, Input } from '@chakra-ui/react';
import { useColorMode } from '@chakra-ui/color-mode'
import { useNavigate } from 'react-router-dom';

function AudioUpload({ onSpeechObjectSelect, loginToken, verifyLoginToken }) {
  if ('REACT_APP_AM_I_IN_A_DOCKER_CONTAINER' in process.env) {
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
  const [isLoading, setIsLoading] = useState(false); // Initialize as false
  const navigate = useNavigate();

  const audioInputRef = useRef();
  const transcriptInputRef = useRef();
  const { colorMode, toggleColorMode } = useColorMode();

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
    setIsLoading(true); // Set isLoading to true before making the fetch request
    if (!selectedAudioFile) {
      setAudioUploadStatus('No file selected');
      return;
    }

    setAudioUploadStatus('Uploading...');
    const formData = new FormData();
    formData.append('file', selectedAudioFile);

    // verifyLoginToken(loginToken).then((isVerified) => {
    //   if (!isVerified) {
    //     console.log("Redirecting - NO LOGIN");
    //     navigate("/");
    //   } else {
    //     console.log("You may stay on page - LOGIN VERIFIED");
    //   }
    // });

    let isVerified = await verifyLoginToken(loginToken);
    if (!isVerified) {
      console.log("Redirecting - NO LOGIN");
      navigate("/");
      return;
    } else {
      console.log("You may stay on page - LOGIN VERIFIED");
    }

    try {
      const response = await fetch('http://0.0.0.0:8000/audio', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${loginToken}`,
        },
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
      <Box minH={14} rounded="lg" bg={colorMode === "dark" ? "whiteAlpha.200" : "blackAlpha.500"} width="50%" borderRadius={15} border="0px">
        <Heading size="md" p={4}>Audio</Heading>
        <Box p={4}
          onDrop={handleAudioFileDrop}
          onDragOver={handleDragOver}
          onClick={() => audioInputRef.current.click()}
          _hover={{ bg: "whiteAlpha.300" }}
        >
          {selectedAudioFile ? <Text>Selected file: {selectedAudioFile.name}</Text> : <Text>Drag and drop a MP3 or WAV file here</Text>}
          <Input
            type="file"
            accept=".mp3,.wav"
            onChange={handleAudioFileSelect}
            hidden
            ref={audioInputRef}
          />
          <Button my={4} onClick={() => audioInputRef.current.click()}>Select File</Button>
        </Box>
        <Button m={4} onClick={handleAudioFileUpload}>Upload</Button>
        {audioUploadStatus && <Text m={4}>{audioUploadStatus}</Text>}
      </Box>

      <Box minH={14} rounded="lg" bg={colorMode === "dark" ? "whiteAlpha.200" : "blackAlpha.500"} width="50%" borderRadius={15} border="0px">
        {/* TODO: add transcript file upload handling */}
        <Heading size="md" p={4}>Transcript</Heading>
        <Box p={4}
          onDrop={handleTranscriptFileDrop}
          onDragOver={handleDragOver}
          onClick={() => transcriptInputRef.current.click()}
          _hover={{ bg: "whiteAlpha.300" }}
        >
          {selectedTranscriptFile ? <Text>Selected file: {selectedTranscriptFile.name}</Text> : <Text>Drag and drop a .txt file here</Text>}
          <Input
            type="file"
            accept=".txt"
            onChange={handleTranscriptFileSelect}
            hidden
            ref={transcriptInputRef}
          />
          <Button my={4} onClick={() => transcriptInputRef.current.click()}>Select File</Button>
        </Box>
        <Button m={4} onClick={handleTranscriptFileUpload}>Upload</Button>
        {transcriptUploadStatus && <Text>{transcriptUploadStatus}</Text>}
      </Box>
    </Flex>
  );
};

export default AudioUpload;
// https://stackoverflow.com/questions/30047205/how-can-i-check-if-an-environment-variable-is-set-in-node-js