import { Box, Flex, Heading, Image, Text } from '@chakra-ui/react'
import React from 'react'

function Player({ speechObject }) {
  return (
    <Box p={4}>
      <Box border="1px" rounded="lg" bg="pink.100">
        <Heading ml={4} size="md">Player</Heading>
        <Flex direction="column">
          <Text ml={4} fontSize="lg" isTruncated>
            {speechObject.id}
          </Text>
          <Text ml={4} as="i">
            {`${speechObject.uploadDate.day}/${speechObject.uploadDate.month}/${speechObject.uploadDate.year}`}
          </Text>
          <Box style={{marginTop: "auto"}} m={4}>
            <audio style={{ width: "100%" }} controls>
              {/* TODO: change audio object */}
              <source src={speechObject.audio} type="audio/mpeg"></source>
            </audio>
          </Box>
            <Image m={4} boxSize="50%" mt={0} src='https://img.freepik.com/premium-vector/sound-wave-with-imitation-sound-audio-identification-technology_106065-64.jpg?w=1480' alt='Sound files' />
        </Flex>
      </Box>
    </Box>
  )
}

export default Player