import { Dispatch } from 'react-redux';
import { routerMiddleware, routerReducer, RouterState } from 'react-router-redux';
import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { all } from 'redux-saga/effects';
import * as qs from 'qs';

import history from 'app/config/history';
import { BookState } from 'app/services/book';
import { bookReducer } from 'app/services/book/reducer';
import { bookRootSaga } from 'app/services/book/sagas';
import { CommonUIState } from 'app/services/commonUI';
import { commonUIReducer } from 'app/services/commonUI/reducer';
import { HomeState } from 'app/services/home';
import { homeReducer } from 'app/services/home/reducer';
import { homeRootSaga } from 'app/services/home/sagas';
import { userRootSaga } from 'app/services/user/sagas';

import { CategoryBooksState, CategoryListState } from 'app/services/category';
import { categoryBooksReducer, categoryListReducer } from 'app/services/category/reducer';
import { categoryRootSaga } from 'app/services/category/sagas';
import { MySelectState } from 'app/services/mySelect';
import { mySelectReducer } from 'app/services/mySelect/reducer';
import { mySelectRootSaga } from 'app/services/mySelect/sagas';
import { EnvironmentState, environmentReducer } from 'app/services/environment';
import { reviewsReducer, ReviewsState } from 'app/services/review';
import { reviewRootSaga } from 'app/services/review/sagas';
import { SearchResultState } from 'app/services/searchResult';
import { searchResultReducer } from 'app/services/searchResult/reducer';
import { searchResultRootSaga } from 'app/services/searchResult/sagas';
import { SelectionsState } from 'app/services/selection';
import { selectionReducer } from 'app/services/selection/reducer';
import { selectionsRootSaga } from 'app/services/selection/sagas';
import { trackingSaga } from 'app/services/tracking/sagas';

import { userReducer, UserState } from 'app/services/user';
import { env } from 'app/config/env';
import { downloadSaga } from 'app/services/download/sagas';
import { stateHydrator } from 'app/utils/stateHydrator';
import { CustomHistoryState, customHistoryReducer, customHistorySaga } from 'app/services/customHistory';
import { TrackingState, trackingReducer } from './services/tracking';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
  }
}

function* rootSaga(dispatch: Dispatch<RidiSelectState>) {
  yield all([
    homeRootSaga(),
    bookRootSaga(),
    reviewRootSaga(dispatch),
    userRootSaga(),
    selectionsRootSaga(),
    categoryRootSaga(),
    searchResultRootSaga(),
    mySelectRootSaga(),
    trackingSaga(),
    downloadSaga(),
    customHistorySaga(),
  ]);
}

export interface RidiSelectState {
  router: RouterState;
  user: UserState;
  home: HomeState;
  booksById: BookState;
  selectionsById: SelectionsState;
  commonUI: CommonUIState;
  reviewsByBookId: ReviewsState;
  categories: CategoryListState;
  categoriesById: CategoryBooksState;
  searchResult: SearchResultState;
  mySelect: MySelectState;
  tracking: TrackingState;
  environment: EnvironmentState;
  customHistory: CustomHistoryState;
}

const composeEnhancers = env.development
  ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
  : compose;
const sagaMiddleware = createSagaMiddleware();

export const hasRefreshedForAppDownload = () => !!qs.parse(location.search, { ignoreQueryPrefix: true })['to_app_store']
export const hasCompletedSubscription = () => !!qs.parse(location.search, { ignoreQueryPrefix: true })['new_subscription']

const reducers = combineReducers({
  router: routerReducer,
  user: userReducer,
  home: homeReducer,
  booksById: bookReducer,
  selectionsById: selectionReducer,
  commonUI: commonUIReducer,
  reviewsByBookId: reviewsReducer,
  categories: categoryListReducer,
  categoriesById: categoryBooksReducer,
  searchResult: searchResultReducer,
  mySelect: mySelectReducer,
  tracking: trackingReducer,
  environment: environmentReducer,
  customHistory: customHistoryReducer
});

const enhancers = composeEnhancers(
  applyMiddleware(
    routerMiddleware(history),
    sagaMiddleware,
  ),
);

const savedState = stateHydrator.load();
export const store = hasRefreshedForAppDownload() && savedState
  ? createStore(reducers, savedState, enhancers)
  : createStore(reducers, enhancers);

sagaMiddleware.run(rootSaga, store.dispatch);