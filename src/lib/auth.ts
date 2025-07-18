export interface User {
  id: string;
  username: string;
  email: string;
}

export const setAuthToken = (token: string) => {
  localStorage.setItem('auth_token', token);
  console.log('Token set in localStorage:', token);
};

export const removeAuthToken = () => {
  localStorage.removeItem('auth_token');
  console.log('Token removed from localStorage');
};

export const isAuthenticated = () => {
  const token = localStorage.getItem('auth_token');
  console.log('isAuthenticated - Token exists:', !!token);
  return !!token;
};