import { useState } from 'react'
import styles from './UserLogin.module.css'
import { useGlobalState } from '../../context/useGlobalState'
import {
  checkPasswordStrength,
  strongPasswordRegex
} from '../../utils/passwordLogin'

const UserLogin = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isRegistering, setIsRegistering] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState('')
  const [passwordRequirements, setPasswordRequirements] = useState([])
  const { dispatch } = useGlobalState()

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value
    setPassword(newPassword)
    const { strength, requirements } = checkPasswordStrength(newPassword)
    setPasswordStrength(strength)
    setPasswordRequirements(requirements)
  }

  const getStrengthClass = () => {
    if (passwordStrength === 'Débil') return styles.strengthWeak
    if (passwordStrength === 'Media') return styles.strengthMedium
    if (passwordStrength === 'Fuerte') return styles.strengthStrong
    return ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')

    if (isRegistering) {
      if (!strongPasswordRegex.test(password)) {
        setErrorMessage('La contraseña debe cumplir con los requisitos.')
        return
      }
      const userData = await registerUser(username, password)
      if (userData) {
        dispatch({ type: 'SET_USER', payload: userData })
      } else {
        setErrorMessage('Error al registrar el usuario.')
      }
    } else {
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
        <div className={styles.passwordContainer}>
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={handlePasswordChange}
            placeholder='Contraseña'
          />
          <img
            src={showPassword ? '/icons/eyeSlash.png' : '/icons/eye.png'}
            alt='Toggle Password Visibility'
            className={styles.passwordToggle}
            onClick={() => setShowPassword(!showPassword)}
          />
        </div>
        {password && (
          <div className={styles.passwordStrengthContainer}>
            <div className={styles.passwordStrengthBar}>
              <div
                className={`${
                  styles.passwordStrengthIndicator
                } ${getStrengthClass()}`}
              ></div>
            </div>
            <p
              className={`${styles.passwordStrengthText} ${getStrengthClass()}`}
            >
              {passwordStrength}
            </p>
            {passwordRequirements.length > 0 && (
              <ul className={styles.passwordRequirements}>
                {passwordRequirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            )}
          </div>
        )}
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

export default UserLogin
