import Navbar from './components/Navbar'
import { Outlet } from 'react-router'

import './styles/base.css'
import './styles/typography.css'

function App() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  )
}

export default App
