import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import BookDetails from './pages/BookDetails'
import Cart from './pages/Cart'
import UserOrders from './pages/UserOrders'
import AdminDashboard from './pages/AdminDashboard'
import ManageBooks from './pages/ManageBooks'
import AddBook from './pages/AddBook'
import './App.css'
import { useAuthContext } from './hooks/useAuthContext'
import EditBook from './pages/EditBook'
import ManageOrders from './pages/ManageOrders'

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
            <Route
              path="/login"
              element={!user ? <Login /> : (user.role === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/" />)}
            />
            <Route
              path="/signup"
              element={!user ? <Signup /> : (user.role === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/" />)}
            />
            <Route path="/cart" element={user ? <Cart /> : <Navigate to="/login" />} />
            <Route path="/orders" element={user ? <UserOrders /> : <Navigate to="/login" />} />
            <Route
              path="/admin"
              element={user && user.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />} />
            <Route
              path="/admin/books"
              element={user && user.role === 'admin' ? <ManageBooks /> : <Navigate to="/login" />} />
            <Route
              path="/admin/books/new"
              element={user && user.role === 'admin' ? <AddBook /> : <Navigate to="/login" />} />
            <Route
              path="/admin/books/edit/:id"
              element={user && user.role === 'admin' ? <EditBook /> : <Navigate to="/login" />} />
            <Route
              path="/admin/orders"
              element={user && user.role === 'admin' ? <ManageOrders /> : <Navigate to="/login" />}
            />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  )
}

export default App;