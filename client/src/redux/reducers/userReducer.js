// redux/reducers/userReducer.js
const initialState = {
    name: '',
    email: '',
    isAuthenticated: false,
  };
  
  const userReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'LOGIN_USER':
        return {
          ...state,
          name: action.payload.name,
          email: action.payload.email,
          isAuthenticated: true,
        };
      case 'LOGOUT_USER':
        return initialState;
      default:
        return state;
    }
  };
  
  export default userReducer;
  