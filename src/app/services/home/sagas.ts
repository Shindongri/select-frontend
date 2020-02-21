import filter from 'lodash-es/filter';

import { Actions as BookActions, Book } from 'app/services/book';

import { Actions as CollectionActions } from 'app/services/collection';
import { CollectionResponse, requestPopularBooks } from 'app/services/collection/requests';
import { Actions } from 'app/services/home';
import { HomeResponse, requestHome } from 'app/services/home/requests';
import { RidiSelectState } from 'app/store';
import showMessageForRequestError from 'app/utils/toastHelper';
import { all, call, put, select, take, takeLatest, takeEvery } from 'redux-saga/effects';
import { getIsIosInApp } from 'app/services/environment/selectors';
import { ErrorStatus } from 'app/constants/index';

export function* watchLoadHome() {
  while (true) {
    yield take(Actions.loadHomeRequest.getType());
    try {
      const response: HomeResponse = yield call(requestHome);
      const collectionsWithoutPopular = filter(
        response.collections,
        collection => collection.collectionId !== 0,
      );
      const responseWithoutPopular = {
        ...response,
        collections: collectionsWithoutPopular,
      };
      const state: RidiSelectState = yield select(s => s);

      // This array might have duplicated book item
      const books = collectionsWithoutPopular.reduce(
        (concatedBooks: Book[], section) => concatedBooks.concat(section.books),
        [],
      );
      yield put(BookActions.updateBooks({ books }));
      const collections = collectionsWithoutPopular.map(
        (section): CollectionResponse => ({
          type: section.type,
          collectionId: section.collectionId,
          title: section.title,
          books: section.books,
          totalCount: 0, // TODO: Ask @minQ
        }),
      );
      yield put(CollectionActions.updateCollections({ collections }));
      yield put(
        Actions.loadHomeSuccess({
          response: responseWithoutPopular,
          fetchedAt: Date.now(),
          isIosInApp: getIsIosInApp(state),
        }),
      );
    } catch (e) {
      const { data } = e.response;
      yield put(Actions.loadHomeFailure());
      if (data && data.status === ErrorStatus.MAINTENANCE) {
        return;
      }
      showMessageForRequestError(e);
    }
  }
}

// export function* loadPopularBooksRequest({
//   payload,
// }: ReturnType<typeof CollectionActions.loadPopularBooksRequest>) {
//   const { userGroup } = payload;
//   try {
//     // const popularBooksResponse = yield call(requestPopularBooks, userGroup);
//   } catch {}
// }

export function* watchLoadPopularBooks() {
  yield takeEvery(CollectionActions.loadPopularBooksRequest, loadPopularBooksRequest);
}

export function* homeRootSaga() {
  yield all([
    watchLoadHome(),
    // watchLoadPopularBooks()
  ]);
}
