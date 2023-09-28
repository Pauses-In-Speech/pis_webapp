import React, {useState} from 'react'
import Home from './Home'
import Library from './Library'
import Account from './Account';
import Login from './Login';
import { Route, Routes, useLocation, } from 'react-router-dom';

function Pages() {
  const location = useLocation();
  const [selectedSpeechObject, setSelectedSpeechObject] = useState(null);

  // Function to handle selecting a speechObject
  const handleSpeechObjectSelect = (speechObject) => {
    setSelectedSpeechObject(speechObject);
  };

  // TODO write a redirectIfBadToken function and pass to every route except "/"
  return (
    <Routes location={location} key={location.pathname}>
      <Route path='/' element={<Login />} />
      <Route path='/home' element={<Home speechObject={selectedSpeechObject} onSpeechObjectSelect={handleSpeechObjectSelect}/>} />
      <Route path='/library' element={<Library onSpeechObjectSelect={handleSpeechObjectSelect}/>} />
      <Route path='/account' element={<Account />} />
    </Routes>
  )
}

export default Pages