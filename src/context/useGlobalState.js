import { useContext } from 'react';
import { GlobalStateContext } from './GlobalStateProvider';

export const useGlobalState = () => {
  return useContext(GlobalStateContext);
};