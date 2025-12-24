import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter } from 'react-router-dom'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import { UserProvider } from './context/UserContext.jsx'

import Public from './routes/Public.jsx'
import Protected from './routes/Protected.jsx'
import Verification from './routes/Verification.jsx'

import App from './App.jsx'
import LogIn from './pages/LogIn.jsx'
import SignUp from './pages/SignUp.jsx'
import Home from './pages/Home.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import VerifyEmail from './pages/VerifyEmail.jsx'
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
      { path: '/password', element: <ForgotPassword /> },
      { path: '/password/reset', element: <ResetPassword /> },
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
    children: [{ path: '/email/verify', element: <VerifyEmail /> }],
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
