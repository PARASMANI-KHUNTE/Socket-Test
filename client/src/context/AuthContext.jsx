import { createContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem("token"));
  const [username, setUsername] = useState(localStorage.getItem("username"));

  const login = (token, username) => {
    setAuthToken(token);
    setUsername(username);
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
  };

  const logout = () => {
    setAuthToken(null);
    setUsername(null);
    localStorage.removeItem("token");
    localStorage.removeItem("username");
  };

  return (
    <AuthContext.Provider value={{ authToken, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
