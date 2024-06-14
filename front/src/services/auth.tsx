import axios from 'axios';
interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export const registerUser = async (data: RegisterData) => {
  const response = await axios.post('/api/auth/register', data);
  return response.data;
};
