import React, { useEffect, useState } from 'react';
import { Heading, Box, Flex, TableContainer, Text, Table, TableCaption, Tr, Th, Tbody, Thead, Td } from '@chakra-ui/react'
import { useColorMode } from '@chakra-ui/color-mode'

function Statistics({ speechObject, currentTime }) {
  const { colorMode, toggleColorMode } = useColorMode();

  const [segmentsArr, setSegmentsArr] = useState(null);
  const [currentSegment, setCurrentSegment] = useState(null);
  const [currentTranscription, setCurrentTranscription] = useState(
    `Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam 
    nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, 
    sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. 
    Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. 
    Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor 
    invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam 
    et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est 
    Lorem ipsum dolor sit amet.`
  )

  // Binary search function
  function binarySearch(segmentsArr, currentTime) {
    if (!segmentsArr || segmentsArr.length === 0) {
      return null; // Case 1: No segments, return null
    }

    let low = 0;
    let high = segmentsArr.length - 1;

    // Check if current segment is null and the first segment is a match
    if (currentSegment === null && segmentsArr[0].start <= currentTime &&
      (!segmentsArr[1] || segmentsArr[1].start > currentTime)
    ) {
      setCurrentSegment(segmentsArr[0].id);
      return; // Case 2: Match in segment 1 after null initialization
    }

    // Check if current segment is still valid
    else if (
      segmentsArr[currentSegment] &&
      segmentsArr[currentSegment].start <= currentTime &&
      (!segmentsArr[currentSegment + 1] || segmentsArr[currentSegment + 1].start > currentTime)
    ) {
      return; // Case 3: Current segment is still valid
    }

    // Check if the next higher segment is already a better fit
    else if (segmentsArr[currentSegment + 1] && segmentsArr[currentSegment + 1].start <= currentTime &&
      (!segmentsArr[currentSegment + 2] || segmentsArr[currentSegment + 2].start > currentTime)
    ) {
      setCurrentSegment(segmentsArr[currentSegment + 1].id);
      return; // Case 4: Next higher segment is a match
    }

    // Binary search
    while (low <= high) {
      const mid = Math.floor((low + high) / 2);

      if (segmentsArr[mid].start <= currentTime) {
        if (!segmentsArr[mid + 1] || segmentsArr[mid + 1].start > currentTime) {
          setCurrentSegment(segmentsArr[mid].id);
          return;
        }
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }
  }

  useEffect(() => {
    // Call the binarySearch function with your segmentsArr and currentTime
    binarySearch(segmentsArr, currentTime);

    if (currentSegment === null) {
      return;
    }

    // Use the currentSegment to update the transcription as needed
    const matchedSegment = segmentsArr.find((segment) => segment.id === currentSegment);
    if (matchedSegment) {
      setCurrentTranscription(matchedSegment.text);
    }
  }, [currentSegment, segmentsArr, currentTime]);

  useEffect(() => {
    fetch(`http://localhost:8000/speech/${speechObject}`)
      .then(response => response.json())
      .then(data => setSegmentsArr(data.transcription.segments))
      .catch(error => console.error(error));
  }, [speechObject]);

  return (
    <Flex m={4} gap={4}>
      <Box p={4} minH={28} rounded="lg" bg={colorMode === "dark" ? "whiteAlpha.200" : "blackAlpha.500"} border="0px" w="50%">
        <Heading size="md">Statistics</Heading>
        {/* <Text>WPM: 73</Text>
        <Text>Pauses total: 5</Text>
        <Text>Pauses per min: 8</Text> */}
        <TableContainer minW={400} w="30%">
          <Table variant='striped' colorScheme='yellow'>
            <TableCaption>Audio sequence analysis</TableCaption>
            <Thead>
              <Tr>
                <Th>Metric</Th>
                <Th isNumeric>Value</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>Words per minute</Td>
                <Td isNumeric>73.4</Td>
              </Tr>
              <Tr>
                <Td>Pauses total</Td>
                <Td isNumeric>5</Td>
              </Tr>
              <Tr>
                <Td>Pauses per min</Td>
                <Td isNumeric>8.3</Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
      <Box p={4} minH={28} rounded="lg" bg={colorMode === "dark" ? "whiteAlpha.200" : "blackAlpha.500"} border="0px" w="50%">
        <Heading size="md">Transcript</Heading>
        <Text>{currentTranscription}</Text>
      </Box>
    </Flex>

  )
}

export default Statistics