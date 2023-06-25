import React from 'react'
import SpeechObject from '../components/SpeechObject'
import { Heading } from '@chakra-ui/react'

function Library() {
  return (
    <div>
      <Heading size="md">Library</Heading>
      <SpeechObject key ={"0123/foobar"} identifier={"TestIdentifier/0123/foobar"} />
    </div>
  )
}

export default Library