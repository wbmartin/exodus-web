import {
  Component,
  OnInit
} from '@angular/core';

import { Router } from '@angular/router';
import {
  MatTableModule,
  MatTableDataSource,
} from '@angular/material';

import { Log4ngService } from '../_service/log4ng.service';
import { UsrMsgService } from '../_service/usr-msg.service';
import { SessionService } from '../_service/session.service';
// import { FooterComponent } from '../footer/footer.component';
import { AppGrantService } from '../_service/app-grant.service';
import { MasterSecurityContextService } from '../_service/master-security-context.service';
import { ErrorHandlerService } from '../_service/error-handler.service';


import { AppGrant, IAppGrant } from '../_model/app-grant';


@Component({
  selector: 'app-app-grant-list',
  templateUrl: './app-grant-list.component.html',
  styleUrls: ['./app-grant-list.component.css']
})
export class AppGrantListComponent implements OnInit {

  private appGrantList: Array<AppGrant>;
  public appGrantDataSource: MatTableDataSource<AppGrant>; // exposed to HTML
  private cn: string = 'AppGrantListComponent';

  // UI Authorization Variables
  public userCanCreate = false;
  public userCanUpdate = false;
  public userCanDelete = false;
  public userCanEdit = false;
  public formEditMode = 'INS';

  constructor(
    private logger: Log4ngService,
    private appGrantService: AppGrantService,
    public sessionService: SessionService, // exposed to HTML
    private usrMsgService: UsrMsgService,
    private router: Router,
    private masterSecurityContextService: MasterSecurityContextService,
    private errorHandlerService: ErrorHandlerService,
  ) {
      this.appGrantDataSource = new MatTableDataSource();

  }

  /*
   *
   */
  ngOnInit() {
    this.masterSecurityContextService.setCurrentMasterSecurityContext('system');
    this.appGrantService.getAppGrantList('system').subscribe(
      res => this.getAppGrantListResponseCallback(res),
      err => this.getAppGrantListErrorCallback(err)
     );
    this.showAuthUIComponents('system');

  }

  /*
   * Adjust UI with authorized actions, remove unauthorized activites
   */
  showAuthUIComponents(securityContext: string = 'DEFAULTDENY'): void {
    this.userCanDelete = this.sessionService.isAuthorized(securityContext, 'DEL_APP_GRANT');
    this.userCanCreate = this.sessionService.isAuthorized(securityContext, 'INS_APP_GRANT');
    this.userCanUpdate = this.sessionService.isAuthorized(securityContext, 'UPD_APP_GRANT');
    this.logger.debug(this.cn + '.showAuthUIComponents',
      'Setting form enable: userCanUpdate' +
      this.userCanUpdate + '; userCanCreate:' +
      this.userCanCreate + '; editMode:' + this.formEditMode);

    if (this.userCanUpdate && this.formEditMode === 'UPD') {
      this.enableFormControls(true);
      this.userCanEdit = true;
    } else if (this.userCanCreate && this.formEditMode === 'INS') {
      this.enableFormControls(true);
      this.userCanEdit = true;
    } else {
      this.enableFormControls(false);
      this.userCanEdit = false;
    }
  }

  /*
   * Toggle Form inputs enabled
   */
  enableFormControls(en: boolean = false): void {

    if (en) {


    } else {


    }
  }

  /*
   *  Callbackfunction for Check Credentials Response
   */
  getAppGrantListResponseCallback (response: Array<AppGrant>): void {
    if (response) {
      this.logger.debug(this.cn + '.getAppGrantListResponseCallback',
        'Successfuls getAppGrantList Response');
        this.appGrantList = response;
        this.appGrantDataSource.data = this.appGrantList;
    } else {
      this.logger.debug(this.cn + '.getAppGrantListResponseCallback',
        'Unexpected GetAppGrantList Response Code');
    }
  }

  /*
   *  callback function for check credentials error
   */
  getAppGrantListErrorCallback (err: any): void {
    this.errorHandlerService.handleErrorCallback(
      this.cn, // component Name
      'getAppGrantListErrorCallback', //FunctionName
      err, // Error Object
      true // Notify User
    );

  }

}
