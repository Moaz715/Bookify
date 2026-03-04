import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Signup from './pages/Signup'
import './App.css'

function App() {


  return (
    <div className='App'>
      <BrowserRouter>
        <Navbar />
        <div className=''>
          <Routes>
            <Route path="/" />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  )
}

export default App;
