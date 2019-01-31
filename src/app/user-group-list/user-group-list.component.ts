
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


import { IUserGroup, UserGroup } from '../_model/user-group';


import { Log4ngService } from '../_service/log4ng.service';
import { UserGroupService } from '../_service/user-group.service';
// import { FooterComponent } from '../footer/footer.component';
import { SessionService } from '../_service/session.service';
import { UsrMsgService } from '../_service/usr-msg.service';
import { MasterSecurityContextService } from '../_service/master-security-context.service';
import { ErrorHandlerService } from '../_service/error-handler.service';


import {
  MatTableModule,
  MatTableDataSource,
} from '@angular/material';

@Component({
  selector: 'app-user-group-list',
  templateUrl: './user-group-list.component.html',
  styleUrls: ['./user-group-list.component.css']
})
export class UserGroupListComponent implements OnInit {

  private userGroupList: Array<UserGroup>;
  public userGroupDataSource: MatTableDataSource<UserGroup>; // exposed to HTML
  private cn: string = 'UserGroupList';

  // UI Authorization Variables
  public userCanCreate = false;
  public userCanUpdate = false;
  public userCanDelete = false;
  public userCanEdit = false;
  public formEditMode = 'INS';


  constructor(
    private logger: Log4ngService,
    private userGroupService: UserGroupService,
    public sessionService: SessionService, // exposed to HTML
    private usrMsgService: UsrMsgService,
    private router: Router,
    private masterSecurityContextService: MasterSecurityContextService,
    private errorHandlerService: ErrorHandlerService,


  ) {
    this.userGroupDataSource = new MatTableDataSource();

  }

  /*
   *
   */
  ngOnInit() {
    this.userGroupService.getUserGroupList('system').subscribe(
      res => this.getUserGroupListResponseCallback(res),
      err => this.getUserGroupListErrorCallback(err)
     );
      ('user group listsetting master security Context');
     this.masterSecurityContextService.setCurrentMasterSecurityContext('system');
     this.showAuthUIComponents('system');
  }



  /*
   * Adjust UI with authorized actions, remove unauthorized activites
   */
  showAuthUIComponents(securityContext: string = 'DEFAULTDENY'): void {
    this.userCanDelete = this.sessionService.isAuthorized(securityContext, 'DEL_USER_GROUP');
    this.userCanCreate = this.sessionService.isAuthorized(securityContext, 'INS_USER_GROUP');
    this.userCanUpdate = this.sessionService.isAuthorized(securityContext, 'UPD_USER_GROUP');
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
  getUserGroupListResponseCallback (response: Array<UserGroup>): void {
    if (response) {
      this.logger.debug(this.cn + '.getUserGroupListResponseCallback',
        'Successfuls getUserGroupList Response: ' + JSON.stringify(response));
        this.userGroupList = response;
        this.userGroupDataSource.data = this.userGroupList;
        // this.logger.debug('useradminComponent.getUserGroupListResponseCallback',
        // this.userGroupList[0]['username']);
    } else {
      this.logger.debug(this.cn + '.getUserGroupListResponseCallback',
        'Unexpected GetUserGroupList Response Code');
    }
  }

  /*
   *  callback function for check credentials error
   */
  getUserGroupListErrorCallback (err: any): void {
    this.errorHandlerService.handleErrorCallback(
      this.cn, // component Name
      'getUserGroupListErrorCallback', //FunctionName
      err, // Error Object
      true // Notify User
    );


  }





}
