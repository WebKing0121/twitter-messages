import { IHashtag, IPlace, IUSer } from './common';

export interface IMessage {
  id: number;
  id_str: string;
  text: string;
  user: IUSer;
  place: IPlace;
  entities: {
    hashtags: IHashtag[];
    hashtagTexts: string[];
  };
  timestamp_ms: string;
  created_at: string;
}

export class Message implements IMessage {
  readonly id: number;
  readonly id_str: string;
  readonly text: string;
  readonly user: IUSer;
  readonly place: IPlace;
  readonly entities: {
    hashtags: IHashtag[];
    hashtagTexts: string[];
  };
  readonly timestamp_ms: string;
  readonly created_at: string;

  constructor(payload) {
    const hashtags = payload.entities && payload.entities.hashtags || [];

    this.id = payload.id;
    this.id_str = payload.id_str;
    this.text = payload.text;
    this.user = payload.user;
    this.place = payload.place;
    this.entities = {
      hashtags,
      hashtagTexts: hashtags.map(ht => ht.text.toLowerCase())
    };
    this.timestamp_ms = payload.timestamp_ms;
    this.created_at = payload.created_at;
  }

  includesHashtag(hashtag): boolean {
    return this.entities.hashtagTexts.includes(hashtag);
  }

  toIData(): IMessage {
    return {
      id: this.id,
      id_str: this.id_str,
      text: this.text,
      user: this.user,
      place: this.place,
      entities: this.entities,
      timestamp_ms: this.timestamp_ms,
      created_at: this.created_at
    };
  }
}
