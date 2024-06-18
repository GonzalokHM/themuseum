import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './pages/Home';
import Museum from './pages/Museum';
import ArtworkDetail from './pages/ArtWorkDetail';
import UserProfile from './pages/UserProfile';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/museum" component={Museum} />
        <Route path="/artwork/:id" component={ArtworkDetail} />
        <Route path="/profile" component={UserProfile} />
        <Route path="/settings" component={Settings} />
      </Switch>
    </Router>
  );
}

export default App;
