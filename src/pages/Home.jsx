import AudioUpload from "../components/AudioUpload";
import Player from "../components/Player";
import Statistics from "../components/Statistics";

import React, { useState } from "react";

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
  const [currentTime, setCurrentTime] = useState(0)

    // Function to handle selecting a speechObject
    const handleCurrentTime = (currentTime) => {
      setCurrentTime(currentTime);
    };

  return (
    <div>
      <AudioUpload onSpeechObjectSelect={onSpeechObjectSelect}/>
      <Player speechObject={speechObject} currentTime={currentTime} handleCurrentTime={handleCurrentTime} />
      <Statistics speechObject={speechObject} />
    </div>
  )
}

export default Home;