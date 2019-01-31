import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';


import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';
import 'rxjs/add/operator/map';

import { ISecurityContext, SecurityContext } from '../_model/security-context';
import { Log4ngService } from '../_service/log4ng.service';

@Injectable()
export class SecurityContextService {
  private serviceUrl = `/api/v1/securitycontexts/system`;
  public securityContextListResult: Array<SecurityContext>;
  public securityContextResult: SecurityContext;
  private cn: String = 'SecurityContextService';

  constructor(
    private logger: Log4ngService,
    private http: HttpClient,
  ) { }

  /*
   *
   */
  getSecurityContextList(): Observable<ISecurityContext[]> {
    const url = `${this.serviceUrl}`;
    // return full HTTP response triggered by anon observe object below
    this.logger.debug(this.cn + '.getSecurityContextList', 'executing');
    return this.http.get (url, {observe: 'response'})
      .map( res => {
        this.logger.debug(this.cn + '.getSecurityContextList', 'mapping');
        this.securityContextListResult = <ISecurityContext[]> res.body;
        return (this.securityContextListResult);
      });
  }

  /*
   *
   */
  getSecurityContextListCache(): Observable<ISecurityContext[]> {
    this.logger.debug(this.cn + '.getSecurityContextListCache', 'executing');
    if (this.securityContextListResult.length > 0) {
      this.logger.debug(this.cn + '.getSecurityContextListCache', 'using Cached value');
      return new Observable<ISecurityContext[]> (observer => {
          observer.next(this.securityContextListResult);
          observer.complete();
        });


    } else {
      return this.getSecurityContextList();
    }


  }


  /*
   *
   */
  getSecurityContext(securityContextId: string): Observable<ISecurityContext> {
    const url = `${this.serviceUrl}/${securityContextId}`;
    // return full HTTP response triggered by anon observe object below
    this.logger.debug(this.cn + '.getSecurityContext', 'executing');
    return this.http.get (url, {observe: 'response'})
      .map( res => {
        this.securityContextResult = <ISecurityContext> res.body;
        return (this.securityContextResult);
      });

  }

  /*
   *
   */
  putSecurityContext(securityContextObj: SecurityContext): Observable<ISecurityContext> {
    const url = `${this.serviceUrl}`;
    // return full HTTP response triggered by anon observe object below
    this.logger.debug(this.cn + '.putSecurityContext', 'executing');
    return this.http.put(url, securityContextObj, {observe: 'response'})
      .map( res => {
                    this.securityContextResult = <ISecurityContext> res.body;
                    return (this.securityContextResult);
            }
          );
  }

  /*
   *
   */
  postSecurityContext(securityContextObj: SecurityContext): Observable<ISecurityContext> {
    const url = `${this.serviceUrl}`;
    // return full HTTP response triggered by anon observe object below
    this.logger.debug(this.cn + 'postSecurityContext', 'executing');
    return this.http.post(url, securityContextObj, {observe: 'response'})
      .map( res => {
        this.securityContextResult = <ISecurityContext> res.body;
        return (this.securityContextResult);
      });
  }

  /*
   *
   */
  delSecurityContext(securityContextObj: SecurityContext): Observable<number> {
    const url = `${this.serviceUrl}/${securityContextObj['_id']['$oid']}`;
    // return full HTTP response triggered by anon observe object below
    this.logger.debug(this.cn + '.delSecurityContext', 'executing');
    return this.http.delete(url, {observe: 'response'})
      .map( res => {
        return (res.status);
      });
  }




}
