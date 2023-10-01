import React, { useState } from 'react'
import Home from './Home'
import Library from './Library'
import Account from './Account';
import Login from './Login';
import { Route, Routes, useLocation, } from 'react-router-dom';

function Pages() {
  const location = useLocation();
  const [selectedSpeechObject, setSelectedSpeechObject] = useState(null);

  var userLoginToken = localStorage.getItem('userLoginToken');
  const setUserLoginToken = (token) => {
    localStorage.setItem('userLoginToken', token);
  };

  // Function to handle selecting a speechObject
  const handleSpeechObjectSelect = (speechObject) => {
    setSelectedSpeechObject(speechObject);
  };

  // Function to check if user is logged in
  const verifyLoginToken = async (token) => {
    try {
      const response = await fetch('http://0.0.0.0:8000/users/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.status === 401) {
        console.log("Login Status: Failed.")
        return (false)
      } else if (response.ok) {
        console.log("Login Status: verified");
        const data = await response.json();
        console.log(data)
        return (true)
      }
    } catch (error) {
      console.log("Error:", error);
    }
    return (false)
  }

  // TODO write a redirectIfBadToken function and pass to every route except "/"
  return (
    <Routes location={location} key={location.pathname}>
      <Route path='/' element={<Login loginToken={userLoginToken} setLoginToken={setUserLoginToken} />} />
      <Route path='/home' element={<Home speechObject={selectedSpeechObject} onSpeechObjectSelect={handleSpeechObjectSelect} loginToken={userLoginToken} verifyLoginToken={verifyLoginToken} />} />
      <Route path='/library' element={<Library onSpeechObjectSelect={handleSpeechObjectSelect} loginToken={userLoginToken} verifyLoginToken={verifyLoginToken} />} />
      <Route path='/account' element={<Account />} />
    </Routes>
  )
}

export default Pages