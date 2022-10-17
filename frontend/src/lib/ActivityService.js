import instance from './AxiosInstance';
import { ApiUrls } from '../constants';

const CardsService = {
  create: (data) => instance.post(ApiUrls.activity.create, data)
    .then((response) => response.data),

  boardActivity: (id) => instance.get(ApiUrls.activity.board + id)
    .then((response) => response.data),

  cardActivity: (boardId, cardId) => instance.get(`${ApiUrls.activity.card}${boardId}/card/${cardId}`)
    .then((response) => response.data)
};

export default CardsService;
