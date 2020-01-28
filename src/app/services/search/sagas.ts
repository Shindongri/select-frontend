import { all, call, takeEvery } from 'redux-saga/effects';

import { searchActions } from './index';

export function changeKeyword(action: any) {
  console.log(action.payload);
}

export default function* searchRootSaga() {
  yield all([
    takeEvery(searchActions.changeKeyword.type, changeKeyword),
  ]);
}
