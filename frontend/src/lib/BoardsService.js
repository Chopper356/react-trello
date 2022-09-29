import instance from './AxiosInstance';
import { ApiUrls } from '../constants';

const BoardsService = {
  getAll: () => instance.get(ApiUrls.board.all),
};

export default BoardsService;
