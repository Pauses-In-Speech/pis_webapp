import React, { useRef, useState } from 'react';
import { Box, Text, Button, Heading, Flex, Input, Progress, HStack } from '@chakra-ui/react';
import { useColorMode } from '@chakra-ui/color-mode'
import { useNavigate } from 'react-router-dom';
import FakeProgress from 'fake-progress';

function AudioUpload({ onSpeechObjectSelect, loginToken, speechObject, toggleTranscription }) {
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
  const [progression, setProgression] = useState(0);
  const navigate = useNavigate();

  const audioInputRef = useRef();
  const transcriptInputRef = useRef();
  const { colorMode, toggleColorMode } = useColorMode();

  var progr = new FakeProgress({
    timeConstant: 30000,
  })

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
    const updateProgress = () => {
      console.log("Updating progress bar to " + (progr.progress * 100).toFixed(1) + ' %')
      setProgression(progr.progress * 100);
    };

    let intervalId;
    intervalId = setInterval(updateProgress, 200); // Update every 1000ms (1 second)
    progr.start();

    setAudioUploadStatus('Processing...');
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

    // let isVerified = await verifyLoginToken(loginToken);
    // if (!isVerified) {
    //   console.log("Redirecting - NO LOGIN");
    //   navigate("/");
    //   return;
    // } else {
    //   console.log("You may stay on page - LOGIN VERIFIED");
    // }

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
    progr.end()
    setTimeout(() => {
      console.log("clearing interval")
      clearInterval(intervalId);
    }, 1000)
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
      // Get currently selected speechID here
      const response = await fetch(`http://0.0.0.0:8000/speech/transcript/?speech_id=${speechObject}`, { // use audioId instead of data.audio_id
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${loginToken}`,
        },
        body: formData,
      });
      const data = await response.json();
      setTranscriptUploadStatus(`Transcript updated for uploaded at: ${speechObject}`);
      // navigate("/home");
      toggleTranscription();
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
        <HStack m={4} spacing={4} w="100%">
          <Button onClick={handleAudioFileUpload}>Upload</Button>
          {audioUploadStatus ? <Text>{audioUploadStatus}</Text> : <Text style={{ color: 'transparent' }}>-</Text>}
        </HStack>
        <Box marginX={4} marginBottom={4} rounded="lg" borderRadius={10} border="1px">
          {/* This progress right here does not update its value. Progression seems to be never updated. This needs fixing */}
          <Progress
            m={2}
            hasStripe
            value={progression}
            sx={{
              "& > div:first-child": {
                transitionProperty: "width",
              },
            }}
          />
        </Box>
      </Box>

      {speechObject !== null ? (
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
          <HStack m={4} spacing={4} w="100%">
          <Button onClick={handleTranscriptFileUpload}>Upload</Button>
          {transcriptUploadStatus ? <Text>{transcriptUploadStatus}</Text> : <Text style={{ color: 'transparent' }}>-</Text>}
          </HStack>
        </Box>
      ) : (
        <Box minH={14} width="50%"></Box>
      )}
    </Flex>
  );
};

export default AudioUpload;
// https://stackoverflow.com/questions/30047205/how-can-i-check-if-an-environment-variable-is-set-in-node-js