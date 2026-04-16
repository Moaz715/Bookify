import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
import EditBook from './pages/EditBook'
import ManageOrders from './pages/ManageOrders'
import ProtectedRoute from './components/ProtectedRoute'
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

            <Route
              path="/login"
              element={!user ? <Login /> : (user.role === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/" />)}
            />
            <Route
              path="/signup"
              element={!user ? <Signup /> : (user.role === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/" />)}
            />

            <Route path="/cart" element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            } />
            <Route path="/orders" element={
              <ProtectedRoute>
                <UserOrders />
              </ProtectedRoute>
            } />

            <Route path="/admin" element={
              <ProtectedRoute requireAdmin={true}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/books" element={
              <ProtectedRoute requireAdmin={true}>
                <ManageBooks />
              </ProtectedRoute>
            } />
            <Route path="/admin/books/new" element={
              <ProtectedRoute requireAdmin={true}>
                <AddBook />
              </ProtectedRoute>
            } />
            <Route path="/admin/books/edit/:id" element={
              <ProtectedRoute requireAdmin={false}>
                <EditBook />
              </ProtectedRoute>
            } />
            <Route path="/admin/orders" element={
              <ProtectedRoute requireAdmin={true}>
                <ManageOrders />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </BrowserRouter>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        theme="colored"
      />
    </div>
  )
}

export default App;