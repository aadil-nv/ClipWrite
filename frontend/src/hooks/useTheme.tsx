import { useSelector } from 'react-redux';
import { RootState } from '../redux/store'; 

export const useTheme = () => {
  const isActiveMenu = useSelector((state: RootState) => state.theme.activeMenu);
  const themeMode = useSelector((state: RootState) => state.theme.themeMode);
  return { isActiveMenu, themeMode };
};

