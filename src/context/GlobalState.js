import { createContext, useReducer, useContext } from 'react';
import PropTypes from 'prop-types';

const initialState = {
  user: null,
  progress: {},
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
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

const GlobalStateContext = createContext();

export const GlobalStateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <GlobalStateContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

GlobalStateProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useGlobalState = () => useContext(GlobalStateContext);
