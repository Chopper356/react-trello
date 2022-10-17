import instance from './AxiosInstance';
import { ApiUrls } from '../constants';

const BoardsService = {
  getAll: () => instance.get(ApiUrls.board.all),
  getData: (data) => instance.get(ApiUrls.board.data + data.id),
  create: (data) => instance.post(ApiUrls.board.create, data),
  changeMembers: (data) => instance.put(ApiUrls.board.changeMembers + data.id, data.users),
  edit: (data) => instance.post(ApiUrls.board.edit + data.id, data),
  delete: (id) => instance.delete(ApiUrls.board.delete + id)
};

export default BoardsService;
