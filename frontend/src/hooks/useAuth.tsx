// src/hooks/useAuth.ts
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store'; // Adjust this path based on your project structure

const useAuth = () => {
  const user = useSelector((state: RootState) => state.user);
  
  return { user};
};

export default useAuth;