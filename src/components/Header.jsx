import React from 'react'
import { Box, Text, Flex } from '@chakra-ui/react'

function Header() {
  return (
    <Flex
      mb={8}
      p={8}
      as="nav"
      align="center"
      justify={'space-between'}
      w="100%"
    >
      <Box w="200px">
        <Text fontSize="lg" fontWeight="bold">
          Pauses-In-Speech
        </Text>
      </Box>
    </Flex>
  )
}

export default Header