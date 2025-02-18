import { useEffect, useState, useRef } from 'react'
import { fetchUserProfile } from '../../api/api'
import { useGlobalState } from '../../context/useGlobalState'
import { useNavigate } from 'react-router-dom'
import UpdateProfileForm from './updateProfile'
import styles from './UserProfile.module.css'

const UserProfile = () => {
  const { state, dispatch } = useGlobalState()
  const navigate = useNavigate()
  const username = state.user?.username

  const [userData, setUserData] = useState(null)
  const [showEditForm, setShowEditForm] = useState(false)
  const editFormRef = useRef(null)

  useEffect(() => {
    if (showEditForm && editFormRef.current) {
      editFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }, [showEditForm])

  useEffect(() => {
    if (!state.user) {
      console.warn('⚠️ No hay usuario autenticado, redirigiendo a login...')
      navigate('/')
      return
    }
    if (!username) {
      console.error('❌ Error: Username no definido en UserProfile')
      return
    }

    fetchUserProfile(username).then(setUserData)
  }, [username])

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' })
    navigate('/')
  }

  return (
    <div className={styles.profileContainer}>
      {userData ? (
        <>
          <h1>Perfil del Usuario</h1>
          <div className={styles.profileInfo}>
            <p>
              <strong>{userData.username}</strong>
            </p>
            <ul className={styles.scoresList}>
              <li>Puzzle: {userData.scores.puzzle}</li>
              <li>Racer: {userData.scores.racer}</li>
              <li>Shooter: {userData.scores.shooter}</li>
            </ul>
          </div>
          <div className={styles.profileButtons}>
            <button onClick={() => setShowEditForm(!showEditForm)}>
              {showEditForm ? 'Cancelar' : 'Editar Perfil'}
            </button>
            <button onClick={handleLogout}>Cerrar Sesión</button>
          </div>
          {showEditForm && (
            <div ref={editFormRef} className={styles.updateProfileForm}>
              <UpdateProfileForm
                username={username}
                onUpdateSuccess={setUserData}
              />
            </div>
          )}
        </>
      ) : (
        <p>Cargando perfil...</p>
      )}
    </div>
  )
}

export default UserProfile
