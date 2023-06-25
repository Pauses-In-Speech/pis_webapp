import React from 'react'
import Home from './Home'
import Library from './Library'
import Account from './Account';
import { Route, Routes, useLocation, } from 'react-router-dom';

function Pages() {
  const location = useLocation();
  return (
    <Routes location={location} key={location.pathname}>
      <Route path='/' element={<Home />} />
      <Route path='/library' element={<Library />} />
      <Route path='/account' element={<Account />} />
    </Routes>
  )
}

export default Pages