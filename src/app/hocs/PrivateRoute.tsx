import * as React from 'react';
import { RouteComponentProps, RouteProps, withRouter } from 'react-router';
import { Route } from 'react-router-dom';

import { FetchStatusFlag, RoutePaths } from 'app/constants';

export enum RouteBlockLevel {
  LOGGED_IN,
  SUBSCRIBED,
}

export interface PrivateRouteProps extends RouteProps {
  isRidiApp: boolean;
  isFetching: boolean;
  ticketFetchStatus: FetchStatusFlag;
  isLoggedIn: boolean;
  hasAvailableTicket: boolean;
  routeBlockLevel?: RouteBlockLevel;
}

export const PrivateRoute: React.SFC<PrivateRouteProps & RouteComponentProps> = (props) => {
  const {
    isFetching,
    isLoggedIn,
    ticketFetchStatus,
    hasAvailableTicket,
    routeBlockLevel = RouteBlockLevel.SUBSCRIBED,
    ...restProps
  } = props;

  if (isFetching || ticketFetchStatus === FetchStatusFlag.FETCHING) {
    return <div className="SplashScreen SplashScreen-whiteScreen" />;
  }

  if (
    routeBlockLevel === RouteBlockLevel.LOGGED_IN && !isLoggedIn ||
    routeBlockLevel === RouteBlockLevel.SUBSCRIBED && !hasAvailableTicket
  ) {
    props.history.replace({
      pathname: RoutePaths.HOME,
      search: props.location.search,
    });
    return null;
  }

  return <Route {...restProps} />;
};

export const ConnectedPrivateRoute = withRouter(PrivateRoute);
