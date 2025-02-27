export const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  currentGame: null,
  isGameRunning: false,
  completedGames: JSON.parse(localStorage.getItem('completedGames')) || {
    puzzle: false,
    racer: false,
    shooter: false,
    allGames: false
  }
}

export const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      console.log('✅ Guardando usuario en localStorage:', action.payload)
      const user = action.payload.user
      const token = action.payload.token

      localStorage.setItem('user', JSON.stringify(user))
      if (token) {
        localStorage.setItem('token', token)
      }
      return {
        ...state,
        user: user,
        token: token
      }

    case 'LOGOUT':
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      return { ...state, user: null, token: null }

    case 'LAUNCH_GAME':
      return { ...state, currentGame: action.payload }
    case 'END_GAME':
      return {
        ...state,
        isGameRunning: false,
        currentGame: null
      }
    case 'COMPLETE_GAME': {
      const updatedCompletedGames = {
        ...state.completedGames,
        [action.payload]: true
      }
      updatedCompletedGames.allGames = Object.values(
        updatedCompletedGames
      ).every(Boolean)

      localStorage.setItem(
        'completedGames',
        JSON.stringify(updatedCompletedGames)
      )

      return {
        ...state,
        completedGames: updatedCompletedGames
      }
    }
    default:
      return state
  }
}
