import React from 'react'
import SpeechObject from '../components/SpeechObject'
import { Heading, HStack} from '@chakra-ui/react'

function Library({ onSpeechObjectSelect }) {
  return (
    <div>
      <Heading size="md">Library</Heading>
      <HStack spacing={8} w="100%">
        <SpeechObject key ={"0123/foobar"} identifier={"TestIdentifier/0123/foo"} />
        <SpeechObject key ={"4567/foobar"} identifier={"TestIdentifier/4567/bar"} />
      </HStack>
    </div>
  )
}

export default Library