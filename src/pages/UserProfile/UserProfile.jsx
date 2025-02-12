import { useEffect, useState } from 'react'
import { fetchUserProfile } from '../../api/api'
import { useGlobalState } from '../../context/useGlobalState'
import { useNavigate } from 'react-router-dom'
import UpdateProfileForm from './updateProfile'

const UserProfile = () => {
  const { state, dispatch } = useGlobalState()
  const navigate = useNavigate()
  const username = state.user?.username

  const [userData, setUserData] = useState(null)
  const [showEditForm, setShowEditForm] = useState(false)

  useEffect(() => {
    console.log('🏠 Estado actual de usuario en UserProfile:', state.user)
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
    <div>
      {userData ? (
        <div>
          <h1>Perfil del Usuario</h1>
          <p>Nombre: {userData.username}</p>
          <p>Puntuaciones:</p>
          <ul>
            <li>Puzzle: {userData.scores.puzzle}</li>
            <li>Racer: {userData.scores.racer}</li>
            <li>Shooter: {userData.scores.shooter}</li>
          </ul>
          <button onClick={() => setShowEditForm(!showEditForm)}>
            {showEditForm ? 'Cancelar' : 'Editar Perfil'}
          </button>
          {showEditForm && (
            <UpdateProfileForm
              username={username}
              onUpdateSuccess={setUserData}
            />
          )}
          <button onClick={handleLogout}>Cerrar Sesión</button>
        </div>
      ) : (
        <p>Cargando perfil...</p>
      )}
    </div>
  )
}

export default UserProfile
