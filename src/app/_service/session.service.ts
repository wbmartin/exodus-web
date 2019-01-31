import { Injectable } from '@angular/core';
import { Log4ngService } from './log4ng.service';
import { Subject } from 'rxjs/Subject';
import { Session } from '../_model/session';


@Injectable()
export class SessionService {
  public currentSession: Session;

  public isLoggedIn: boolean;
  public csrfToken: string;
  public appTargetUrl: string;
  private cn: String = 'SessionService';
  private sessionEventSource: Subject<any>;
  public sessionEvents$;

  constructor(
    private logger: Log4ngService,


  ) {
    this.initGrantCaches();
    this.csrfToken = 'TBD';

    this.currentSession = new Session();
    this.isLoggedIn = false;
    this.sessionEventSource = new Subject<any>();
    this.sessionEvents$ = this.sessionEventSource.asObservable();

  }

  /*
   *
   */
  setCurrentSession (newSession: Session) {
    this.initGrantCaches();
    this.currentSession = newSession;
    this.csrfToken = this.currentSession['csrf'];
    this.isLoggedIn = this.isAuthorized('system', 'LOGON');
    this.registerSessionEvent('LOGIN')
  }


  /*
   *
   */
  getCurrentSession(): Session {
    return this.currentSession;
  }

  /*
   *
   */
  initGrantCaches() {
    this.isLoggedIn = false;
  }

  /*
   *
   */
  isAuthenticated(): boolean {
    this.logger.debug (this.cn + '.isAuthenticated', 'running');
    let result = false;
    if (this.currentSession.est_ses_exp > +new Date() / 1000) { // + coerces Date to a number
      result = true;
    }
    return (result);
  }

  /*
   *
   */
  isAuthorized (securityContext: string, securityGrant: string): boolean {
    let result;
    if (this.currentSession && securityContext in this.currentSession.grants) {
        result = this.currentSession.grants[securityContext].indexOf(securityGrant) > -1;
    } else {
        result = false;
    }
    this.logger.debug (this.cn + '.isAuthorized',
      'authorization checking securityContext/grant: ' +
      securityContext + '/' + securityGrant + ' = ' + result);
    return (result);
  }

  /*
   *
   */
  registerSessionEvent(evt: string){
    this.sessionEventSource.next(evt);
  }


  /*
   *
   */
  logout(): void {
    this.initGrantCaches();
    this.currentSession = new Session();
    this.isLoggedIn = false;
    this.csrfToken = 'TBD';
    this.registerSessionEvent('LOGOUT');
  }



}
