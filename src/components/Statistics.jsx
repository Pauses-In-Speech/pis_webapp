import React from 'react'
import { Heading, Box, Flex, TableContainer, Text, Table, TableCaption, Tr, Th, Tbody, Thead, Td } from '@chakra-ui/react'
import { useColorMode } from '@chakra-ui/color-mode'

function Statistics() {
  const { colorMode, toggleColorMode } = useColorMode();
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
        <Heading size="md">Placeholder</Heading>
        <Text>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam 
          nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, 
          sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. 
          Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. 
          Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor 
          invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam 
          et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est 
          Lorem ipsum dolor sit amet.</Text>
      </Box>
    </Flex>

  )
}

export default Statistics