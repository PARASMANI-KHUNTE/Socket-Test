
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './Pages/LandingPage';
import LoginPage from './Auth/LoginPage';
import SignupPage from './Auth/SignupPage';
import ForgotPassword from './Auth/ForgotPassword';
import OtpPage from './Auth/OtpPage';
import UserProfile from './Pages/UserProfile';
import ResetPassword from './Auth/ResetPassword';

import Chat from './Chat/Chat';


const App = () => {
  // const senderId = "67894541f2efa83260bc6247";
  // const receiverId = "6789457df2efa83260bc624b";

  return (
    <>
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
  
    {/* <div className="flex gap-4 justify-center p-4">
       <ChatRoom senderId={senderId} receiverId={receiverId} />
      <ChatRoom senderId={receiverId} receiverId={senderId} />
    </div> */}
     
    </>
  );
};

export default App;
