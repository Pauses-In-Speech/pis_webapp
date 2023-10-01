import AudioUpload from "../components/AudioUpload";
import Player from "../components/Player";
import Statistics from "../components/Statistics";

import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

function Home({ speechObject, onSpeechObjectSelect, loginToken, verifyLoginToken }) {
  // Placeholder speech object
  const placeholderSpeechObject = {
    id: "12345",
    uploadDate: {
      day: "01",
      month: "06",
      year: "2023"
    }
  };

  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(0)
  const [isVerified, setIsVerified] = useState(false);
  let [newTranscription, setNewTranscription] = useState("no");
  const toggleTranscription = () => {
    setNewTranscription(newTranscription === "no" ? "yes" : "no");
  }

  // Function to handle selecting a speechObject
  const handleCurrentTime = (currentTime) => {
    setCurrentTime(currentTime);
  };

  useEffect(() => {
    verifyLoginToken(loginToken).then((isVerified) => {
      setIsVerified(isVerified);
      if (!isVerified) {
        console.log("Redirecting - NO LOGIN");
        navigate("/");
      } else {
        console.log("You may stay on page - LOGIN VERIFIED");
      }
    });
  }, [loginToken, navigate, verifyLoginToken]);

  // Render content conditionally based on login verification
  if (!isVerified) {
    return null; // Or you can render a loading spinner or message
  }

  return (
    <div>
      {/* Render your content here */}
      <AudioUpload onSpeechObjectSelect={onSpeechObjectSelect} loginToken={loginToken} speechObject={speechObject} toggleTranscription={toggleTranscription}/>
      <Player
        speechObject={speechObject}
        currentTime={currentTime}
        handleCurrentTime={handleCurrentTime}
        loginToken={loginToken}
      />
      <Statistics speechObject={speechObject} currentTime={currentTime} loginToken={loginToken} newTranscription={newTranscription}/>
    </div>
  );
}

export default Home;