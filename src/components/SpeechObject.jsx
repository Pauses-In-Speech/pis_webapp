import { Box, Text, Button, Heading } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

function SpeechObject({ identifier, onSpeechObjectSelect }) {
  const [speechData, setSpeechData] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8000/speech/${identifier}`)
      .then(response => response.json())
      .then(data => setSpeechData(data))
      .catch(error => console.error(error));
  }, [identifier]);

  if (!speechData) {
    return null; // Render nothing if data is not yet loaded
  }

  const { upload_date, transcription } = speechData;

  return (
    <Box border="1px" rounded="lg" bg="pink.100" maxW="20%" p={4}>
      <Heading size="sm">{identifier}</Heading>
      <Text>{transcription.text.slice(0,160)}...</Text>
      <Text fontStyle="italic">{`${upload_date.day}/${upload_date.month}/${upload_date.year}`}</Text>
      <Button onClick={() => onSpeechObjectSelect(identifier)}>Select</Button>
    </Box>
  );
}

export default SpeechObject