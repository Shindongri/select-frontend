import { createAction, createReducer } from 'redux-act';

import { FetchErrorFlag, FetchStatusFlag } from 'app/constants';
import { CollectionResponse } from 'app/services/collection/requests';
import { BookId, Paginated } from 'app/types';
import { AxiosError } from 'axios';
import { Book } from 'app/services/book';

export enum CollectionType {
  'SELECTION' = 'SELECTION',
  'CHART' = 'CHART',
  'SPOTLIGHT' = 'SPOTLIGHT',
}

export const COUNT_PER_PAGE = 24;

export type ReservedCollectionIds = 'popular' | 'recent' | 'spotlight';
export type CollectionId = number | ReservedCollectionIds;

export enum ChartSortingCrietria {
  default,
}

export interface CollectionState {
  title?: string;
  type?: CollectionType;
}

export interface DefaultCollectionState extends Paginated<BookId>, CollectionState {
  id: number;
}

export interface ReservedCollectionState extends Paginated<BookId>, CollectionState {
  id: ReservedCollectionIds;
}

export interface ChartCollectionState extends ReservedCollectionState {
  alias?: string;
  sortBy?: ChartSortingCrietria;
}

export interface SpotlightCollectionState extends Paginated<BookId>, CollectionState {
  id: ReservedCollectionIds;
}

export interface CollectionsState {
  [collectionId: number]: DefaultCollectionState;
  recent: ReservedCollectionState;
  popular: ChartCollectionState;
  spotlight: SpotlightCollectionState;
}

export const Actions = {
  updateCollections: createAction<{
    collections: CollectionResponse[];
  }>('updateCollections'),

  updateSpotlight: createAction<{
    spotlight: CollectionResponse;
  }>('updateSpotlight'),

  loadCollectionRequest: createAction<{
    collectionId: CollectionId;
    page: number;
  }>('loadCollectionRequest'),

  loadCollectionSuccess: createAction<{
    collectionId: CollectionId;
    page: number;
    response: CollectionResponse;
  }>('loadCollectionSuccess'),

  loadCollectionFailure: createAction<{
    collectionId: CollectionId;
    page: number;
    error: AxiosError;
  }>('loadCollectionSuccess'),
  loadPopularBooksRequest: createAction<{
    userGroup?: number;
    page?: number;
  }>('loadPopularBooksRequest'),
  afterLoadPopularBooks: createAction<{
    books?: Book[];
    page?: number;
    count?: number;
  }>('afterLoadPopularBooks'),
};

export const INITIAL_STATE: CollectionsState = {
  popular: {
    id: 'popular',
    itemListByPage: {},
  },
  recent: {
    id: 'recent',
    itemListByPage: {},
  },
  spotlight: {
    id: 'spotlight',
    itemListByPage: {},
  },
};

export const collectionReducer = createReducer<CollectionsState>({}, INITIAL_STATE);

collectionReducer.on(Actions.updateCollections, (state = INITIAL_STATE, { collections = [] }) =>
  collections.reduce((prev, collection) => {
    // Don't need to update data if data exists
    const { collectionId } = collection;
    if (state[collectionId]) {
      prev[collectionId] = state[collectionId];
    } else {
      prev[collectionId] = {
        ...state[collectionId],
        id: collectionId,
        itemCount: collection.totalCount, // TODO: Ask to @minq if we can get this number in home response
        itemListByPage: {
          1: {
            fetchStatus: FetchStatusFlag.IDLE,
            itemList: collection.books.map(book => book.id),
            isFetched: false,
          },
        },
        pageCount: 0,
        title: collection.title,
        type: collection.type,
      };
    }
    return prev;
  }, state),
);

collectionReducer.on(Actions.updateSpotlight, (state = INITIAL_STATE, { spotlight }) => ({
  ...state,
  spotlight: {
    ...state.spotlight,
    itemListByPage: {
      1: {
        fetchStatus: FetchStatusFlag.IDLE,
        itemList: spotlight.books.map(book => book.id),
        isFetched: false,
      },
    },
    pageCount: 0,
    title: spotlight.title,
    type: spotlight.type,
  },
}));

collectionReducer.on(
  Actions.loadCollectionRequest,
  (state = INITIAL_STATE, { page, collectionId }) => ({
    ...state,
    [collectionId]: {
      ...state[collectionId],
      id: collectionId,
      itemCount: 0,
      itemListByPage: {
        ...(state[collectionId] && state[collectionId].itemListByPage),
        [page]: {
          fetchStatus: FetchStatusFlag.FETCHING,
          itemList: [],
          isFetched: false,
        },
      },
    },
  }),
);

collectionReducer.on(
  Actions.loadCollectionSuccess,
  (state = INITIAL_STATE, { page, collectionId, response }) => ({
    ...state,
    [collectionId]: {
      ...state[collectionId],
      itemListByPage: {
        ...state[collectionId].itemListByPage,
        [page]: {
          fetchStatus: FetchStatusFlag.IDLE,
          itemList: response.books.map(book => book.id),
          isFetched: true,
        },
      },
      title: response.title,
      id: response.collectionId,
      itemCount: response.totalCount,
      type: response.type,
    },
  }),
);

collectionReducer.on(
  Actions.loadCollectionFailure,
  (state = INITIAL_STATE, { collectionId, page }) => ({
    ...state,
    [collectionId]: {
      ...state[collectionId],
      itemListByPage: {
        ...state[collectionId].itemListByPage,
        [page]: {
          fetchStatus: FetchStatusFlag.FETCH_ERROR,
          itemList: [],
          isFetched: false,
        },
      },
    },
  }),
);

collectionReducer.on(Actions.loadPopularBooksRequest, (state = INITIAL_STATE, { page = 1 }) => ({
  ...state,
  poupular: {
    ...state.popular,
    id: 'popular',
    itemListByPage: {
      ...(state.popular && state.popular.itemListByPage),
      [page]: {
        fetchStatus: FetchStatusFlag.FETCHING,
        itemList: [],
        isFetched: false,
      },
    },
  },
}));

collectionReducer.on(
  Actions.afterLoadPopularBooks,
  (state = INITIAL_STATE, { page = 1, books, count = 0 }) => ({
    ...state,
    popular: {
      ...state.popular,
      itemListByPage: {
        ...state.popular.itemListByPage,
        [page]: {
          fetchStatus: books ? FetchStatusFlag.IDLE : FetchStatusFlag.FETCH_ERROR,
          itemList: books ? books.map(book => book.id) : [],
          isFetched: false,
        },
      },
      title: '인기 도서',
      id: 'popular',
      itemCount: count,
      type: CollectionType.CHART,
    },
  }),
);
