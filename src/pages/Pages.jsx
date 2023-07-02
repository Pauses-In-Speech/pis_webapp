import React, {useState} from 'react'
import Home from './Home'
import Library from './Library'
import Account from './Account';
import { Route, Routes, useLocation, } from 'react-router-dom';

function Pages() {
  const location = useLocation();
  const [selectedSpeechObject, setSelectedSpeechObject] = useState(null);

  // Function to handle selecting a speechObject
  const handleSpeechObjectSelect = (speechObject) => {
    setSelectedSpeechObject(speechObject);
  };
  return (
    <Routes location={location} key={location.pathname}>
      <Route path='/' element={<Home speechObject={selectedSpeechObject} onSpeechObjectSelect={handleSpeechObjectSelect}/>} />
      <Route path='/library' element={<Library onSpeechObjectSelect={handleSpeechObjectSelect}/>} />
      <Route path='/account' element={<Account />} />
    </Routes>
  )
}

export default Pages