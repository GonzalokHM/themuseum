import { createContext, useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';

const initialState = {
  user: localStorage.getItem('username') || null,
  progress: {},
  currentGame: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      localStorage.setItem('username', action.payload);
      return { ...state, user: action.payload };
    case 'UPDATE_PROGRESS':
      return { ...state, progress: { ...state.progress, ...action.payload } };
    case 'LAUNCH_GAME':
      return { ...state, currentGame: action.payload };
    case 'END_GAME':
      return { ...state, currentGame: null };
    default:
      return state;
  }
};

export const GlobalStateContext = createContext();

export const GlobalStateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (state.user) {
      localStorage.setItem('username', state.user);
    }
  }, [state.user]);

  return (
    <GlobalStateContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

GlobalStateProvider.propTypes = {
  children: PropTypes.node.isRequired,
};