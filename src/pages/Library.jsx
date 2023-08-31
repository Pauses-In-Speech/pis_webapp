import React, { useState, useEffect } from 'react'
import SpeechObject from '../components/SpeechObject'
import { Heading, HStack, Box } from '@chakra-ui/react'

function Library({ onSpeechObjectSelect }) {
  const [audioObjects, setAudioObjects] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/audio/')
      .then(response => response.json())
      .then(data => setAudioObjects(data))
      .catch(error => console.error(error));
  }, []);
  return (
    <Box m={4}>
      <Heading p={4} size="md">Library</Heading>
      <HStack spacing={8} w="100%">
        {audioObjects.map(audioObject => (
          <SpeechObject
            key={audioObject.file_path}
            identifier={getIdentifierFromFilePath(audioObject.file_path)}
            onSpeechObjectSelect={onSpeechObjectSelect}
          />
        ))}
      </HStack>
    </Box>
  )
}

function getIdentifierFromFilePath(filePath) {
  const fileName = filePath.split('/').pop();
  return fileName.replace(/\.[^/.]+$/, '');
}

export default Library;