import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear token and reset Redux state
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT_USER' });
    localStorage.removeItem('chatid');
    dispatch({type : 'CloseChat'})
    navigate('/login');
  };

  return (
    <button onClick={handleLogout} className="btn btn-danger">
      Logout
    </button>
  );
};

export default Logout;