import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';
import 'rxjs/add/operator/map';

import { SessionService } from './session.service';

import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Log4ngService } from './log4ng.service';

import { ISession, Session } from '../_model/session';

import { IGoogleCreds, GoogleCreds } from '../_model/google-creds';

@Injectable()
export class GoogleLoginService {

  private loginUrl = `/api/v1/googleauth`;
  private cn: String = 'GoogleLoginService';

  constructor(
    private logger: Log4ngService,
    private http: HttpClient,
    private sessionService: SessionService,
  ) { }

  /*
   *
   */
  attemptTokenExchange(attempt: GoogleCreds): Observable<boolean> {
    const url = `${this.loginUrl}/`;
    // return full HTTP response triggered by anon observe object below
    return this.http.post (url, attempt, {observe: 'response'})
      .map( res => {
        this.sessionService.setCurrentSession (<ISession> res.body);
        return (res.status === 200);
      });

  }

}
