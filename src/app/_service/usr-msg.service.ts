import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { UsrMsgComponent } from '../usr-msg/usr-msg.component';
import { UsrMsgHubService } from './usr-msg-hub.service';
import { UsrMsg } from '../_model/usr-msg';

@Injectable()
export class UsrMsgService {

  private cn: String = 'UsrMsgService';
  constructor(
      private usrMsgHubService: UsrMsgHubService,
          private matSnackBar: MatSnackBar,
  ) {

  }

  /*
   *
   */
  pushMsg(title: string, msgLevel: string = 'INFO'): void {
    this.pushDetailedMsg (title, '', msgLevel);
  }

  /*
   *
   */
  pushDetailedMsg(title: string, details: string, msgLevel: string = 'INFO') {
    this.usrMsgHubService.prepUsrMsg(title, JSON.stringify(details), msgLevel);
    const panelColor = this.getPanelColor (msgLevel);
    this.matSnackBar.openFromComponent(UsrMsgComponent, {
      duration: 2500,
      panelClass: [panelColor]
    });

  }

  /*
   *
   */
  getPanelColor (msgLevel: string) {
    let panelColor = 'gray-snackbar';
    if (msgLevel === 'INFO') {
      panelColor = 'gray-snackbar';
    } else if (msgLevel === 'ERROR') {
      panelColor = 'red-snackbar';
    } else if (msgLevel === 'WARN') {
      panelColor = 'blue-snackbar';
    }
    return panelColor;
  }

  /*
   *
   */
  clearMsgRegisters(): void {
    this.usrMsgHubService.initMsgRegisters();
  }



}
