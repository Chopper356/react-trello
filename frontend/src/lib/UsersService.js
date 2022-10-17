import instance from './AxiosInstance';
import { ApiUrls } from '../constants';

const UsersService = {
  search: (data) => instance.post(ApiUrls.profile.search, { name: data }),
};

export default UsersService;
