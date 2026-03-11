import { useAuthContext } from './useAuthContext'
import { useCartContext } from './useCartContext'
import { useNavigate } from 'react-router-dom'

export const useLogout = () => {
  const { dispatch: authDispatch } = useAuthContext();
  const { dispatch: cartDispatch } = useCartContext();
  const navigate = useNavigate();

  const logout = () => {
    
    localStorage.removeItem('user')

    authDispatch({ type: 'LOGOUT' });
    cartDispatch({ type: 'CLEAR_CART' });

    navigate("/login");
  }

  return { logout }
}