import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { IMessage } from '../../models/message';

@Component({
  selector: 'app-message-item',
  templateUrl: './message-item.component.html'
})
export class MessageItemComponent implements OnInit {
  @Input()
  get message(): IMessage {
    return this._message;
  }
  set message(value: IMessage) {
    this._message = value;
  }
  private _message: IMessage;

  @HostBinding('class.message-item') hostClassname = true;

  constructor() { }

  ngOnInit(): void {
  }

}
