import React from 'react'
import TextEditor from './components/TextEditor.js'
import FrontPage from './components/FrontPage.js'
import Home from './components/Home.js'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

//NEED THE /HOME THINGY!!

function App() {
  return (
    <Router> 
      <Routes>
        <Route path='/' element={<FrontPage/>}/>
        <Route path='/edit/:id' element={<TextEditor/>}/>
        <Route path='/home' element={<Home/>}/>
      </Routes>
    </Router>
  )
}

export default App;
