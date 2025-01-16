// redux/actions/userActions.js
export const loginUser = (user) => {
    return {
      type: 'LOGIN_USER',
      payload: user,
    };
  };
  