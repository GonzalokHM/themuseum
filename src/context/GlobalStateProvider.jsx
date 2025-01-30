import { createContext, useReducer, useEffect } from 'react'
import PropTypes from 'prop-types'

const initialState = {
  user: localStorage.getItem('username') || null,
  token: localStorage.getItem('token') || null,
  progress: {},
  currentGame: null,
  isGameRunning: false,
  completedGames: {
    puzzle: false,
    racer: false,
    shooter: false,
    allGames: false
  }
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      localStorage.setItem('username', action.payload.username)
      localStorage.setItem('token', action.payload.token)
      return {
        ...state,
        user: action.payload.username,
        token: action.payload.token
      }

    case 'LOGOUT':
      localStorage.removeItem('username')
      localStorage.removeItem('token')
      return { ...state, user: null, token: null }

    case 'UPDATE_PROGRESS':
      return { ...state, progress: { ...state.progress, ...action.payload } }
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
      return {
        ...state,
        completedGames: updatedCompletedGames
      }
    }
    default:
      return state
  }
}

export const GlobalStateContext = createContext()

export const GlobalStateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    if (state.user) {
      localStorage.setItem('username', state.user)
      localStorage.setItem('token', state.token)
    }
  }, [state.user])

  return (
    <GlobalStateContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalStateContext.Provider>
  )
}

GlobalStateProvider.propTypes = {
  children: PropTypes.node.isRequired
}
