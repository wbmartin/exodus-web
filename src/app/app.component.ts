import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';

import { MediaMatcher } from '@angular/cdk/layout';

import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  ActivatedRoute
} from '@angular/router';

import {
  ViewChild,
  ElementRef
} from '@angular/core';

import {
  MatOptionSelectionChange,
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material';

import { SessionService } from './_service/session.service';
import { Log4ngService } from './_service/log4ng.service';
import { UsrMsgService } from './_service/usr-msg.service';
import { AuthService } from './_service/auth.service';
import { ErrorHandlerService } from './_service/error-handler.service';

import { MasterSecurityContextService } from './_service/master-security-context.service';
// import { MasterSecurityContextComponent } from './master-security-context/master-security-context.component'




@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  private cn: string= 'AppComponent';
  public masterSecurityContext = 'public';
  private alive = true;
  public userCanAdmin = false;
  public userCanSeeNotes = false;

  private sessionEventListener;
  private masterSecurityContextListener;
  @ViewChild('snav') snavRef: any;




  constructor(
    public sessionService: SessionService, // exposed to html
    private media: MediaMatcher,
    private usrMsgService: UsrMsgService,
    private logger: Log4ngService,
    private changeDetectorRef: ChangeDetectorRef,
    private masterSecurityContextService: MasterSecurityContextService,
    public authService: AuthService,
    public router: Router,
    private errorHandlerService: ErrorHandlerService,


  ) {
      this.mobileQuery = media.matchMedia('(max-width: 600px)');
      this._mobileQueryListener = () => changeDetectorRef.detectChanges();
      this.mobileQuery.addListener(this._mobileQueryListener);
      this.logger.debug(this.cn + 'Constructor', 'running');

      this.masterSecurityContextListener = masterSecurityContextService.currentMasterSecurityContext$.takeWhile(() => this.alive).subscribe(
            receivedMasterSecurityContext => {
              this.logger.debug(this.cn + '.contstructor-listener',
                'LISTENER registered context Change' +
                this.masterSecurityContext + ' ' +
                receivedMasterSecurityContext);

              this.masterSecurityContext = receivedMasterSecurityContext;
              this.showAuthUIComponents(receivedMasterSecurityContext);
        });


      this.sessionEventListener = sessionService.sessionEvents$.takeWhile(() => this.alive).subscribe(
            sessionEvt => {
              this.logger.debug(this.cn + '.constructor-sessionServiceListener',
                'SESSION EVENT RECD' + sessionEvt);
              if (sessionEvt === 'LOGOUT'){
                this.snavRef.close();
                this.router.navigateByUrl('/');
              } else if (sessionEvt === 'LOGIN') {
                this.showAuthUIComponents('system'); // inital grant reset
              }
        });


  }


   /*
    *
    */
   ngOnInit(): void {
    //
   }

  /*
   *
   */
   ngOnDestroy(): void {
    this.logger.debug(this.cn + '.ngOnDestroy', 'Running')
    this.mobileQuery.removeListener(this._mobileQueryListener);
    this.sessionEventListener.unsubscribe();
    this.masterSecurityContextListener.unsubscribe();
    //this.usrMsgService.pushMsg(this.cn + 'ngOnDestroy', 'INFO');
    this.alive = false;
  }
  /*
   *
   */
  showAuthUIComponents(securityContext: string = 'DEFAULTDENY'): void {
    this.logger.debug(this.cn + '.showAuthUIComponents', 'Running')
    this.userCanAdmin = this.sessionService.isAuthorized('system', 'USER_ADMIN');
    this.userCanSeeNotes = this.sessionService.isAuthorized(securityContext, 'SEL_NOTE_ENTRY');
  }

  /*
   *
   */
  logout(): void {
    this.logger.debug(this.cn + '.logout', 'Running')
    this.authService.attemptLogout()
      .subscribe(
        res => { this.logoutResponseCallback(res); },
        err => { this.logoutErrorCallback(err); }
       );
  }

  /*
   *
   */
  logoutResponseCallback(res: any): void {
    this.logger.debug(this.cn + '.logoutResponseCallback', 'Running')
    this.sessionService.logout();
  }

  /*
   *
   */
  logoutErrorCallback (err: any): void {
    this.errorHandlerService.handleErrorCallback(
      this.cn, // component Name
      'logoutErrorCallback', //FunctionName
      err, // Error Object
      true // Notify User
    );

  }

  /*
   *
   */
  initNav(): void {
    this.logger.debug(this.cn + '.intNav', 'Running')
    // The full screen/side mode of the Side Nav leaves the sidenave opene
    // For the mobile client, the side nav should close
    if (this.mobileQuery.matches){
      this.snavRef.close();
    }
  }



}
