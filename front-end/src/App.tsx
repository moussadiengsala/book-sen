import './App.css'
import { Routes, Route } from "react-router"
import { AuthProvider } from './lib/auth-provider'
import ProfilePage from './pages/Profile'
import NewBookPage from './pages/books/NewBooks'
import EditBookPage from './pages/books/EditBooks'
import BookDetailsPage from './pages/books/BooksDetails'
import BooksPage from './pages/books/Books'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/layout/Layout'
import RegisterPage from './pages/Register'
import LoginPage from './pages/Login'
import HomePage from './pages/Home'
import AdminRoute from "./components/AdminRoute";
import LayoutApp from "./LayoutApp";

function App() {
  return (
      <AuthProvider>
          <Routes>
              <Route
                path="/"
              element={
                  <LayoutApp />
              }>

                {/* Public routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Protected routes */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Layout />
                    </ProtectedRoute>
                  }
                >
                  <Route path="books" element={<BooksPage />} />
                  <Route path="books/:id" element={<BookDetailsPage />} />
                  <Route path="profile" element={<ProfilePage />} />

                  {/* Admin-only routes */}
                    <Route
                        path="books/new"
                        element={
                            <AdminRoute>
                                <NewBookPage />
                            </AdminRoute>
                        }
                    />
                    <Route
                        path="books/:id/edit"
                        element={
                            <AdminRoute>
                                <EditBookPage />
                            </AdminRoute>
                        }
                    />
                </Route>
              </Route>
          </Routes>
      </AuthProvider>
  )
}

export default App
