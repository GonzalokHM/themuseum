import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header>
      <nav>
        <ul>
          <li><Link to="/">Inicio</Link></li>
          <li><Link to="/museum">Museo Virtual</Link></li>
          <li><Link to="/profile">Perfil del Usuario</Link></li>
          <li><Link to="/settings">Configuración</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;