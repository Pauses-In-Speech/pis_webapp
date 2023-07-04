import { AspectRatio, Box, Flex, Heading, Image, Text } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';

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

async function fetchPauseImage(speechObject, width=720, height=80) {

  try {
    const response = await fetch(`http://0.0.0.0:8000/speech/pause_image/${speechObject}?width=${width}&height=${height}`);
    const pauseImageData = await response.blob();
    console.log(pauseImageData);
    return pauseImageData;
  } catch (error) {
    console.error(error);
    throw new Error("Can't download pause image png.");
  }
}

async function fetchAuditokImage(speechObject, width=720, height=80) {
  try {
    const response = await fetch(`http://0.0.0.0:8000/speech/auditok_image/${speechObject}?width=${width}&height=${height}`);
    const auditokImageData = await response.blob();
    console.log(auditokImageData);
    return auditokImageData;
  } catch (error) {
    console.error(error);
    throw new Error("Can't download Auditok image png.");
  }
}



function Player({ speechObject }) {
  const [data, setData] = useState(null);
  const [audioData, setAudioData] = useState(null);
  const [pauseImageData, setPauseImageData] = useState(null);
  const [auditokImageData, setAuditokImageData] = useState(null);
  const playerWidth = Math.floor(window.innerWidth * 1.0);

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
      fetchPauseImage(speechObject, playerWidth, 160)
        .then((responseData) => {
          const imageUrl = URL.createObjectURL(responseData);
          setPauseImageData(imageUrl);
        })
        .catch((error) => {
          console.error(error);
          setPauseImageData(null);
        });

      // Download auditok image
      fetchAuditokImage(speechObject, playerWidth, 160)
        .then((responseData) => {
          const imageUrl = URL.createObjectURL(responseData);
          setAuditokImageData(imageUrl);
        })
        .catch((error) => {
          console.error(error);
          setAuditokImageData(null);
        });
    }
  }, [speechObject]);


  if (!speechObject) {
    return <Box m={4}>No speechObject selected</Box>;
  }

  if (!data) {
    return <Box m={4}>Fetching...</Box>;
  }

  if (!audioData) {
    return <Box m={4}>Downloading...</Box>
  }

  if (!auditokImageData) {
    return <Box m={4}>Generating Auditok image...</Box>
  }

  if (!pauseImageData) {
    return <Box m={4}>Generating pause image...</Box>
  }

  return (
    <Box p={4}>
      <Box border="1px" rounded="lg" bg="pink.100">
        <Heading m={4} size="md">
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
          <Box m={4} ml="65px" mr="210px">
            {/* <AspectRatio maxW="100%" ratio={4 / 1} > */}
              <Image
                // boxSize="100%"
                src={pauseImageData}
                alt="Image displaying pauses."
              />
            {/* </AspectRatio> */}
          </Box>
          <Box m={4} ml="65px" mr="210px">
            {/* <AspectRatio maxW="100%" ratio={4 / 1} > */}
              <Image
                // boxSize="100%"
                src={auditokImageData}
                alt="Image displaying Auditok sound visualization."
              />
            {/* </AspectRatio> */}
          </Box>
        </Flex>
      </Box >
    </Box >
  );
}

export default Player;