import { AxiosResponse } from 'axios';
import * as qs from 'qs';

import { camelize } from '@ridi/object-case-converter';

import request from 'app/config/axios';
import env from 'app/config/env';
import { Book } from 'app/services/book';
import { CollectionType, CollectionId, COUNT_PER_PAGE } from 'app/services/collection';

export interface CollectionResponse {
  collectionId: number;
  totalCount: number;
  type: CollectionType;
  title: string;
  books: Book[];
}

export interface PopularBooksResponse {
  books: Book[];
  count: number;
}

export const requestCollection = (
  collectionId: CollectionId,
  page: number,
): Promise<CollectionResponse> => {
  const url = `/api/pages/collections/${collectionId}`;
  const queryString = qs.parse(window.location.search, { ignoreQueryPrefix: true });
  if (collectionId === 'spotlight') {
    return request({
      url: '/api/pages/collections/spotlight',
      method: 'GET',
    }).then(
      response => camelize<AxiosResponse<CollectionResponse>>(response, { recursive: true }).data,
    );
  }
  let params = {
    page,
  };
  if (collectionId === 'popular' && queryString.test_group && queryString.test_group.length > 0) {
    params = Object.assign(params, { test_group: queryString.test_group });
  }
  return request({
    url,
    method: 'GET',
    params,
  }).then(
    response => camelize<AxiosResponse<CollectionResponse>>(response, { recursive: true }).data,
  );
};

export const requestPopularBooks = (
  userGroup?: number,
  page?: number,
  countPerPage?: number,
): Promise<PopularBooksResponse> => {
  const paramsArray = [];
  paramsArray.push(userGroup ? `user_group=${userGroup}` : '');
  paramsArray.push(page ? `offset=${page - 1}` : '');
  paramsArray.push(countPerPage ? `limit=${countPerPage}` : '');

  return request({
    url: `${env.BESTSELLER_API}/select/popular/books${
      paramsArray.length > 0 ? `?${paramsArray.join('&')}` : ''
    }`,
    method: 'GET',
    withCredentials: true,
  }).then(
    response => camelize<AxiosResponse<PopularBooksResponse>>(response, { recursive: true }).data,
  );
};
