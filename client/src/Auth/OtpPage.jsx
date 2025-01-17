import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";


// Set the base URL for your API
const BASE_URL = "https://chat-app-server-zwfu.onrender.com";

const OtpPage = () => {
    const navigate = useNavigate();
    const [otp, setOtp] = useState("");
    const { userId } = useSelector((state) => state.otp); // Use the correct slice name

    const handleSubmitBtn = async (e) => {
        e.preventDefault(); // Fix typo
        try {
            const response = await axios.post(`${BASE_URL}/api/auth/verify-otp`, { userId, otp });
            if (response.status === 200) { // Check response.status
                alert("OTP Verified! Create your new password.");
                navigate("/reset-password");
            }
        } catch (error) {
            alert(`Error: ${error.response?.data?.message || error.message}`); // Improved error handling
        }
    };

    const handleResendOtp = async () => {
        if (!userId) {
            alert("User ID is missing. Please try again.");
            return;
        }
        try {
            const response = await axios.post(`${BASE_URL}/api/auth/resend-otp`, { userId });
            if (response.status === 200) {
                alert("OTP Resent Successfully!");
            }
        } catch (error) {
            alert(`Error: ${error.response?.data?.message || error.message}`);
        }
    };
    

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-2xl font-bold text-blue-600 mb-6">Verify OTP</h1>
            <form onSubmit={handleSubmitBtn} className="bg-white p-6 rounded-lg shadow-md w-80">
                <div className="mb-4">
                    <label className="block text-gray-700">Enter OTP</label>
                    <input
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        type="text"
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="Enter 4-digit OTP"
                        maxLength="4"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Verify
                </button>
                <button
                    type="button"
                    onClick={handleResendOtp} // Resend OTP logic
                    className="w-full mt-2 px-3 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                >
                    Resend OTP
                </button>
            </form>
        </div>
    );
};

export default OtpPage;
