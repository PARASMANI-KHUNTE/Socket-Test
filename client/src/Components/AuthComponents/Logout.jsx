import { useDispatch } from 'react-redux';
import { logout } from '../../redux/userSlice';

const Logout = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return <button className='h-10 rounded border w-20 bg-red-400 text-white p-2 hover:bg-red-500 hover:shadow-md transition' onClick={handleLogout}>Logout</button>;
};

export default Logout;
