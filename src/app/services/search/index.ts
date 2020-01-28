import { createActionCreators, createReducerFunction, ImmerReducer } from 'immer-reducer';

interface SearchState {
  keyword: string;
}

const searchState: SearchState = {
  keyword: '',
};

export class SearchReducer extends ImmerReducer<SearchState> {
  public changeKeyword(keyword: string) {}
}

export const searchReducer = createReducerFunction(SearchReducer, searchState);
export const searchActions = createActionCreators(SearchReducer);
