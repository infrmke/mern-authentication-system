import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter } from 'react-router-dom'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import { UserProvider } from './context/UserContext.jsx'

import PublicRoute from './routes/PublicRoute.jsx'
import ProtectedRoute from './routes/ProtectedRoute.jsx'
import VerificationRoute from './routes/VerificationRoute.jsx'
import PasswordGuardRoute from './routes/PasswordGuardRoute.jsx'

import App from './App.jsx'
import LogIn from './pages/LogIn.jsx'
import SignUp from './pages/SignUp.jsx'
import Home from './pages/Home.jsx'
import VerifyEmailOtp from './pages/VerifyEmailOtp.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import VerifyPasswordOtp from './pages/VerifyPasswordOtp.jsx'
import ResetPassword from './pages/ResetPassword.jsx'
import ErrorPage from './pages/ErrorPage.jsx'

const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    errorElement: <ErrorPage />,
    children: [
      { path: '/', element: <LogIn /> },
      { path: '/register', element: <SignUp /> },
      { path: '/forgot-password', element: <ForgotPassword /> },
      { path: '/forgot-password/verify', element: <VerifyPasswordOtp /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/home',
        element: <App />,
        children: [{ index: true, element: <Home /> }],
      },
    ],
  },
  {
    element: <VerificationRoute />,
    children: [{ path: '/verify-email', element: <VerifyEmailOtp /> }],
  },
  {
    element: <PasswordGuardRoute />,
    children: [{ path: '/forgot-password/reset', element: <ResetPassword /> }],
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <Toaster />
      <RouterProvider router={router} />
    </UserProvider>
  </StrictMode>
)
