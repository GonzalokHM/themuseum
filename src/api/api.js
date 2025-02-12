const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  if (!token) return {}
  return { Authorization: `Bearer ${token}` }
}

export const registerUser = async (username, password) => {
  try {
    const response = await fetch('api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })

    const data = await response.json()
    if (response.ok) {
      return data
    } else {
      console.error('Error de registro:', data.error || 'Error desconocido')
      return null
    }
  } catch (error) {
    console.error('Error al registrar usuario:', error)
    return null
  }
}

export const loginUser = async (username, password) => {
  try {
    const response = await fetch('api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    })

    const data = await response.json()
    if (response.ok) {
      localStorage.setItem('token', data.token)
      return data
    } else {
      console.error('Error de login:', data.error || 'Error desconocido')
      return null
    }
  } catch (error) {
    console.error('Error en la solicitud de login:', error)
    return null
  }
}

export const fetchUserProfile = async (username) => {
  if (!username) {
    console.error('❌ Error: Username no definido en fetchUserProfile')
    return null
  }
  try {
    const response = await fetch(`api/users/profile/${username}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      }
    })

    if (!response.ok) {
      throw new Error('No autorizado')
    }

    const userData = await response.json()
    console.log('✅Datos del usuario:', userData)
    return userData
  } catch (error) {
    console.error('❌Error al obtener el perfil:', error)
    return null
  }
}

export const updateUserProfile = async (username, newPassword, email) => {
  try {
    const response = await fetch(`/api/users/profile/${username}/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify({ newPassword, email })
    })

    const data = await response.json()

    if (response.ok) {
      console.log('✅ Perfil actualizado:', data)
      return data
    } else {
      console.error('⚠️ Error al actualizar el perfil:', data.error)
      return null
    }
  } catch (error) {
    console.error('❌ Error en la solicitud de actualización:', error)
    return null
  }
}

export const getGameScores = async (game) => {
  try {
    const response = await fetch(`api/score/${game}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      }
    })

    if (!response.ok) {
      throw new Error('Error obteniendo el ranking')
    }

    const result = await response.json()
    return result
  } catch (error) {
    console.error('Error al obtener los puntajes:', error)
    return null
  }
}

export const updateUserScore = async (game, score) => {
  try {
    const response = await fetch('api/score/update-score', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify({ game, score })
    })

    if (!response.ok) {
      throw new Error('Error al actualizar la puntuación')
    }

    return await response.json()
  } catch (error) {
    console.error('Error al actualizar la puntuación:', error)
    return null
  }
}
