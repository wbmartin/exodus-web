import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';
import 'rxjs/add/operator/map';


import { ISession, Session } from '../_model/session';
import { Log4ngService } from './log4ng.service';
import { SessionService } from './session.service';
import { ClientConfigService } from '../_service/client-config.service';
import { ErrorHandlerService } from '../_service/error-handler.service';


@Injectable()
export class SessionRefreshService {

  private refreshUrl = `/api/v1/sessionrefresh/system`;
  private cn: string = 'SessionRefreshService';

  constructor(
    private logger: Log4ngService,
    private http: HttpClient,
    private sessionService: SessionService,
    private clientConfigService: ClientConfigService,
    private errorHandlerService: ErrorHandlerService,
  ) {

  }

  /*
   *
   */
  attemptRefresh(): Observable<boolean> {
    const url = `${this.refreshUrl}/`;
    this.clientConfigService.getClientConfig('system').subscribe(
        res => this.getClientConfigResponseCallBack(res),
        err => this.getClientConfigErrorCallBack(err)
    );

    // return full HTTP response triggered by anon observe object below
    return this.http.get (url, {observe: 'response'})
      .map( res => {
        this.sessionService.setCurrentSession (<ISession> res.body);
        return (res.status === 200);
      });

  }

  /*
   *
   */
  getClientConfigResponseCallBack(res: any) {
    this.logger.debug(this.cn + '.getClientConfigResponseCallBack',
      'running');

  }

  /*
   *
   */
  getClientConfigErrorCallBack(err: any) {
    this.errorHandlerService.handleErrorCallback(
      this.cn, // component Name
      'stdNoteEntryErrorCallback', //FunctionName
      err, // Error Object
      true // Notify User
    );

  }

}
