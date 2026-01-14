import Navbar from './components/Navbar'
import { Outlet } from 'react-router'

import './styles/main.scss'

function App() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  )
}

export default App
