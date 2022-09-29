import instance from './AxiosInstance';
import { ApiUrls } from '../constants';

const AuthService = {
  signIn: (data) => instance.post(ApiUrls.auth.signin, data),
  signUp: (data) => instance.post(ApiUrls.auth.signup, data),
};

export default AuthService;
