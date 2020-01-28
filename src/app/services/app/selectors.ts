import { RidiSelectState } from 'app/store';
import { AppStatus } from './index';

export const getAppStatus = (state: RidiSelectState): AppStatus => state.app.appStatus;
