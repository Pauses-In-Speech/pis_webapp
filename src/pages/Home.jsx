import AudioUpload from "../components/AudioUpload";
import Player from "../components/Player";
import Statistics from "../components/Statistics";

import React from "react";

function Home({speechObject, onSpeechObjectSelect}) {
  // Placeholder speech object
  const placeholderSpeechObject = {
    id: "12345",
    uploadDate: {
      day: "01",
      month: "06",
      year: "2023"
    }
  };
  return (
    <div>
      <AudioUpload onSpeechObjectSelect={onSpeechObjectSelect}/>
      <Player speechObject={speechObject} />
      <Statistics speechObjec={speechObject} />
    </div>
  )
}

export default Home;