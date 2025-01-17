
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import LoginPage from './components/AuthComponents/LoginPage';
import SignupPage from './components/AuthComponents/SignupPage';
import ForgotPassword from './components/AuthComponents/ForgotPassword';
import OtpPage from './components/AuthComponents/OtpPage';
import UserProfile from './Components/UserProfile';
import ResetPassword from './components/AuthComponents/ResetPassword';
import Chat from './Components/Chat/Chat';

const App = () => {
    return (
        <Router>
            <div className="bg-gray-100 min-h-screen">
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/otp" element={<OtpPage />} />
                    <Route path="/home" element={<UserProfile />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/Chat" element={<Chat />} />

                </Routes>
            </div>
        </Router>
    );
};

export default App;