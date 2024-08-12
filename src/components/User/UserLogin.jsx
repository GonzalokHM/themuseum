import { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './UserLogin.module.css';

const UserLogin = ({ onLogin }) => {
  const [username, setUsername] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      localStorage.setItem('username', username);
      onLogin(username);
    }
  };

  return (
    <div className={styles.login}>
      <h2>Introduce tu nombre</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Nombre de usuario"
        />
        <button type="submit">Empezar</button>
      </form>
    </div>
  );
};

UserLogin.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default UserLogin;
