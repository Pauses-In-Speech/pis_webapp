import { AspectRatio, Box, Flex, Heading, Image, Text, Button } from '@chakra-ui/react';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import WaveSurfer from 'wavesurfer.js';
import Regions from 'wavesurfer.js/plugins/regions'
import Timeline from 'wavesurfer.js/plugins/timeline'


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

// WaveSurfer hook
const useWavesurfer = (containerRef, options) => {
  const [wavesurfer, setWavesurfer] = useState(null)

  // Initialize wavesurfer when the container mounts
  // or any of the props change
  useEffect(() => {
    if (!containerRef.current) return

    const ws = WaveSurfer.create({
      ...options,
      container: containerRef.current,
    })

    setWavesurfer(ws)

    return () => {
      ws.destroy()
    }
  }, [options, containerRef])

  return wavesurfer
}

// Create a React component that will render wavesurfer.
// Props are wavesurfer options.
const WaveSurferPlayer = (props) => {
  const containerRef = useRef()
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const wavesurfer = useWavesurfer(containerRef, props)

  // On play button click
  const onPlayClick = useCallback(() => {
    wavesurfer.isPlaying() ? wavesurfer.pause() : wavesurfer.play()
  }, [wavesurfer])

  // Initialize wavesurfer when the container mounts
  // or any of the props change
  useEffect(() => {
    if (!wavesurfer) return

    setCurrentTime(0)
    setIsPlaying(false)

    const subscriptions = [
      wavesurfer.on('play', () => setIsPlaying(true)),
      wavesurfer.on('pause', () => setIsPlaying(false)),
      wavesurfer.on('timeupdate', (currentTime) => setCurrentTime(currentTime)),
    ]

    return () => {
      subscriptions.forEach((unsub) => unsub())
    }
  }, [wavesurfer])

  return (
    <>
      <div ref={containerRef} style={{ minHeight: '120px' }} />

      <Button onClick={onPlayClick} marginY={4}>
        {isPlaying ? 'Pause' : 'Play'}
      </Button>

      <p>Seconds played: {currentTime}</p>
    </>
  )
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
            <WaveSurferPlayer
              height={100}
              waveColor="#5E5C64"
              progressColor="rgb(255, 136, 0)"
              url={audioData}
              plugins={[Timeline.create()]}
              normalize="true"
              barWidth={2}
              barGap={1}
              barRadius={2}
              minPxPerSec={10}
            />
            {/* <audio style={{ width: '100%' }} controls>
              <source src={audioData} type="audio/mpeg"></source>
            </audio> */}
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