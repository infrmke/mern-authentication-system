import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter } from 'react-router-dom'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import { UserProvider } from './context/UserContext.jsx'

import Public from './routes/Public.jsx'
import Protected from './routes/Protected.jsx'
import Verification from './routes/Verification.jsx'
import Password from './routes/Password.jsx'

import App from './App.jsx'
import LogIn from './pages/LogIn.jsx'
import SignUp from './pages/SignUp.jsx'
import Home from './pages/Home.jsx'
import VerifyEmail from './pages/VerifyEmail.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import VerifyPassword from './pages/VerifyPassword.jsx'
import ResetPassword from './pages/ResetPassword.jsx'
import Error from './pages/Error.jsx'

import './styles/index.css'

const router = createBrowserRouter([
  {
    element: <Public />,
    errorElement: <Error />,
    children: [
      { path: '/', element: <LogIn /> },
      { path: '/register', element: <SignUp /> },
      { path: '/forgot-password', element: <ForgotPassword /> },
      { path: '/forgot-password/verify', element: <VerifyPassword /> },
    ],
  },
  {
    element: <Protected />,
    children: [
      {
        path: '/home',
        element: <App />,
        children: [{ index: true, element: <Home /> }],
      },
    ],
  },
  {
    element: <Verification />,
    children: [{ path: '/verify-email', element: <VerifyEmail /> }],
  },
  {
    element: <Password />,
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
