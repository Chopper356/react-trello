import instance from './AxiosInstance';
import { ApiUrls } from '../constants';

const ListsService = {
  create: (data) => instance.post(ApiUrls.task.create, data),
  edit: (id, title) => instance.post(ApiUrls.task.edit + id, { title }),
  delete: (id) => instance.delete(ApiUrls.task.delete + id),
};

export default ListsService;
