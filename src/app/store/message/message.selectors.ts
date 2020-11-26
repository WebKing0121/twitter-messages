import { createFeatureSelector, createSelector } from '@ngrx/store';

import { AppState } from '../app.state';
import { MessageState } from './message.state';

export const selectState = createFeatureSelector<AppState, MessageState>('message');

export const selectAllMessages = createSelector(
  selectState,
  state => state.messages || []);
export const selectFeed = createSelector(
  selectState,
  state => state.feed
);

export const selectMessagesByHashtagFeed = createSelector(
  selectAllMessages,
  selectFeed,
  (messages, feed) => feed && feed.hashtag ? feed.results : messages
);

export const selectAnalyticsData = createSelector(
  selectState,
  state => {
    const { connectionTime, analytics } = state;
    const minutes = (Date.now() - connectionTime) / (60 * 1000);

    return {
      tweetsPerMinutes: analytics.tweets / minutes,
      countryCodes: analytics.countryCodes
    };
  }
);
