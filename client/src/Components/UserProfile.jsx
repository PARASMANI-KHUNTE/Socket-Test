import Logout from '../components/AuthComponents/Logout';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './Navbar';
const UserProfile = () => {
    const navigate = useNavigate()
  const { name, email, isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  return (
    <>
    <Navbar />
    <div className=' flex justify-center'>
      <div className='flex justify-between w-full p-4 border     gap-3'>
     <div>
     <img src="https://i.pinimg.com/736x/c3/a9/5b/c3a95b0899ad71ef8e39e4d574230d36.jpg" width={80} className='rounded-3xl' alt="" />
      <h1 className='font-bold'>Welcome, <span className='text-blue-500'>{name}</span></h1>
      <p className='font-bold'>Email: <span className='text-blue-500'>{email}</span> </p>
     </div>
      < Logout />
    </div>
    </div>
    
    </>
   
  );
};

export default UserProfile;
