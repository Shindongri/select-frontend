import * as React from 'react';

import { ConnectedPageHeader } from 'app/components';
import { ConnectedGridBookList } from 'app/components/GridBookList';
import { ConnectedListWithPagination } from 'app/hocs/ListWithPaginationPage';
import { BookState } from 'app/services/book';
import { ChartSelectionState } from 'app/services/selection';
import { ActionLoadSelectionRequest, loadSelectionRequest } from 'app/services/selection/actions';
import { RidiSelectState } from 'app/store';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { GridBookListSkeleton } from 'app/placeholder/BookListPlaceholder';
import { Helmet } from 'react-helmet';

interface SelectionStateProps {
  selection: ChartSelectionState;
  books: BookState;
}

interface SelectionDispatchProps {
  dispatchLoadNewReleases: (page: number) => ActionLoadSelectionRequest;
}

type RouteProps = RouteComponentProps<{}>;
type OwnProps = RouteProps;
type Props = SelectionStateProps & SelectionDispatchProps & OwnProps;

export class Charts extends React.Component<Props> {
  public render() {
    const { dispatchLoadNewReleases, selection, books } = this.props;
    return (
      <main className="SceneWrapper">
        <Helmet>
          <title>인기 도서 - 리디셀렉트</title>
        </Helmet>
        <ConnectedPageHeader pageTitle="인기 도서" />
        <ConnectedListWithPagination
          isFetched={(page) =>
            selection &&
            selection.itemListByPage[page] &&
            selection.itemListByPage[page].isFetched
          }
          fetch={(page) => dispatchLoadNewReleases(page)}
          itemCount={selection ? selection.itemCount : undefined}
          buildPaginationURL={(page: number) => `/charts?page=${page}`}
          renderPlaceholder={() => (<GridBookListSkeleton displayRanking={true} />)}
          renderItems={(page) => (
            <ConnectedGridBookList
              pageTitleForTracking="popular"
              books={selection.itemListByPage[page].itemList.map((id) => books[id].book!)}
              isChart={true}
              page={page}
            />
          )}
        />
      </main>
    );
  }
}

const mapStateToProps = (rootState: RidiSelectState): SelectionStateProps => {
  return {
    selection: rootState.selectionsById.popular,
    books: rootState.booksById,
  };
};
const mapDispatchToProps = (dispatch: any): SelectionDispatchProps => {
  return {
    dispatchLoadNewReleases: (page: number) => dispatch(loadSelectionRequest('popular', page)),
  };
};
export const ConnectedCharts = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Charts),
);

export default ConnectedCharts;