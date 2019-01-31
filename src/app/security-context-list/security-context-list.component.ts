import {
  Component,
  OnInit
} from '@angular/core';
import { Router } from '@angular/router';

import {
  MatTableModule,
  MatTableDataSource,
} from '@angular/material';

import { ISecurityContext, SecurityContext } from '../_model/security-context';


import { Log4ngService } from '../_service/log4ng.service';
import { SecurityContextService } from '../_service/security-context.service';
import { SessionService } from '../_service/session.service';
import { UsrMsgService } from '../_service/usr-msg.service';
import { ErrorHandlerService } from '../_service/error-handler.service';




@Component({
  selector: 'app-security-context-list',
  templateUrl: './security-context-list.component.html',
  styleUrls: ['./security-context-list.component.css']
})
export class SecurityContextListComponent implements OnInit {

  private securityContextList: Array<SecurityContext>;
  public securityContextDataSource: MatTableDataSource<SecurityContext>; // exposed to HTML
  private cn: string = 'SecurityContextListComponent';

  // UI Authorization Variables
  public userCanCreate = false;
  public userCanUpdate = false;
  public userCanDelete = false;
  public userCanEdit = false;
  public formEditMode = 'INS';


  constructor(
    private logger: Log4ngService,
    private securityContextAdminService: SecurityContextService,
    public sessionService: SessionService, // exposed to HTML
    private usrMsgService: UsrMsgService,
    private router: Router,
    private errorHandlerService: ErrorHandlerService,


  ) {
    this.securityContextDataSource = new MatTableDataSource();

  }

  /*
   *
   */
  ngOnInit() {
    this.securityContextAdminService.getSecurityContextList().subscribe(
      res => this.getSecurityContextListResponseCallback(res),
      err => this.getSecurityContextListErrorCallback(err)
     );
     this.showAuthUIComponents('system');

  }

  /*
   * Adjust UI with authorized actions, remove unauthorized activites
   */
  showAuthUIComponents(securityContext: string = 'DEFAULTDENY'): void {
    this.userCanDelete = this.sessionService.isAuthorized(securityContext, 'DEL_SEC_CONTEXT');
    this.userCanCreate = this.sessionService.isAuthorized(securityContext, 'INS_SEC_CONTEXT');
    this.userCanUpdate = this.sessionService.isAuthorized(securityContext, 'UPD_SEC_CONTEXT');
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
  getSecurityContextListResponseCallback (response: Array<SecurityContext>): void {
    if (response) {
      this.logger.debug(this.cn + '.getSecurityContextListResponseCallback',
        'Successfuls getSecurityContextList Response');
        this.securityContextList = response;
        this.securityContextDataSource.data = this.securityContextList;
        // this.logger.debug('securityContextadminComponent.getSecurityContextListResponseCallback',
        // this.securityContextList[0]['securityContextname']);
    } else {
      this.logger.debug(this.cn + '.getSecurityContextListResponseCallback',
        'Unexpected GetSecurityContextList Response Code');
    }
  }

  /*
   *  callback function for check credentials error
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
