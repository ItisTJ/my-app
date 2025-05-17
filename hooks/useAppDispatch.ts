import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../state/store'; // adjust the path if needed

export const useAppDispatch = () => useDispatch<AppDispatch>();
