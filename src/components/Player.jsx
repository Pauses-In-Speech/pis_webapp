import { AspectRatio, Box, Flex, Heading, Image, Text } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import AudioUpload from './AudioUpload';

async function fetchSpeechObjectData(speechObject) {
  try {
    const response = await fetch(`http://0.0.0.0:8000/speech/${speechObject}`);
    const data = await response.json();
    console.log(data)
    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Can't fetch speech object.");
  }
}

async function fetchSpeechObjectAudioData(speechObject) {
  try {
    const response = await fetch(`http://0.0.0.0:8000/audio/download/${speechObject}`);
    const audioData = await response.blob();
    console.log(audioData);
    return audioData;
  } catch (error) {
    console.error(error);
    throw new Error("Can't download speech object.");
  }
}

async function fetchPauseImage(speechObject) {
  try {
    const response = await fetch(`http://0.0.0.0:8000/speech/pause_image/${speechObject}`);
    const imageData = await response.blob();
    console.log(imageData);
    return imageData;
  } catch (error) {
    console.error(error);
    throw new Error("Can't download pause image png.");
  }
}



function Player({ speechObject }) {
  const [data, setData] = useState(null);
  const [audioData, setAudioData] = useState(null);
  const [imageData, setImageData] = useState(null);

  useEffect(() => {
    if (speechObject) {
      // Fetch speech object data
      fetchSpeechObjectData(speechObject)
        .then((responseData) => {
          setData(responseData);
        })
        .catch((error) => {
          console.error(error);
          setData(null);
        });

      // Download audio data
      fetchSpeechObjectAudioData(speechObject)
        .then((responseData) => {
          const audioUrl = URL.createObjectURL(responseData);
          setAudioData(audioUrl);
        })
        .catch((error) => {
          console.error(error);
          setAudioData(null);
        });

      // Download pause image
      fetchPauseImage(speechObject)
        .then((responseData) => {
          const imageUrl = URL.createObjectURL(responseData);
          setImageData(imageUrl);
        })
        .catch((error) => {
          console.error(error);
          setImageData(null);
        });
    }
  }, [speechObject]);


  if (!speechObject) {
    return <div>No speechObject selected</div>;
  }

  if (!data) {
    return <div>Fetching...</div>;
  }

  if (!audioData) {
    return <div>Downloading...</div>
  }

  if (!imageData) {
    return <div>Generating pause image...</div>
  }

  return (
    <Box p={4}>
      <Box border="1px" rounded="lg" bg="pink.100">
        <Heading ml={4} size="md">
          Player
        </Heading>
        <Flex direction="column">
          <Text ml={4} fontSize="lg" isTruncated>
            {data.id}
          </Text>
          <Text ml={4} as="i">
            {`${data.upload_date.day}/${data.upload_date.month}/${data.upload_date.year}`}
          </Text>
          <Box style={{ marginTop: 'auto' }} m={4}>
            <audio style={{ width: '100%' }} controls>
              <source src={audioData} type="audio/mpeg"></source>
            </audio>
          </Box>
          <Box m={4}>
            <AspectRatio maxW="100%" ratio={4 / 1} >
              <Image
                boxSize="100%"
                src={imageData}
                alt="Sound files"
              />
            </AspectRatio>
          </Box>
        </Flex>
      </Box >
    </Box >
  );
}

export default Player;