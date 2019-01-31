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
import { UserService } from '../_service/user.service';
// import { FooterComponent } from '../footer/footer.component';
import { SessionService } from '../_service/session.service';
import { UsrMsgService } from '../_service/usr-msg.service';
import { MasterSecurityContextService } from '../_service/master-security-context.service';
import { ErrorHandlerService } from '../_service/error-handler.service';

import { IUser, User } from '../_model/user';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  private userList: Array<User>;
  public userDataSource: MatTableDataSource<User>; // exposed to html
  private cn: string = 'UserListComponent';

  // UI Authorization Variables
  public userCanCreate = false;
  public userCanUpdate = false;
  public userCanDelete = false;
  public userCanEdit = false;
  public formEditMode = 'INS';

  constructor(
    private logger: Log4ngService,
    private userService: UserService,
    public sessionService: SessionService, // exposed to html
    private usrMsgService: UsrMsgService,
    private router: Router,
    private masterSecurityContextService: MasterSecurityContextService,
    private errorHandlerService: ErrorHandlerService,


  ) {
    this.userDataSource = new MatTableDataSource();

  }

  /*
   *
   */
  ngOnInit() {
    this.masterSecurityContextService.setCurrentMasterSecurityContext('system');
    this.userService.getUserList().subscribe(
      res => this.getUserListResponseCallback(res),
      err => this.getUserListErrorCallback(err)
     );
    this.showAuthUIComponents('system');

  }



  /*
   * Adjust UI with authorized actions, remove unauthorized activites
   */
  showAuthUIComponents(securityContext: string = 'DEFAULTDENY'): void {
    this.userCanDelete = this.sessionService.isAuthorized(securityContext, 'DEL_USER');
    this.userCanCreate = this.sessionService.isAuthorized(securityContext, 'INS_USER');
    this.userCanUpdate = this.sessionService.isAuthorized(securityContext, 'UPD_USER');
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
  getUserListResponseCallback (response: Array<User>): void {
    if (response) {
      this.logger.debug(this.cn + '.getUserListResponseCallback',
        'Successfuls getUserList Response: ' + JSON.stringify(response));
        this.userList = response;
        this.userDataSource.data = this.userList;
        // this.logger.debug('useradminComponent.getUserListResponseCallback',
        // this.userList[0]['username']);
        this.usrMsgService.pushMsg('User List Retrieved', 'INFO');
    } else {
      this.logger.debug(this.cn + '.getUserListResponseCallback',
        'Unexpected GetUserList Response Code');
      this.usrMsgService.pushMsg('User List Retrieve Error', 'ERROR');
    }
  }

  /*
   *  callback function for check credentials error
   */
  getUserListErrorCallback (err: any): void {
    this.errorHandlerService.handleErrorCallback(
      this.cn, // component Name
      'getUserListErrorCallback', //FunctionName
      err, // Error Object
      true // Notify User
    );



  }





}
