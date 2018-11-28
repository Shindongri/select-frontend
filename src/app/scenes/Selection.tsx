import * as React from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';

import { ConnectedGridBookList } from 'app/components/GridBookList';
import { ConnectedListWithPagination } from 'app/hocs/ListWithPaginationPage';
import { BookState } from 'app/services/book';
import { DefaultSelectionState } from 'app/services/selection';
import { ActionLoadSelectionRequest, loadSelectionRequest } from 'app/services/selection/actions';
import { RidiSelectState } from 'app/store';
import { ConnectedPageHeader } from 'app/components';
import { GridBookListSkeleton } from 'app/placeholder/BookListPlaceholder';

interface SelectionStateProps {
  books: BookState;
  selection: DefaultSelectionState;
  selectionId: number;
}

interface SelectionDispatchProps {
  dispatchLoadSelection: (selectionId: number, page: number) => ActionLoadSelectionRequest;
}

type RouteProps = RouteComponentProps<{
  selectionId: string;
}>;
type OwnProps = RouteProps;
type Props = SelectionStateProps & SelectionDispatchProps & OwnProps;

interface QueryString {
  page?: number;
}

export class Selection extends React.Component<Props> {
  public render() {
    const { books, selection, selectionId, dispatchLoadSelection } = this.props;
    return (
      <main className="SceneWrapper">
        <Helmet>
          <title>{!!selection ? `${selection.title} - 리디셀렉트` : '리디셀렉트'}</title>
        </Helmet>
        {!!selection && <ConnectedPageHeader pageTitle={selection.title} />}
        <ConnectedListWithPagination
          isFetched={(page) => selection && selection.itemListByPage[page] && selection.itemListByPage[page].isFetched}
          fetch={(page) => dispatchLoadSelection(selectionId, page)}
          itemCount={selection ? selection.itemCount : undefined}
          buildPaginationURL={(p: number) => `/selection/${selectionId}?page=${p}`}
          renderPlaceholder={() => (<GridBookListSkeleton />)}
          renderItems={(page) => (
            <ConnectedGridBookList
              pageTitleForTracking={selection.id.toString()}
              books={selection.itemListByPage[page].itemList.map((id) => books[id].book!)}
            />
          )}
        />
      </main>
    );
  }
}

const mapStateToProps = (rootState: RidiSelectState, ownProps: OwnProps): SelectionStateProps => {
  return {
    books: rootState.booksById,
    selection: rootState.selectionsById[Number(ownProps.match.params.selectionId)],
    selectionId: Number(ownProps.match.params.selectionId),
  };
};
const mapDispatchToProps = (dispatch: any): SelectionDispatchProps => {
  return {
    dispatchLoadSelection: (selectionId: number, page: number) => dispatch(loadSelectionRequest(selectionId, page)),
  };
};
export const ConnectedSelection = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Selection),
);