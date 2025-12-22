import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'

import App from './App.jsx'
import LogIn from './routes/LogIn.jsx'
import SignUp from './routes/SignUp.jsx'
import Home from './routes/Home.jsx'
import ForgotPassword from './routes/ForgotPassword.jsx'

import './styles/index.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: <LogIn />,
  },
  {
    path: '/register',
    element: <SignUp />,
  },
  {
    path: '/home',
    element: <App />,
    children: [{ path: '/home', element: <Home /> }],
  },
  { path: '/password', element: <ForgotPassword /> },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
