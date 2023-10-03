import { Box, Flex, Heading, Image, Text, Button } from '@chakra-ui/react';
import { useColorMode } from '@chakra-ui/color-mode'
import { isEqual } from 'lodash';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import WaveSurfer from 'wavesurfer.js';
import RegionsPlugin from 'wavesurfer.js/plugins/regions'
import Timeline from 'wavesurfer.js/plugins/timeline'


async function fetchSpeechObjectData(speechObject, loginToken) {
  try {
    const response = await fetch(`http://0.0.0.0:8000/speech/${speechObject}`, {
    headers: {
      'Authorization': `Bearer ${loginToken}`,
    },
    });
    const data = await response.json();
    console.log(data)
    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Can't fetch speech object.");
  }
}

async function fetchSpeechObjectAudioData(speechObject, loginToken) {
  try {
    const response = await fetch(`http://0.0.0.0:8000/audio/download/${speechObject}`, {
      headers: {
        'Authorization': `Bearer ${loginToken}`,
      },
      });
    const audioData = await response.blob();
    console.log(audioData);
    return audioData;
  } catch (error) {
    console.error(error);
    throw new Error("Can't download speech object.");
  }
}


// WaveSurfer hook
const useWavesurfer = (containerRef, options) => {
  const [wavesurfer, setWavesurfer] = useState(null)

  const [wsRegions, setWsRegions] = useState(null)


  // Initialize wavesurfer when the container mounts
  // or any of the props change
  useEffect(() => {
    // console.log("ContainerRef or options have changed! Recreating ws")
    if (!containerRef.current) return

    const ws = WaveSurfer.create({
      ...options,
      container: containerRef.current,
    })

    // Initialize the Regions plugin
    const wsr = ws.registerPlugin(RegionsPlugin.create())
    setWsRegions(wsr)

    setWavesurfer(ws)

    return () => {
      wsr.destroy()
      ws.destroy()
    }
  }, [options, containerRef])

  // useEffect(() => {
  //   console.log("Options have changed!")
  // }, [options])

  // useEffect(() => {
  //   console.log("containerRef has changed!")
  // }, [containerRef])

  return [wavesurfer, wsRegions]
}

// Create a React component that will render wavesurfer.
// Props are wavesurfer options.
// const WaveSurferPlayer = (props) => {
// const WaveSurferPlayer = ({pauseData, ...props}) => {
const WaveSurferPlayer = ({ pauseData, currentTime, handleCurrentTime, ...props }) => {
  console.log(props)
  const containerRef = useRef()
  const [isPlaying, setIsPlaying] = useState(false)


  // Memoize the previous props object
  const prevPropsRef = useRef(props);
  let workingProps;
  if (!isEqual(prevPropsRef.current.url, props.url) || 
            !isEqual(prevPropsRef.current.minPxPerSec, props.minPxPerSec)) {
    workingProps = props
    prevPropsRef.current = props; // Update the previous props
  } else {
    workingProps = prevPropsRef.current;
  }

  const [wavesurfer, wsRegions] = useWavesurfer(containerRef, workingProps)

  // On play button click
  const onPlayClick = useCallback(() => {
    wavesurfer.isPlaying() ? wavesurfer.pause() : wavesurfer.play()
  }, [wavesurfer])

  // Initialize wavesurfer when the container mounts
  // or any of the props change
  useEffect(() => {
    if (!wavesurfer) return

    handleCurrentTime(0)
    setIsPlaying(false)

    const subscriptions = [
      wavesurfer.on('play', () => setIsPlaying(true)),
      wavesurfer.on('pause', () => setIsPlaying(false)),
      wavesurfer.on('timeupdate', (myCurrentTime) => handleCurrentTime(myCurrentTime)),
    ]

    // create regions for all pauses
    console.log(pauseData.silences)
    pauseData.silences.forEach(element => {
      subscriptions.push(
        wavesurfer.on('decode', () => {
          // Regions
          wsRegions.addRegion({
            start: element.start,
            end: element.end,
            color: "rgba(70, 233, 30, 0.3)",
            drag: false,
            resize: false,
          })
        })
      )
    });

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

      <p>Seconds played: {currentTime.toFixed(1)}</p>
    </>
  )
}


function Player({ speechObject, currentTime, handleCurrentTime, loginToken}) {
  const { colorMode, toggleColorMode } = useColorMode();
  const [data, setData] = useState(null);
  const [audioData, setAudioData] = useState(null);
  const [pauseImageData, setPauseImageData] = useState(null);
  const [auditokImageData, setAuditokImageData] = useState(null);
  const playerWidth = Math.floor(window.innerWidth * 1.0);

  useEffect(() => {
    if (speechObject) {
      // Fetch speech object data
      fetchSpeechObjectData(speechObject, loginToken)
        .then((responseData) => {
          setData(responseData);
        })
        .catch((error) => {
          console.error(error);
          setData(null);
        });

      // Download audio data
      fetchSpeechObjectAudioData(speechObject, loginToken)
        .then((responseData) => {
          const audioUrl = URL.createObjectURL(responseData);
          setAudioData(audioUrl);
        })
        .catch((error) => {
          console.error(error);
          setAudioData(null);
        });

      // // Download pause image
      // fetchPauseImage(speechObject, playerWidth, 160)
      //   .then((responseData) => {
      //     const imageUrl = URL.createObjectURL(responseData);
      //     setPauseImageData(imageUrl);
      //   })
      //   .catch((error) => {
      //     console.error(error);
      //     setPauseImageData(null);
      //   });

      // // Download auditok image
      // fetchAuditokImage(speechObject, playerWidth, 160)
      //   .then((responseData) => {
      //     const imageUrl = URL.createObjectURL(responseData);
      //     setAuditokImageData(imageUrl);
      //   })
      //   .catch((error) => {
      //     console.error(error);
      //     setAuditokImageData(null);
      //   });
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

  // if (!auditokImageData) {
  //   return <Box m={4}>Generating Auditok image...</Box>
  // }

  // if (!pauseImageData) {
  //   return <Box m={4}>Generating pause image...</Box>
  // }

  return (
    <Box p={4}>
      <Box border="0px" rounded="lg" bg={colorMode === "dark" ? "whiteAlpha.200" : "blackAlpha.500"}>
        <Heading p={4} size="md">
          Player
        </Heading>
        <Flex direction="column">
          <Text ml={4} fontSize="lg" isTruncated>
            {data.id.substring(data.id.indexOf('_')+1)}
          </Text>
          <Text ml={4} as="i">
            {`${data.upload_date.day}/${data.upload_date.month}/${data.upload_date.year}`}
          </Text>
          <Box style={{ marginTop: 'auto' }} m={4}>
            <WaveSurferPlayer
              pauseData={data}
              currentTime={currentTime}
              handleCurrentTime={handleCurrentTime}
              height={100}
              waveColor="#5E5C64"
              progressColor="rgb(255, 136, 0)"
              url={audioData}
              plugins={[Timeline.create()]}
              normalize="true"
              barWidth={2}
              barGap={1}
              barRadius={4}
              minPxPerSec={10}
            />
          </Box>
          {/* <Box m={4} ml="65px" mr="210px">
            <Image
              // boxSize="100%"
              src={pauseImageData}
              alt="Image displaying pauses."
            />
          </Box>
          <Box m={4} ml="65px" mr="210px">
            <Image
              // boxSize="100%"
              src={auditokImageData}
              alt="Image displaying Auditok sound visualization."
            />
          </Box> */}
        </Flex>
      </Box >
    </Box >
  );
}

export default Player;