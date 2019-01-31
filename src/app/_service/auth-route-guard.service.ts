import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot
} from '@angular/router';

import { Log4ngService } from './log4ng.service';
import { AuthService } from './auth.service';
import { SessionService } from './session.service';
import { SessionRefreshService } from './session-refresh.service';
import { UsrMsgService } from './usr-msg.service';
import { Session } from '../_model/session';


@Injectable()
export class AuthRouteGuardService implements CanActivate {

  private cn: String = 'AuthRouteGuardService';


  constructor(
    private logger: Log4ngService,
    public authService: AuthService,
    public router: Router,
    private sessionService: SessionService,
    private sessionRefreshService: SessionRefreshService,
    private usrMsgService: UsrMsgService,
  ) {}

  /*
   *
   */
  canActivate(route: ActivatedRouteSnapshot): boolean {

    // this will be passed from the route config
    // on the data property
    const expectedGrant = route.data.grantRequired;
    const securityContext = route.paramMap.get('securitycontext');
    this.logger.debug (this.cn + '.canActivate', 'checking for ' + expectedGrant);
    this.logger.debug (this.cn + ': sessionService',
      'Session: ' + JSON.stringify(this.sessionService.getCurrentSession()));
    if (!this.sessionService.isLoggedIn) {
      this.logger.debug(this.cn + '.nosession',
          'Trying to get new session' + route.url.join('/'));
          // create a non-null session to avoid loops
          this.sessionService.appTargetUrl = route.url.join('/'); // '/noteentries/public/5a75b739810852122ce33279';
          this.sessionRefreshService.attemptRefresh().subscribe(
            res => this.sessionRefreshResponseCallback(res),
            err => this.sessionRefreshErrorCallback(err)
          );
      // this.router.navigateByUrl('/login');
      // return false;

    } else if (
      this.sessionService.isAuthenticated() &&
      this.sessionService.isAuthorized(securityContext, expectedGrant)
      ) {
      return true;

    } else {
      this.router.navigateByUrl('/access-denied');
      return false;
    }

  }

  /*
   *  Callbackfunction for Check Credentials Response
   */
  sessionRefreshResponseCallback (response: boolean): void {
    if (response) {

        this.logger.debug(this.cn + '.sessionRefreshResponseCallback',
            this.sessionService.getCurrentSession());
        this.logger.debug(this.cn + '.response',
              response);
        this.router.navigateByUrl(this.sessionService.appTargetUrl);

    } else {

      this.logger.debug(this.cn + '.sessionRefreshAttemptResponseCallback',
        'Unexpected login Response Code');
    }
  }

  /*
   *  callback function for check credentials error
   */
  sessionRefreshErrorCallback (err: any): void {
    this.logger.debug(this.cn + '.sessionRefreshAttemptResponseCallback',
      'received Error' + err.status);
      this.router.navigateByUrl('/login');
    this.usrMsgService.pushDetailedMsg('Sorry, we couldn\'t restore your session', err, 'ERROR');

  }




}
