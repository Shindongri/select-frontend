import { AxiosError, AxiosResponse } from 'axios';

import request from 'app/config/axios';
import env from 'app/config/env';

export enum SearchWhere {
  BOOK = 'book',
  ARTICLE = 'article',
}

export const instantSearchRequest = (where: SearchWhere, keyword: string) => {
  const params = {
    site: 'ridi-select',
    what: 'instant',
    where,
    keyword,
  };
  return request({
    baseURL: env.SEARCH_API,
    method: 'get',
    url: '/search',
    withCredentials: false,
    params,
  })
    .then((response: AxiosResponse) => response.data)
    .catch((err: AxiosError) => {
      console.error(err);
      return null;
    });
};
