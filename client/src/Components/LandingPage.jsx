
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-4xl font-bold text-blue-600">Welcome to ChatApp</h1>
            <p className="text-gray-700 mt-4">Connect with friends and family effortlessly.</p>
            <button
                onClick={() => navigate('/login')}
                className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
            >
                Login
            </button>
        </div>
    );
};

export default LandingPage;
