import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import BookDetails from './pages/BookDetails'
import Cart from './pages/Cart'
import UserOrders from './pages/UserOrders'
import './App.css'
import { useAuthContext } from './hooks/useAuthContext'

function App() {
  const { user } = useAuthContext();
  return (
    <div className='App'>
      <BrowserRouter>
        <Navbar />
        <div className='pages'>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/books/:id" element={<BookDetails />} />
            <Route path="/cart" element={user ? <Cart /> : <Navigate to="/login" />} />
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
            <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} />
            <Route path="/orders" element={user ? <UserOrders /> : <Navigate to="/login" />}/>
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  )
}

export default App;