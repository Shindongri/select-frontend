import { all, call, debounce, takeEvery } from 'redux-saga/effects';

import { searchActions } from './index';
import { instantSearchRequest, SearchWhere } from './requests';
import { AppStatus } from '../app';

function* fetchInstantSearch(action: any) {
  const { appStatus, keyword } = action.payload;
  if (keyword.length === 0) return;
  const where = appStatus === AppStatus.Books ? SearchWhere.BOOK : SearchWhere.ARTICLE;
  const searchResult = yield call(instantSearchRequest, where, keyword);
  console.log(keyword, searchResult);
}

export default function* searchRootSaga() {
  yield all([debounce(300, searchActions.instantSearch.type, fetchInstantSearch)]);
}
