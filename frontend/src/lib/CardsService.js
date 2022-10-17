import instance from './AxiosInstance';
import { ApiUrls } from '../constants';

const CardsService = {
  create: async (data) => {
    const response = await instance.post(ApiUrls.card.create, data);
    return response.data;
  },

  edit: async (data) => {
    const response = await instance.post(ApiUrls.card.edit + data.id, data.card);
    return response.data;
  },

  delete: (id) => instance.delete(ApiUrls.card.delete + id),

  move: (from, to, data) => instance.post(`${ApiUrls.card.move + from}/${to}`, data)
};

export default CardsService;
