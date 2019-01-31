import { Injectable } from '@angular/core';
import { UsrMsgService } from './usr-msg.service';
import { Log4ngService } from './log4ng.service';
import { SessionService } from './session.service';

import {
  Router,
} from '@angular/router'

import {
  MatDialog,

} from '@angular/material';
import { Observable } from 'rxjs/Observable';

import {
  DialogSimpleGenericComponent,
} from '../dialog-simple-generic/dialog-simple-generic.component';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  private cn: string = 'ErrorHandlerService';

  constructor(
    private logger: Log4ngService,
    private usrMsgService: UsrMsgService,
    private dialog: MatDialog,
    public router: Router,
    private sessionService: SessionService,
  ) {
    this.logger.debug(this.cn + '.Contstructor', 'Running')
  }

  /*
   *
   */
  handleErrorCallback (callerCn: string, callerF: string, callerErr: any, notifyUser: boolean=true ){
    this.logger.debug(callerCn + '.' + callerF, 'recd Error: ' + JSON.stringify(callerErr));
    this.usrMsgService.pushDetailedMsg('Something went wrong:', callerErr, 'ERROR' );
    if(callerErr.status === 401 && callerErr.error.description ==='Unknown Session'){
      this.confirmSessionReset().subscribe(
        res => {
          if (res){
            this.sessionService.logout();
            this.router.navigateByUrl('/login');
          }
        }
      );

    }

  }

  /*
   *
   */
  confirmSessionReset(): Observable<boolean> {
    this.logger.debug(this.cn + '.confirmSessionReset', 'Running')
    const dialogRef = this.dialog.open(DialogSimpleGenericComponent, {
      width: '25%',
      data: {
        title: 'There is bad news..',
        msg: 'Your session is not longer valid.  You can Login again or postpone if you want to copy something from the app first.',
        trueButton: 'Login',
        falseButton: 'Postpone Login'
      }


    });

    return dialogRef.afterClosed();
  }
}
