import { Link } from 'react-router-dom';
import {useGlobalState} from '../../context/useGlobalState';
import styles from './Header.module.css';

const Header = () => {
  const { state } = useGlobalState();

  return (
    <header className={styles.header}>
      <nav className={styles.navbar}>
        <ul className={styles.navbarList}>
          <li className={styles.navbarItem}>
            <Link to="/" className={styles.navbarLink}>
              Inicio
            </Link>
          </li>
          {state.user && (
            <>
              <li className={styles.navbarItem}>
                <Link to="/museum" className={styles.navbarLink}>
                  Museo Virtual
                </Link>
              </li>
              <li className={styles.navbarItem}>
                <Link to="/profile" className={styles.navbarLink}>
                  Perfil del Usuario
                </Link>
              </li>
              <li className={styles.navbarItem}>
                <Link to="/settings" className={styles.navbarLink}>
                  Configuración
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
