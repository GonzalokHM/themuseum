import { useState } from 'react'
import PropTypes from 'prop-types'
import styles from './UserLogin.module.css'

const UserLogin = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isRegistering, setIsRegistering] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const { dispatch } = useGlobalState()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')

    if (isRegistering) {
      // Registro de usuario
      const result = await registerUser(username, password)
      if (result) {
        alert('Usuario registrado correctamente. Ahora inicia sesión.')
        setIsRegistering(false)
      } else {
        setErrorMessage('Error al registrar el usuario.')
      }
    } else {
      // Login de usuario
      const userData = await loginUser(username, password)
      if (userData) {
        dispatch({ type: 'SET_USER', payload: userData })
      } else {
        setErrorMessage('Error al iniciar sesión. Verifica tus credenciales.')
      }
    }
  }

  return (
    <div className={styles.login}>
      <h2>{isRegistering ? 'Regístrate' : 'Iniciar Sesión'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder='Nombre de usuario'
        />
        <input
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder='Contraseña'
        />
        <button type='submit'>
          {isRegistering ? 'Registrarse' : 'Iniciar Sesión'}
        </button>
      </form>
      {errorMessage && <p className={styles.error}>{errorMessage}</p>}
      <button onClick={() => setIsRegistering(!isRegistering)}>
        {isRegistering
          ? '¿Ya tienes una cuenta? Inicia sesión'
          : '¿No tienes cuenta? Regístrate'}
      </button>
    </div>
  )
}

UserLogin.propTypes = {
  onLogin: PropTypes.func.isRequired
}

export default UserLogin
