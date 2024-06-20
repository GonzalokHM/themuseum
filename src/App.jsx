import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Museum from './pages/Museum';
import ArtworkDetail from './pages/ArtWorkDetail';
import UserProfile from './pages/UserProfile';
import Settings from './pages/Settings';
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
