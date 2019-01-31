import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';
import 'rxjs/add/operator/map';


import { ISession, Session } from '../_model/session';
import { Log4ngService } from './log4ng.service';
import { Credentials } from '../_model/credentials';
import { PasswordResetRequest } from '../_model/password-reset-request';
import { SessionService } from './session.service';


@Injectable()
export class AuthService {
  private apiBase = ''; // 'http://app.genesis.io';
  public csrfToken: string;
  private cn: String = 'AuthService';

  constructor(
    private logger: Log4ngService,
    private http: HttpClient,
    private sessionService: SessionService,
  ) {

  }

  /*
   *
   */
  attemptLogin(attempt: Credentials): Observable<boolean> {
    const url = this.apiBase + '/api/v1/auth/';
    // return full HTTP response triggered by anon observe object below
    this.logger.debug(this.cn + '.attemptLogin', 'creds:' + JSON.stringify(attempt));
    return this.http.post (url, attempt, {observe: 'response'})
      .map( res => {
        this.sessionService.setCurrentSession (<ISession> res.body);
        return (res.status === 200);
      });

  }

  /*
   *
   */
  attemptLogout(): Observable<boolean> {
    const url = this.apiBase + '/api/v1/auth/';
    // return full HTTP response triggered by anon observe object below
    this.logger.debug(this.cn + '.attemptLogout', 'Attempting Logout');
    return this.http.delete(url,  {observe: 'response'})
      .map( res => {
        this.logger.debug(this.cn + '.attemptLogout', 'LogoutReceived');
        this.sessionService.logout();
        return (res.status === 200);
      });

  }

  /*
   *
   */
  attemptInitPasswordReset(attempt: Credentials): Observable<boolean> {
    const url = `/api/v1/passwordreset`;
    // return full HTTP response triggered by anon observe object below
    return this.http.post (url, attempt, {observe: 'response'})
      .map( res => {
        return (res.status === 200);
      });

  }

  /*
   *
   */
  attemptChangePassword(attempt: PasswordResetRequest): Observable<boolean> {
    const url = `/api/v1/passwordreset/`;
    // return full HTTP response triggered by anon observe object below
    return this.http.post (url, attempt, {observe: 'response'})
      .map( res => {

        return (res.status === 200);
      });

  }





}
