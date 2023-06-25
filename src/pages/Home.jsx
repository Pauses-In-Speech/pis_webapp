import AudioUpload from "../components/AudioUpload";
import Player from "../components/Player";

import React from "react";

function Home() {
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
      <AudioUpload />
      <Player speechObject={placeholderSpeechObject} />
    </div>
  )
}

export default Home;