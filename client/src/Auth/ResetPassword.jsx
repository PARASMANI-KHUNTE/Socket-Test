import { useState } from 'react';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
// Set the base URL for your API
const BASE_URL = 'https://chat-app-server-zwfu.onrender.com';


const ResetPassword = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const { userId} = useSelector((state) => state.otp);
    const [password , setpassword] = useState('');
    const navigate = useNavigate();
    const handelSignupBtn = async (e) =>{
        e.preventDefault()
        try {
           
            const response =await axios.put(`${BASE_URL}/api/auth/update-password`,{userId,password})
            if(response.status === 200){
                alert(`${response.data.message}`)
                navigate('/login') 
            }else{
                alert(`${response.data.message}`)
            }

        } catch (error) {
            alert(`Error - ${error}`)
        }
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-2xl font-bold text-blue-600 mb-6">Reset password</h1>
            <form onSubmit={handelSignupBtn} className="bg-white p-6 rounded-lg shadow-md w-80">
               
               
               
                <div className="mb-4">
                    <label className="block text-gray-700">Password</label>
                    <div className="relative">
                        <input
                        value={password}
                        onChange={(e)=>setpassword(e.target.value)}
                            type={passwordVisible ? 'text' : 'password'}
                            className="w-full px-3 py-2 border rounded-lg"
                            placeholder="Password"
                            pattern="(?=.*\d)(?=.*[A-Z]).{8,12}"
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
                <div className="mb-4">
                    <label className="block text-gray-700">Confirm Password</label>
                    <div className="relative">
                        <input
                            type={confirmPasswordVisible ? 'text' : 'password'}
                            className="w-full px-3 py-2 border rounded-lg"
                            placeholder="Confirm Password"
                            required
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-3 text-gray-500"
                            onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                        >
                            {confirmPasswordVisible ? 'Hide' : 'Show'}
                        </button>
                    </div>
                </div>
                <button
                    type="submit"
                    className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Update Password
                </button>
            </form>
            
        </div>
    );
};

export default ResetPassword;
