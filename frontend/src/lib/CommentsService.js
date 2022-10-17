import instance from './AxiosInstance';
import { ApiUrls } from '../constants';

const CommentService = {
  create: async (data) => {
    const response = await instance.post(ApiUrls.comment.create, data);
    return response.data;
  },
  delete: (id) => instance.delete(ApiUrls.comment.delete + id),
  all: async (id) => {
    const response = await instance.get(ApiUrls.comment.all + id);
    return response.data;
  },
};

export default CommentService;
