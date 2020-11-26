import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { debounceTime, map, takeUntil } from 'rxjs/operators';

import { AppState } from '../store/app.state';
import * as fromMessage from '../store/message';
import { IMessage, Message } from '../models/message';

declare var PubNub;

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html'
})
export class MessagesComponent implements OnInit, OnDestroy {
  filterInputControl = new FormControl();

  pubnub;
  messages$: Observable<IMessage[]>;
  tweetsPerMin$: Observable<number>;
  countryCodes$: Observable<string[]>;

  private readonly _destroy = new Subject<void>();

  constructor(
    private store: Store<AppState>
  ) {
    this.onMessageReceived.bind(this);
  }

  ngOnInit(): void {
    this.startReceivingMessages();
    this.subscribeToStream();

    this.messages$ = this.store.select(fromMessage.selectMessagesByHashtagFeed);
    const analytics$ = this.store.select(fromMessage.selectAnalyticsData);
    this.tweetsPerMin$ = analytics$.pipe(map(val => val.tweetsPerMinutes));
    this.countryCodes$ = analytics$.pipe(map(val => val.countryCodes));

    this.filterInputControl.valueChanges.pipe(
      debounceTime(500),
      takeUntil(this._destroy)
    ).subscribe(hashtag => {
      this.store.dispatch(new fromMessage.FilterByHashtag({
        hashtag
      }));
    });
  }

  ngOnDestroy(): void {
    this.stopReceivingMessages();
    this.unsubscribeToStream();

    this._destroy.next();
    this._destroy.complete();
  }

  onMessageReceived = (messageData) => {
    const message = new Message(messageData.message);
    this.store.dispatch(new fromMessage.NewMessage({ message }));
  }

  private subscribeToStream(): void {
    const uuid = PubNub.generateUUID();

    this.pubnub = new PubNub({
      subscribe_key: 'sub-c-78806dd4-42a6-11e4-aed8-02ee2ddab7fe',
      uuid
    });
    this.pubnub.addListener({
      message: this.onMessageReceived
    });
    this.pubnub.subscribe({
      channels: ['pubnub-twitter']
    });
  }

  private unsubscribeToStream(): void {
    if (this.pubnub) {
      this.pubnub.unsubscribe({
        channels: ['pubnub-twitter']
      });
    }
  }

  private startReceivingMessages(): void {
    this.store.dispatch(new fromMessage.OpenConnection());
  }

  private stopReceivingMessages(): void {
    this.store.dispatch(new fromMessage.CloseConnection());
  }

}
