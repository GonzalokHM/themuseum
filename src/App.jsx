import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import Home from './pages/Home/Home'
import Museum from './pages/Museum/Museum'
import UserProfile from './pages/UserProfile/UserProfile'
import Settings from './pages/Settings/Settings'
import { GlobalStateProvider } from './context/GlobalStateProvider'
import OrientationLock from './components/mobilePositionLock/mobileLock'
import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light')

  useEffect(() => {
    document.body.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])
  return (
    <GlobalStateProvider>
      <Router>
        <OrientationLock />
        <Header theme={theme} setTheme={setTheme} />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/museum' element={<Museum />} />
          <Route path='/profile' element={<UserProfile />} />
          <Route
            path='/settings'
            element={<Settings theme={theme} setTheme={setTheme} />}
          />
        </Routes>
        <Footer theme={theme} />
      </Router>
    </GlobalStateProvider>
  )
}

export default App
