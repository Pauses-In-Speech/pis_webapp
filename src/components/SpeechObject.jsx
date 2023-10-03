import { Box, Text, Button, Heading, Stack } from '@chakra-ui/react';
import { useColorMode } from '@chakra-ui/color-mode'
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SpeechObject({ identifier, onSpeechObjectSelect, loginToken }) {
  const navigate = useNavigate();

  const { colorMode, toggleColorMode } = useColorMode();

  const [speechData, setSpeechData] = useState(null);
  
  useEffect(() => {
    fetch(`http://localhost:8000/speech/${identifier}`,
    {
      headers: {
        'Authorization': `Bearer ${loginToken}`,
      },
    }
    )
    .then(response => response.json())
    .then(data => setSpeechData(data))
    .catch(error => console.error(error));
  }, [identifier]);
  
  if (!speechData) {
    return null; // Render nothing if data is not yet loaded
  }

  const { upload_date, transcription } = speechData;

  const handleSelect = (identifier) => {
    onSpeechObjectSelect(identifier);
    navigate("/home");
  }

  // Function to handle deleting a speechObject
  const handleSpeechObjectDelete = (identifier) => {
    // TODO: check if this object was even selected before selecting null object
    onSpeechObjectSelect(null);

    // Delete speech object
    fetch(`http://localhost:8000/audio/${identifier}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${loginToken}`,
      },
    })
      .then(() => {
        // Reload the current page after successful deletion
        window.location.reload();
      })
      .catch(error => console.error(error));
  };

  return (
    <Box border="0px" rounded="lg" bg={colorMode === "dark" ? "whiteAlpha.200" : "blackAlpha.500"} minW="16rem" maxW="20%" p={4}>
      <Heading size="sm">{identifier}</Heading>
      <Text pt={2}>{transcription.text.slice(0, 160)}...</Text>
      <Text pt={1} fontStyle="italic">{`${upload_date.day}/${upload_date.month}/${upload_date.year}`}</Text>
      <Stack pt={4} spacing={4} direction="row" align="center">
      <Button onClick={() => handleSelect(identifier)}>Select</Button>
      <Button onClick={() => handleSpeechObjectDelete(identifier)}>Delete</Button>
      </Stack>
    </Box>
  );
}

export default SpeechObject