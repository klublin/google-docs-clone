import React, {useState} from 'react'
import TextEditor from './TextEditor.js'
import FrontPage from './FrontPage.js'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

//NEED THE /HOME THINGY!!

function App() {
  return (
    <Router> 
      <Routes>
        <Route path='/' element={<FrontPage/>}/>
        <Route path='/api/:id' element={<TextEditor/>}/>
      </Routes>
    </Router>
  )
}

export default App;
