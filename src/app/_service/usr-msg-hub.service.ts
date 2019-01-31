import { Injectable } from '@angular/core';
import { UsrMsg } from '../_model/usr-msg';

@Injectable()
export class UsrMsgHubService {
  public usrMsg: Array<UsrMsg>; // placing in usr-msg.service = circ reference
  public usrMsgHistory: Array<UsrMsg>;
  private cn: String = 'UsrMsgHubService';
  constructor() {
   this.initMsgRegisters();
  }

  /*
   *
   */
  cleanUsrMessages(): void {
    let msgLength = this.usrMsg.length;
    for (let index = 0; index < msgLength; ++index) {
      if (this.usrMsg[index]['ts'] + 3000 < new Date().getTime()) {
        this.usrMsg.splice(index, 1);
        msgLength -= 1;
      }
    }
  }


  /*
   *
   */
  prepUsrMsg(title: string, details: string, severity: string): void {
    this.cleanUsrMessages();
    const dt = new Date().getTime();
    this.usrMsg.push(new UsrMsg(title, details, severity, dt));
    this.usrMsgHistory.push(new UsrMsg(title, details, severity , dt));
  }

  /*
   *
   */
  initMsgRegisters(): void {
    this.usrMsg = []; // placing in usr-msg.service = circ reference
    this.usrMsgHistory = [];
  }

}
