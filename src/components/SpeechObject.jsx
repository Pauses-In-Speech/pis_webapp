import { Box, Text } from '@chakra-ui/react'
import React from 'react'

function SpeechObject({identifier}) {
  return (
    <Box border="1px" rounded="lg" bg="pink.100">
      <Text>SpeechObject</Text>
      <Text> Here could be more info</Text>
      <Text>{identifier}</Text>
    </Box>
  )
}

export default SpeechObject