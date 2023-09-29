import React, { useState, useEffect } from 'react'
import SpeechObject from '../components/SpeechObject'
import { Heading, HStack, Box, Text } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom';

function Library({ onSpeechObjectSelect, loginToken, verifyLoginToken }) {
  const [audioObjects, setAudioObjects] = useState([]);
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Add a loading state

  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8000/audio/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${loginToken}`,
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Can\'t access audio objects from backend!'); // Handle unauthorized response
        }
        return response.json();
      })
      .then(data => {
        setAudioObjects(data);
        setIsLoading(false); // Mark loading as complete
      })
      .catch(error => {
        console.error(error);
        setIsLoading(false); // Mark loading as complete even in case of errors
      });
  }, [loginToken]);

  useEffect(() => {
    verifyLoginToken(loginToken).then((isVerified) => {
      setIsVerified(isVerified);
      if (!isVerified) {
        console.log("Redirecting - NO LOGIN");
        navigate("/");
      } else {
        console.log("You may stay on page - LOGIN VERIFIED");
      }
    });
  }, [loginToken, navigate, verifyLoginToken]);

  // Render content conditionally based on login verification
  if (!isVerified) {
    return null; // Or you can render a loading spinner or message
  }

  if (isLoading) {
    return <div>Loading...</div>; // Render a loading indicator while data is being fetched
  }

  if (audioObjects.length === 0) {
    return (
      <Box m={4}>
        <Heading p={4} size="md">Library</Heading>
        <Text>There are no speech objects in your library yet.</Text>
      </Box>
    )
  }
  console.log("audioObjects is: ", audioObjects);

  console.log("audioObjects.length is: ", audioObjects.length);

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