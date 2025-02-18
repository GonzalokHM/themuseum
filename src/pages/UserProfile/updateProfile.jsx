import { useState } from 'react'
import { updateUserProfile } from '../../api/api'
import styles from './UserProfile.module.css'

const UpdateProfileForm = ({ username, onUpdateSuccess }) => {
  const [newPassword, setNewPassword] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleUpdateProfile = async () => {
    setLoading(true)
    setMessage('')

    const updatedData = await updateUserProfile(
      username,
      newPassword || null,
      email || null
    )

    if (updatedData) {
      setMessage('✅ Perfil actualizado correctamente')
      onUpdateSuccess(updatedData)
    } else {
      setMessage('❌ Error al actualizar el perfil')
    }

    setLoading(false)
  }

  return (
    <div className={styles.updateProfileForm}>
      <h2>Actualizar Perfil</h2>
      <label>
        Nueva Contraseña:
        <input
          type='password'
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </label>
      <label>
        Nuevo Email:
        <input
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <button onClick={handleUpdateProfile} disabled={loading}>
        {loading ? 'Actualizando...' : 'Actualizar'}
      </button>
      {message && <p>{message}</p>}
    </div>
  )
}

export default UpdateProfileForm
