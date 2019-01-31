import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';


import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';
import 'rxjs/add/operator/map';

import { IUser, User } from '../_model/user';
import { Log4ngService } from '../_service/log4ng.service';

@Injectable()
export class UserService {
  private serviceUrl = `/api/v1/users`;
  public userListResult: Array<User>;
  public userResult: User;
  private cn: String = 'UserService';

  constructor(
    private logger: Log4ngService,
    private http: HttpClient,
  ) { }

  /*
   *
   */
  getUserList(): Observable<IUser[]> {
    const url = `${this.serviceUrl}/system`;
    // return full HTTP response triggered by anon observe object below
    this.logger.debug(this.cn + '.getUserList', 'executing');
    return this.http.get (url, {observe: 'response'})
      .map( res => {
        this.logger.debug('UserService.getUserList', 'mapping');
        this.userListResult = <IUser[]> res.body;
        return (this.userListResult);
      });

  }

  /*
   *
   */
  getUser(userId: string): Observable<IUser> {
    const url = `${this.serviceUrl}/system/${userId}`;
    // return full HTTP response triggered by anon observe object below
    this.logger.debug(this.cn + '.getUser', 'executing');
    return this.http.get (url, {observe: 'response'})
      .map( res => {
        this.userResult = <IUser> res.body;
        return (this.userResult);
      });

  }

  /*
   *
   */
  putUser(userObj: User): Observable<IUser> {
    const url = `${this.serviceUrl}/system`;
    // return full HTTP response triggered by anon observe object below
    this.logger.debug(this.cn + '.putUser', 'executing');
    return this.http.put(url, userObj, {observe: 'response'})
      .map( res => {
                    this.userResult = <IUser> res.body;
                    return (this.userResult);
            }
          );
  }

  /*
   *
   */
  postUser(userObj: User): Observable<IUser> {
    const url = `${this.serviceUrl}/system`;
    // return full HTTP response triggered by anon observe object below
    this.logger.debug(this.cn + '.delUser', 'executing');
    return this.http.post(url, userObj, {observe: 'response'})
      .map( res => {
        this.userResult = <IUser> res.body;
        return (this.userResult);
      });
  }

  /*
   *
   */
  delUser(userObj: User): Observable<number> {
    const url = `${this.serviceUrl}/system/${userObj['_id']['$oid']}`;
    // return full HTTP response triggered by anon observe object below
    this.logger.debug(this.cn + '.delUser', 'executing');
    return this.http.delete(url, {observe: 'response'})
      .map( res => {
        return (res.status);
      },
      err => {
        this.logger.debug(this.cn + '.delUser', 'error');
      }
    );
  }




}
