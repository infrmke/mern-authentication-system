import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter } from 'react-router-dom'
import { RouterProvider } from 'react-router-dom'

import App from './App.jsx'
import LogIn from './routes/LogIn.jsx'
import SignUp from './routes/SignUp.jsx'
import Home from './routes/Home.jsx'
import ForgotPassword from './routes/ForgotPassword.jsx'
import Error from './routes/Error.jsx'

import './styles/index.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: <LogIn />,
    errorElement: <Error />,
  },
  {
    path: '/register',
    element: <SignUp />,
  },
  {
    path: '/home',
    element: <App />,
    children: [{ index: true, element: <Home /> }],
  },
  { path: '/password', element: <ForgotPassword /> },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
