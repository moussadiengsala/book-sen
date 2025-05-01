import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router"
import { AuthProvider } from './lib/auth-provider'
import ProfilePage from './pages/Profile'
import NewBookPage from './pages/books/NewBooks'
import EditBookPage from './pages/books/EditBooks'
import BookDetailsPage from './pages/books/BooksDetails'
import DashboardPage from './pages/Dashboard'
import BooksPage from './pages/books/Books'
import ProtectedRoute from './components/ProtectedRoute'
import DashboardLayout from './components/layout/Dashboard'
import RegisterPage from './pages/Register'
import LoginPage from './pages/Login'
import HomePage from './pages/Home'


function App() {
  return (
      <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected routes with dashboard layout */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardPage />} />
              <Route path="books" element={<BooksPage />} />
              <Route path="books/:id" element={<BookDetailsPage />} />
              <Route path="books/new" element={<NewBookPage />} />
              <Route path="books/:id/edit" element={<EditBookPage />} />
              <Route path="profile" element={<ProfilePage />} />

              {/* Admin-only routes */}
            </Route>
          </Routes>
      </AuthProvider>
  )
}

export default App
