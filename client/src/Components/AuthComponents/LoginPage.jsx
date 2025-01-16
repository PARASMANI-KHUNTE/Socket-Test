import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/userSlice';
// Set the base URL for your API
const BASE_URL = 'http://localhost:5000';


const LoginPage = () => {
    const dispatch = useDispatch();
    const [passwordVisible, setPasswordVisible] = useState(false);
    const navigate = useNavigate();

    const [email , setEmail] = useState("");
    const [password , setPassword] = useState("");
    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent default form submission
     
        try {
            const response = await axios.post(`${BASE_URL}/api/auth/login`,{email,password})
            if (response.status === 200) {
                dispatch(login({ token: response.data.token }));
                alert('Login successful');
                navigate('/home')
              } else {
                console.error('Login failed');
              }
        } catch (error) {
            alert(`Error - ${error}`)
        }
        // Perform your API call or further processing here
    };


    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-2xl font-bold text-blue-600 mb-6">Login</h1>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-80">
                <div className="mb-4">
                    <label className="block text-gray-700">Email</label>
                    <input
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
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
                            onChange={(e)=>setPassword(e.target.value)}
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
                    className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Login
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
                        onClick={() => (window.location.href = "http://localhost:5000/auth/google")}
                    >
                        Google
                    </button>
                    <button
                        className="flex items-center justify-center px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900"
                        onClick={() => console.log('Facebook Login')}
                    >
                        Facebook
                    </button>
                    <button
                        className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        onClick={() => console.log('LinkedIn Login')}
                    >
                        LinkedIn
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
