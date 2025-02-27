import { createContext, useReducer, useEffect } from 'react'
import PropTypes from 'prop-types'
import { initialState, reducer } from '../reducer/globalReducer'

export const GlobalStateContext = createContext()

export const GlobalStateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    const storedToken = localStorage.getItem('token')

    if (storedUser && storedToken) {
      dispatch({
        type: 'SET_USER',
        payload: { user: JSON.parse(storedUser), token: storedToken }
      })
    }
  }, [])

  return (
    <GlobalStateContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalStateContext.Provider>
  )
}

GlobalStateProvider.propTypes = {
  children: PropTypes.node.isRequired
}
