import { Action } from '@ngrx/store';
import { Message } from '../../models/message';

export enum ActionTypes {
  OPEN_CONNECTION = '[Message] Open Connection',
  CLOSE_CONNECTION = '[Message] Close Connection',
  NEW_MESSAGE = '[Message] New Message',
  SET_FEED_HASHTAG = '[Message] Set Feed Hashtag'
}

export class OpenConnection implements Action {
  readonly type = ActionTypes.OPEN_CONNECTION;
}
export class CloseConnection implements Action {
  readonly type = ActionTypes.CLOSE_CONNECTION;
}

export class NewMessage implements Action {
  readonly type = ActionTypes.NEW_MESSAGE;
  constructor(public payload: {
    message: Message
  }) {}
}

export class FilterByHashtag implements Action {
  readonly type = ActionTypes.SET_FEED_HASHTAG;
  constructor(public payload: {
    hashtag: string
  }) {}
}

export type Actions = OpenConnection | CloseConnection | NewMessage
  | FilterByHashtag;
