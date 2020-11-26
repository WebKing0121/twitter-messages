import * as fromMessage from './message';

export interface AppState {
  readonly message: fromMessage.MessageState;
}
