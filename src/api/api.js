const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  if (!token) return {}
  return { Authorization: `Bearer ${token}` }
}

const fetchWithAuth = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      }
    })

    if (response.status === 401 || response.status === 403) {
      console.warn('🔒 Token inválido, cerrando sesión...')
      localStorage.clear()
      window.location.href = '/'
      return { error: 'Sesión expirada. Redirigiendo a Home...' }
    }

    if (!response.ok) {
      const errorData = await response.json()
      return { error: errorData.message || 'Error desconocido en la API' }
    }

    return await response.json()
  } catch (error) {
    console.error('❌ Error en la API:', error)
    return {
      error: 'No se pudo conectar con el servidor. Verifica tu conexión.'
    }
  }
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
    const response = await fetchWithAuth(`api/users/profile/${username}`, {
      method: 'GET'
    })
    if (response.error) {
      console.error('❌ Error al obtener el perfil:', response.error)
      return null
    }

    return response
  } catch (error) {
    console.error('❌Error al obtener el perfil:', error)
    return null
  }
}

export const updateUserProfile = async (username, newPassword, email) => {
  try {
    const response = await fetchWithAuth(
      `/api/users/profile/${username}/update`,
      {
        method: 'PUT',
        body: JSON.stringify({ newPassword, email })
      }
    )

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
    const response = await fetchWithAuth(`api/score/${game}`, {
      method: 'GET'
    })

    if (response.error) {
      console.error('❌ Error al obtener los puntajes:', response.error)
      return null
    }

    return response
  } catch (error) {
    console.error('Error al obtener los puntajes:', error)
    return null
  }
}

export const updateUserScore = async (game, score) => {
  try {
    const response = await fetchWithAuth('api/score/update', {
      method: 'PUT',
      body: JSON.stringify({ game, score })
    })

    if (response.error) {
      throw new Error('Error al actualizar la puntuación')
    }

    return response
  } catch (error) {
    console.error('Error al actualizar la puntuación:', error)
    return null
  }
}
