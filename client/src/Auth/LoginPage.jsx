import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { login } from '../redux/userSlice';
import { ToastContainer, toast } from 'react-toastify';
import {jwtDecode} from 'jwt-decode';
// Set the base URL for your API
const BASE_URL = 'https://chat-app-server-zwfu.onrender.com';

const LoginPage = () => {
    const dispatch = useDispatch();
    const [passwordVisible, setPasswordVisible] = useState(false);
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent default form submission
        setLoading(true); // Set loading state to true during API call
      
        try {
          const response = await axios.post(`${BASE_URL}/api/auth/login`, { email, password });
      
          if (response.status === 200) {
            const LogToken = response.data.token
            if (LogToken) {
                const decoded = jwtDecode(LogToken);
                // Dispatch login with just the token
                dispatch(
                  login({
                    id : decoded.payload.id,
                    name : decoded.payload.name,
                    email : decoded.payload.email,
                    token: LogToken,
                  })
                );
               // Optionally save token in localStorage
              } else {
                navigate("/login");
              } // Store token locally
      
            toast('Login successful');
            navigate('/home'); // Navigate to home page
          }
        } catch (error) {
          toast.error('Login failed:', error);
          toast(`Error: ${error.response?.data?.message || 'Login failed'}`);
        } finally {
          setLoading(false); // Reset loading state
        }
      };
      



    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-2xl font-bold text-blue-600 mb-6">Login</h1>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-80">
                <div className="mb-4">
                    <label className="block text-gray-700">Email</label>
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="Enter your email"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Password</label>
                    <div className="relative">
                        <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type={passwordVisible ? 'text' : 'password'}
                            className="w-full px-3 py-2 border rounded-lg"
                            placeholder="Enter your password"
                            required
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-3 text-gray-500"
                            onClick={() => setPasswordVisible(!passwordVisible)}
                        >
                            {passwordVisible ? 'Hide' : 'Show'}
                        </button>
                    </div>
                </div>
                <button
                    type="submit"
                    className={`w-full px-3 py-2 text-white rounded-lg ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                    disabled={loading}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
                <div className="flex justify-between mt-4">
                    <button
                        type="button"
                        className="text-blue-600"
                        onClick={() => navigate('/forgot-password')}
                    >
                        Forgot Password
                    </button>
                    <button
                        type="button"
                        className="text-blue-600"
                        onClick={() => navigate('/signup')}
                    >
                        New? Signup
                    </button>
                </div>
            </form>
            <div className="mt-6">
                <p className="text-gray-700 mb-2">Or continue with:</p>
                <div className="flex space-x-4">
                    <button
                        className="flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        onClick={()=>(window.location.href="https://chat-app-server-zwfu.onrender.com/api/social/auth/google")}
                    >
                        Google
                    </button>
                    <button
                        className="flex items-center justify-center px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                        onClick={() => toast('Facebook coming soon')}
                    >
                        Facebook
                    </button>
                    <button
                        className="flex items-center justify-center px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                        onClick={() => toast('LinkedIn coming soon')}
                    >
                        LinkedIn
                    </button>
                </div>
            </div>
            <ToastContainer />

        </div>
    );
};

export default LoginPage;
