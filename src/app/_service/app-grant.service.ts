import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';


import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';
import 'rxjs/add/operator/map';

import { IAppGrant, AppGrant } from '../_model/app-grant';
import { Log4ngService } from '../_service/log4ng.service';

@Injectable(
  {
    providedIn: 'root'
  }
)
export class AppGrantService {
  private serviceUrl = `/api/v1/appgrants`;
  public appGrantListResult: Array<AppGrant>;
  public appGrantResult: AppGrant;
  private cn: String = 'AppGrantService';


  constructor(
    private logger: Log4ngService,
    private http: HttpClient,
  ) { }

  /*
   *
   */
  getAppGrantList(securityContext: string): Observable<IAppGrant[]> {
    const url = `${this.serviceUrl}/${securityContext}`;
    // return full HTTP response triggered by anon observe object below
    this.logger.debug(this.cn + '.getAppGrantList', 'executing');
    return this.http.get (url, {observe: 'response'})
      .map( res => {
        this.logger.debug(this.cn + '.getAppGrantList', 'mapping');
        this.appGrantListResult = <IAppGrant[]> res.body;
        return (this.appGrantListResult);
      });

  }

  /*
   *
   */
  getAppGrant(securityContext: string, appGrantId: string, ): Observable<IAppGrant> {
    const url = `${this.serviceUrl}/${securityContext}/${appGrantId}`;
    // return full HTTP response triggered by anon observe object below
    this.logger.debug(this.cn + '.getAppGrant', 'executing');
    return this.http.get (url, {observe: 'response'})
      .map( res => {
        this.appGrantResult = <IAppGrant> res.body;
        return (this.appGrantResult);
      });

  }

  /*
   *
   */
  putAppGrant(securityContext: string, appGrantObj: AppGrant): Observable<IAppGrant> {
    const url = `${this.serviceUrl}/${securityContext}`;
    // return full HTTP response triggered by anon observe object below
    this.logger.debug(this.cn + '.putAppGrant', 'executing');
    return this.http.put(url, appGrantObj, {observe: 'response'})
      .map( res => {
                    this.appGrantResult = <IAppGrant> res.body;
                    return (this.appGrantResult);
            }
          );
  }

  /*
   *
   */
  postAppGrant(securityContext: string, appGrantObj: AppGrant): Observable<IAppGrant> {
    const url = `${this.serviceUrl}/${securityContext}`;
    // return full HTTP response triggered by anon observe object below
    this.logger.debug(this.cn + '.delAppGrant', 'executing');
    return this.http.post(url, appGrantObj, {observe: 'response'})
      .map( res => {
        this.appGrantResult = <IAppGrant> res.body;
        return (this.appGrantResult);
      });
  }

  /*
   *
   */
  delAppGrant(securityContext: string, appGrantObj: AppGrant): Observable<number> {
    const url = `${this.serviceUrl}/${securityContext}/${appGrantObj['_id']['$oid']}`;
    // return full HTTP response triggered by anon observe object below
    this.logger.debug(this.cn + '.delAppGrant', 'executing');
    return this.http.delete(url, {observe: 'response'})
      .map( res => {
        return (res.status);
      });
  }




}
