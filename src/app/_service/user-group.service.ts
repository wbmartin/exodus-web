import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';
import 'rxjs/add/operator/map';

import { IUserGroup, UserGroup } from '../_model/user-group';
import { Log4ngService } from '../_service/log4ng.service';

@Injectable(
  {
    providedIn: 'root'
  }
)
export class UserGroupService {
  private serviceUrl = `/api/v1/usergroup`;
  public userGroupListResult: Array<UserGroup>;
  public userGroupResult: UserGroup;
  private cn: String = 'UserGroupService';

  constructor(
    private logger: Log4ngService,
    private http: HttpClient,
  ) { }

  /*
   *
   */
  getUserGroupList(securityContext: string): Observable<IUserGroup[]> {
    const url = `${this.serviceUrl}/${securityContext}`;
    // return full HTTP response triggered by anon observe object below
    this.logger.debug(this.cn + '.getUserGroupList', 'executing');
    return this.http.get (url, {observe: 'response'})
      .map( res => {
        this.logger.debug(this.cn + '.getUserGroupList', 'mapping');
        this.userGroupListResult = <IUserGroup[]> res.body;
        return (this.userGroupListResult);
      });

  }

  /*
   *
   */
  getUserGroup(securityContext: string, userGroupId: string, ): Observable<IUserGroup> {
    const url = `${this.serviceUrl}/${securityContext}/${userGroupId}`;
    // return full HTTP response triggered by anon observe object below
    this.logger.debug(this.cn + '.getUserGroup', 'executing');
    return this.http.get (url, {observe: 'response'})
      .map( res => {
        this.userGroupResult = <IUserGroup> res.body;
        return (this.userGroupResult);
      });

  }

  /*
   *
   */
  putUserGroup(securityContext: string, userGroupObj: UserGroup): Observable<IUserGroup> {
    const url = `${this.serviceUrl}/${securityContext}`;
    // return full HTTP response triggered by anon observe object below
    this.logger.debug(this.cn + '.putUserGroup', 'executing');
    return this.http.put(url, userGroupObj, {observe: 'response'})
      .map( res => {
                    this.userGroupResult = <IUserGroup> res.body;
                    return (this.userGroupResult);
            }
          );
  }

  /*
   *
   */
  postUserGroup(securityContext: string, userGroupObj: UserGroup): Observable<IUserGroup> {
    const url = `${this.serviceUrl}/${securityContext}`;
    // return full HTTP response triggered by anon observe object below
    this.logger.debug(this.cn + '.delUserGroup', 'executing');
    return this.http.post(url, userGroupObj, {observe: 'response'})
      .map( res => {
        this.userGroupResult = <IUserGroup> res.body;
        return (this.userGroupResult);
      });
  }

  /*
   *
   */
  delUserGroup(securityContext: string, userGroupObj: UserGroup): Observable<number> {
    const url = `${this.serviceUrl}/${securityContext}/${userGroupObj['_id']['$oid']}`;
    // return full HTTP response triggered by anon observe object below
    this.logger.debug(this.cn + '.delUserGroup', 'executing');
    return this.http.delete(url, {observe: 'response'})
      .map( res => {
        return (res.status);
      });
  }




}
