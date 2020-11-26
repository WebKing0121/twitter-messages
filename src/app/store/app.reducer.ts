import { ActionReducerMap } from '@ngrx/store';

import { AppState } from './app.state';
import * as fromMessage from './message';

export const reducers: ActionReducerMap<AppState> = {
  message: fromMessage.messageReducer
};
