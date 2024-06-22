import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import Museum from './pages/Museum/Museum';
import ArtworkDetail from './pages/ArtWorkDetail/ArtWorkDetail';
import UserProfile from './pages/UserProfile/UserProfile';
import Settings from './pages/Settings/Settings';
import { GlobalStateProvider } from './context/GlobalStateProvider';

function App() {
  return (
    <GlobalStateProvider>
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/museum" element={<Museum/>} />
        <Route path="/artwork/:id" element={<ArtworkDetail/>} />
        <Route path="/profile" element={<UserProfile/>} />
        <Route path="/settings" element={<Settings/>} />
      </Routes>
      <Footer />
    </Router>
    </GlobalStateProvider>
  );
}

export default App;
