const API_URL = 'https://backmuseumapi.onrender.com/api'

const getAuthHeaders = () => {
  const { state } = useGlobalState()
  if (!state.token) return {}
  return { Authorization: `Bearer ${state.token}` }
}

export const registerUser = async (username, password) => {
  try {
    const response = await fetch(`${API_URL}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })

    const data = await response.json()
    if (response.ok) {
      return data
    } else {
      throw new Error(data.message)
    }
  } catch (error) {
    console.error('Error al registrar usuario:', error)
    return null
  }
}

export const loginUser = async (username, password) => {
  try {
    const response = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    })

    const data = await response.json()
    if (response.ok) {
      console.log('Login exitoso:', data)
      return data
    } else {
      console.error('Error de login:', data.message)
      throw new Error(data.message)
    }
  } catch (error) {
    console.error('Error en la solicitud de login:', error)
  }
}

export const fetchUserProfile = async () => {
  const { state } = useGlobalState()
  const username = state.user

  try {
    const response = await fetch(`${API_URL}/users/profile/${username}`, {
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
    console.log('Datos del usuario:', userData)
  } catch (error) {
    console.error('Error al obtener el perfil:', error)
  }
}

export const getGameScores = async (game) => {
  try {
    const response = await fetch(`${API_URL}/users/score/${game}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      }
    })

    if (!response.ok) {
      throw new Error('Error obteniendo el ranking')
    }

    return await response.json()
  } catch (error) {
    console.error('Error al obtener los puntajes:', error)
    return null
  }
}

export const updateUserScore = async (game, score) => {
  try {
    const response = await fetch(`${API_URL}/users/update-score`, {
      method: 'POST',
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
