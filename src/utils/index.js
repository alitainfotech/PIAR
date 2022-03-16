const TOKEN_KEY = "user-jwt";

export const login = (jwt_token) => {
  localStorage.setItem(TOKEN_KEY, jwt_token);
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const isLogin = () => {
  if (localStorage.getItem(TOKEN_KEY)) {
    return true;
  }

  return false;
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};
