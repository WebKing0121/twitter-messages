import { MessageState } from './message.state';
import { Actions, ActionTypes } from './message.actions';
import { IMessage, Message } from '../../models/message';

const initialState: MessageState = {
  messages: null,
  state: 'close',
  connectionTime: null,
  feed: null,
  analytics: null
};

export function messageReducer(
  state: MessageState = initialState,
  action: Actions
): MessageState {

  switch (action.type) {
    case ActionTypes.OPEN_CONNECTION: {
      return {
        messages: [],
        state: 'open',
        connectionTime: Date.now(),
        feed: {
          hashtag: '',
          results: []
        },
        analytics: {
          tweets: 0,
          countryCodes: []
        }
      };
    }
    case ActionTypes.CLOSE_CONNECTION: {
      return initialState;
    }
    case ActionTypes.NEW_MESSAGE: {
      const { message } = action.payload;
      const { feed, analytics } = updateAnalyticsAndFeedData(state, message);

      return {
        ...state,
        messages: [
          message.toIData(),
          ...state.messages
        ],
        feed,
        analytics
      };
    }
    case ActionTypes.SET_FEED_HASHTAG: {
      const { hashtag } = action.payload;
      const { feed, analytics } = getAnalyticsAndFeedData(state, hashtag);
      return {
        ...state,
        feed,
        analytics
      };
    }
    default: {
      return state;
    }
  }
}


const getAnalyticsAndFeedData = (state: MessageState, hashtag) => {
  const { messages } = state;

  if (!hashtag) {
    const countryCodes = [];
    messages.forEach(item => {
      if (item.place && item.place.country_code && !countryCodes.includes(item.place.country_code)) {
        countryCodes.push(item.place.country_code);
      }
    });

    return {
      feed: {
        hashtag: '',
        results: []
      },
      analytics: {
        tweets: messages.length,
        countryCodes
      }
    };
  } else {
    const countryCodes = [];
    const tweets: IMessage[] = [];

    messages.forEach(item => {
      if (!item.entities.hashtagTexts.includes(hashtag.toLowerCase())) {
        return;
      }

      tweets.push(item);
      if (item.place && item.place.country_code && !countryCodes.includes(item.place.country_code)) {
        countryCodes.push(item.place.country_code);
      }
    });

    return {
      feed: {
        hashtag,
        results: tweets
      },
      analytics: {
        tweets: tweets.length,
        countryCodes
      }
    };
  }
};

const updateAnalyticsAndFeedData = (state: MessageState, message: Message) => {
  const { feed: { hashtag, results }, analytics } = state;
  const matchedFeed = !hashtag || message.includesHashtag(hashtag);
  const countryCode = message.place && message.place.country_code;

  if (!matchedFeed) {
    return {
      feed: {
        hashtag,
        results
      },
      analytics
    };
  }

  const countryCodes = [...analytics.countryCodes];
  if (countryCode && !countryCodes.includes(countryCode)) {
    countryCodes.push(countryCode);
  }
  let tweets = [];
  if (hashtag) {
    tweets = [...results, message.toIData()];
  }

  return {
    feed: {
      hashtag,
      results: tweets
    },
    analytics: {
      tweets: analytics.tweets + 1,
      countryCodes
    }
  };
};
