import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
 } from '@angular/core';

 import 'rxjs/add/operator/takeWhile';

 import {
   Router,
   CanActivate,
   ActivatedRouteSnapshot,
   ActivatedRoute
 } from '@angular/router';

 import {
   MatOptionSelectionChange,
   MatDialog,
   MatDialogRef,
   MAT_DIALOG_DATA,
 } from '@angular/material';


 import { Log4ngService } from '../_service/log4ng.service';
 import { SessionService } from '../_service/session.service';
 import { MasterSecurityContextService } from '../_service/master-security-context.service';
 import { UsrMsgService } from '../_service/usr-msg.service';
 import { SecurityContextService } from '../_service/security-context.service';
 import { ErrorHandlerService } from '../_service/error-handler.service';


 import { SecurityContext } from '../_model/security-context';


@Component({
  selector: 'app-master-security-context',
  templateUrl: './master-security-context.component.html',
  styleUrls: ['./master-security-context.component.css']
})
export class MasterSecurityContextComponent implements OnInit, OnDestroy {

  public securityContextList: Array<SecurityContext>;
  public masterSecurityContextSelect; // select on top bar
  private cn: string = 'MasterSecurityContextComponent';
  /*  There is a delay registering the new value on the select box for Setting
  the Security Context.  This variable registers the change and blocks future change attempts if
  the ap component already knows about the change.
  */
  public appComponentSecurityContext: string;
  private alive = true;

  constructor(
    private securityContextService: SecurityContextService,
    private masterSecurityContextService: MasterSecurityContextService,
    private changeDetectorRef: ChangeDetectorRef,
    private usrMsgService: UsrMsgService,
    private logger: Log4ngService,
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private errorHandlerService: ErrorHandlerService,
  ) {
    this.securityContextList = [];
    // this.securityContextList.push(new SecurityContext('public'));
    this.masterSecurityContextSelect =  'public';
    masterSecurityContextService.setCurrentMasterSecurityContext('public');
    this.appComponentSecurityContext = this.masterSecurityContextSelect;


    // This subscription will be called
    masterSecurityContextService.currentMasterSecurityContext$.takeWhile(() => this.alive).subscribe(
          receivedMasterSecurityContext => {
            this.logger.debug(this.cn + '.masterSecurityContextService-Listener',
            'registered context Change' +
              this.appComponentSecurityContext + ' ' +
              receivedMasterSecurityContext
           );

            if (this.appComponentSecurityContext !== receivedMasterSecurityContext) {
              this.logger.debug(this.cn + '.masterSecurityContextService-Listener',
                'MSC Component LISTENER setting master securityContext SELECT');
              this.appComponentSecurityContext = receivedMasterSecurityContext;
              this.masterSecurityContextSelect = receivedMasterSecurityContext;
              this.changeDetectorRef.detectChanges();

            } else {
              this.logger.debug(this.cn + '.masterSecurityContextService-Listener',
                'MSC Component skipped master security context change');
            }

      });

  }

  /*
   *
   */
  ngOnInit() {
    this.logger.debug(this.cn + '.ngOnInit', 'running');
    this.getSecurityContexts();
  }

  /*
   *
   */
  ngOnDestroy(): void {
    this.alive = false;
  }

  /*
   *
   */
  getSecurityContexts(): void {
    this.securityContextService.getSecurityContextList().subscribe(
      res => this.getSecurityContextListResponseCallback(res),
      err => this.getSecurityContextListErrorCallback(err)
    );
  }

  /*
   *
   */
  onChangeSecurityContext (event: MatOptionSelectionChange, securityContext: any) {
      if (event.source.selected) {
        const regexp = new RegExp(securityContext.shortName + '$');
        const targetMasterSecurityContext = this.masterSecurityContextService.getCurrentMasterSecurityContext();
        this.logger.debug(this.cn + '.onChangeSecurityContext',
          'MasterSecurityContextComponent SELECTCHANGE change event to:' +
          securityContext.shortName + '; from: ' +
          targetMasterSecurityContext +
          '; url: ' + this.router.url);
        if ( regexp.test(this.router.url) ) {
          this.logger.debug(this.cn + '.onChangeSecurityContext',
            'MasterSecurityContextComponent SELECTCHANGE skipping ' +
            'send back to dashboard because they match');

        } else if (targetMasterSecurityContext === 'INITIALIZING') {
          this.logger.debug(this.cn + '.onChangeSecurityContext',
            'MasterSecurityContextComponent SELECTCHANGE skipping ' +
            'send back to dashboard initializing');

        } else if (targetMasterSecurityContext === securityContext.shortName) {
          this.logger.debug(this.cn + '.onChangeSecurityContext',
            'MasterSecurityContextComponent SELECTCHANGE skipping '+
            'send back to dashboard initializing');

        } else {
          this.logger.debug(this.cn + '.onChangeSecurityContext',
            'MasterSecurityContextComponent SELECTCHANGE ' +
            'sending back to dashboard');
          this.router.navigateByUrl('/dashboard/system');

        }

        if (securityContext.shortName !== this.appComponentSecurityContext ) {
          this.logger.debug(this.cn + '.onChangeSecurityContext',
            'MasterSecurityContextComponent.SELECTCHANGE setting ' +
            'appComponentSecurityContext:' + securityContext.shortName);
          this.appComponentSecurityContext = securityContext.shortName;
          if (securityContext.shortName !== targetMasterSecurityContext) {
            this.logger.debug(this.cn + '.onChangeSecurityContext',
              'MasterSecurityContextComponent.SELECTCHANGE setting ' +
              'setCurrentMaster:' + securityContext.shortName);
            this.masterSecurityContextService.setCurrentMasterSecurityContext (securityContext.shortName);
          } else {
            this.logger.debug(this.cn + '.onChangeSecurityContext',
              'MasterSecurityContextComponent.SELECTCHANGE didnt ' +
              'know about change, but master did. skipped masterupdate');
          }

        } else {
          this.logger.debug(this.cn + '.onChangeSecurityContext',
            'MasterSecurityContextComponent.SELECTCHANGE ' +
            'already setCurrentMasterContext, skipped setCurrentMaster:' +
            + securityContext.shortName
          );
        }






      }
  }

  /*
   *  Callbackfunction for SecurityContext Query
   */
  getSecurityContextListResponseCallback (response: Array<SecurityContext>): void {
    if (response) {
      this.logger.debug(this.cn + '.getSecurityContextListResponseCallback',
        'Successfuls getSecurityContextList Response');
        this.securityContextList = response;
        // this.visibleSecurityContext = {'shortName' :'system'};
        // this.visibleSecurityContext='system';
      this.usrMsgService.pushMsg('Security Contexts Retrieved', 'INFO');
    } else {
      this.logger.debug(this.cn + '.getSecurityContextListResponseCallback',
        'Unexpected GetSecurityContextList Response Code');
    }
  }

  /*
   *  callback function for SecurityContext Query error
   */
  getSecurityContextListErrorCallback (err: any): void {
    this.errorHandlerService.handleErrorCallback(
      this.cn, // component Name
      'getSecurityContextListErrorCallback', //FunctionName
      err, // Error Object
      true // Notify User
    );

  }



}
