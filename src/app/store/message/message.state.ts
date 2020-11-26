import { IMessage } from '../../models/message';

export interface MessageState {
  messages: IMessage[];
  state: 'open' | 'close';
  connectionTime: number;
  feed: {
    hashtag: string;
    results: IMessage[];
  };
  analytics: {
    tweets: number;
    countryCodes: string[];
  };
}
