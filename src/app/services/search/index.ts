import { createActionCreators, createReducerFunction, ImmerReducer } from 'immer-reducer';
import { AppStatus } from '../app';

interface SearchState {
  keyword: string;
}

const searchState: SearchState = {
  keyword: '',
};

interface InstantSearchPayload {
  appStatus: AppStatus;
  keyword: string;
}

export class SearchReducer extends ImmerReducer<SearchState> {
  public instantSearch(payload: InstantSearchPayload) {}
}

export const searchReducer = createReducerFunction(SearchReducer, searchState);
export const searchActions = createActionCreators(SearchReducer);
