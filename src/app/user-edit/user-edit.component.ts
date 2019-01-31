import {
  Component,
  OnInit,
  Input,
} from '@angular/core';

import {
  ActivatedRoute,
  Router,
} from '@angular/router';

import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  NgForm,
  FormControl,
} from '@angular/forms';

import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';

import {

  MatDialog,
  // MatDialogRef,
  // MAT_DIALOG_DATA,
} from '@angular/material';

import { Observable } from 'rxjs/Observable';

import { Log4ngService } from '../_service/log4ng.service';
import { UsrMsgService } from '../_service/usr-msg.service';
import { UserService } from '../_service/user.service';
import { MasterSecurityContextService } from '../_service/master-security-context.service';
import { SessionService } from '../_service/session.service';
import { ErrorHandlerService } from '../_service/error-handler.service';
import { UserGroupService } from '../_service/user-group.service';

import {
  IUser,
  User,
} from '../_model/user';

import {
  IUserGroup,
  UserGroup
} from '../_model/user-group';

import {
  DialogSimpleGenericComponent,
} from '../dialog-simple-generic/dialog-simple-generic.component';


@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {
  public userEditFormGroup: FormGroup;

  public confirmPasswd = ''; // : string;
  private cn: string = 'UserEditComponent';

  // UI Authorization Variables
  public userCanCreate = false;
  public userCanUpdate = false;
  public userCanDelete = false;
  public userCanEdit = false;
  public formEditMode = 'UPD';

  private userGroupList: Array<UserGroup>;
  public appliedGroupMembershipList: Array<UserGroup>;
  public availGroupMembershipList: Array<UserGroup>; // exposed to HTML
  public isFormDirty:boolean = false;

  constructor(
    private logger: Log4ngService,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private usrMsgService: UsrMsgService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private masterSecurityContextService: MasterSecurityContextService,
    private sessionService: SessionService,
    private errorHandlerService: ErrorHandlerService,
    private userGroupService: UserGroupService,

  ) {
    this.userGroupList = [];
    this.userEditFormGroup = this.formBuilder.group({
      username: [{value: '',  disabled: false}],
      email: [{value: '',  disabled: false}],
      passwd: [{value: '',  disabled: false}],
      userNotes: [{value: '',  disabled: false}],
      userGrants: [{value: [],  disabled: false}],
      _id: [{value: '',  disabled: false}],
      createDate: [{value: '',  disabled: false}],
      createUser: [{value: '',  disabled: false}],
      updateDate: [{value: '',  disabled: false}],
      updateUser: [{value: '',  disabled: false}],
      securityContext: [{value: 'system',  disabled: false}],
      userGroups:[{value: [],  disabled: false}],
    });


  }

  /*
   *
   */
  ngOnInit() {
      this.masterSecurityContextService.setCurrentMasterSecurityContext('system');
      const userId = this.activatedRoute.snapshot.params['userid'];
      this.refreshUserGroupsFromServer();
      if (userId === '0') {
        this.resetFormGroup();
        this.formEditMode = 'INS';
        this.userEditFormGroup.patchValue({
          '_id': 0,
          'securityContext': 'system'
        });
      } else {
        this.userService.getUser(userId).subscribe(
            res => this.getUserResponseCallback(res),
            err => this.stdUserErrorCallback(err)
        );
      }
      this.showAuthUIComponents('system');

  }

  /*
   *
   */
  resetFormGroup(): void{
    this.userEditFormGroup.reset();
    this.userEditFormGroup.patchValue({'userGroups': []});

  }

  /*
   *
   */
  canDeactivate(): Observable<boolean> | boolean {

    this.logger.debug(this.cn + '.canDeactivate',
      'running');
    if (this.userEditFormGroup.dirty  ) {
      return this.confirmSkipSave();
    } else {
      return true;
    }
    return true;
  }

  /*
   *
   */
  confirmSkipSave(): Observable<boolean> {
    const dialogRef = this.dialog.open(DialogSimpleGenericComponent, {
      width: '25%',
      data: {
        title: 'Before you rush off...',
        msg: 'Did you mean to save your changes? ',
        trueButton: 'Discard',
        falseButton: 'Go Back & Save'
      }


    });

    return dialogRef.afterClosed();
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
      for (const ctrl in this.userEditFormGroup.controls) {
        this.userEditFormGroup.controls[ctrl].enable();
      }

    } else {
      for (const ctrl in this.userEditFormGroup.controls) {
        this.userEditFormGroup.controls[ctrl].disable();
      }

    }
  }

  /*
   *
   */
  stdUserErrorCallback (err: any): void {
    this.errorHandlerService.handleErrorCallback(
      this.cn, // component Name
      'stdUserErrorCallback', //FunctionName
      err, // Error Object
      true // Notify User
    );
  }

  /*
   *
   */
  getUserResponseCallback(response: User): void {
    if (response) {
      this.logger.debug(this.cn + '.getUserResponseCallback',
        'Successful getUser Response');
      this.userEditFormGroup.reset();
      this.userEditFormGroup.patchValue(response);
      this.divyGroups();
      this.usrMsgService.pushMsg('User Retrieved', 'INFO');
    } else {
      this.logger.debug('userEditComponent.getUserResponseCallback',
        'Unexpected GetUser Response Code');
      this.usrMsgService.pushMsg('User Retrieve Error', 'ERROR');
    }

  }

  /*
   *
   */
  attemptUpdate() {
    this.logger.debug(this.cn + '.attemptUpdate', 'sec context: ' +
      this.userEditFormGroup.value['securityContext']);
    this.userService.putUser(this.userEditFormGroup.value).subscribe(
        res => this.putUserResponseCallback(res),
        err => this.stdUserErrorCallback(err)
    );
  }

  /*
   *
   */
  putUserResponseCallback(response: User): void {
    this.userEditFormGroup.markAsPristine();
    this.router.navigateByUrl('/users/system');
    this.logger.debug(this.cn + '.putUserResponseCallback',
        'Successful putUser Response');
    this.usrMsgService.pushMsg('User Updated', 'INFO');
  }



  /*
   *
   */
  attemptCreate() {
    if (this.userEditFormGroup.value['passwd'] !== this.confirmPasswd) {
      this.usrMsgService.pushMsg('Oops - the two passwords don\'t match yet' +
        this.userEditFormGroup.value['passwd'] + ' ' + this.confirmPasswd);
    } else {
      this.userService.postUser(this.userEditFormGroup.value).subscribe(
          res => this.postUserResponseCallback(res),
          err => this.stdUserErrorCallback(err)
      );
    }
  }

  /*
   *
   */
  postUserResponseCallback(response: User): void {
    this.userEditFormGroup.markAsPristine();
    this.router.navigateByUrl('/users/system');
    this.logger.debug(this.cn + '.postUserResponseCallback',
        'Successful postUser Response');
    this.usrMsgService.pushMsg('User added', 'INFO');
  }

  /*
   *
   */
  attemptDelete() {
      this.userService.delUser(this.userEditFormGroup.value).subscribe(
          res => this.delUserResponseCallback(res),
          err => this.stdUserErrorCallback(err)
      );
  }

  /*
   *
   */
  delUserResponseCallback(response: number): void {
    this.userEditFormGroup.markAsPristine();
    this.router.navigateByUrl('/users/system');
    this.logger.debug(this.cn + '.delUserResponseCallback',
        'Successful delUser Response');
    this.usrMsgService.pushMsg('User Deleted', 'INFO');
  }

  /*
   *
   */
  refreshUserGroupsFromServer(){

      this.userGroupService.getUserGroupList('system').subscribe(
        res => this.getUserGroupListResponseCallback(res),
        err => this.getUserGroupListErrorCallback(err)
      );
  }

  /*
   *  Callbackfunction for Check Credentials Response
   */
  getUserGroupListResponseCallback (response: Array<UserGroup>): void {
    if (response) {
      this.logger.debug(this.cn + '.getUserGroupListResponseCallback',
        'Successfuls getuserGroupList Response');
        this.userGroupList = response;
      //  this.userGroupDataSource.data = this.userGroupList;
      this.usrMsgService.pushMsg('App Grants Retrieved', 'INFO');
    } else {
      this.logger.debug(this.cn + '.getUserGroupListResponseCallback',
        'Unexpected GetUserGroupList Response Code');
      this.usrMsgService.pushMsg('User Groups Retrieval Error', 'ERROR');
    }
  }

  /*
   *  callback function for check credentials error
   */
  getUserGroupListErrorCallback (err: any): void {
    this.logger.debug(this.cn + '.getUserGroupListErrorCallback',
      'received Error: ', err);
    this.usrMsgService.pushDetailedMsg('Something went wrong' , err, 'ERROR');

  }
  // to work with onchange, from the DropDown select list, it must receive the argument from the event
  /*
   *
   */
  divyGroups (): void {
    this.appliedGroupMembershipList = [];
    this.availGroupMembershipList = [];
    this.logger.debug(this.cn + '.divyGroups', "running " );


      this.isFormDirty = false;
      // iterate over all grants to determine which are applied vs. available
      for (const group of this.userGroupList) {
        // Skip Systemin non-system context and vice versa
        if (  this.userEditFormGroup.value['userGroups'].includes(group.groupRoleName) ) {
          this.appliedGroupMembershipList.push(group);
          this.logger.debug(this.cn + '.divyGroups', "pushing 1 " );
        } else { // The grant is available to be applied
          this.availGroupMembershipList.push(group);
          this.logger.debug(this.cn + '.divyGroups', "pushing 2 " );
        } // if

      } // for

  }

  /*
   *
   */
  groupChangeDrop(event: CdkDragDrop<string[]>) {
      if (event.previousContainer === event.container) {
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      } else {
        this.isFormDirty = true;
        transferArrayItem(event.previousContainer.data,
                          event.container.data,
                          event.previousIndex,
                          event.currentIndex);
        this.buildGroupMembership();
      }
    }


    /*
     *
     */
    buildGroupMembership(): void {
      const newGroupList: Array<String> = [];
      for (const group of this.appliedGroupMembershipList) {
        newGroupList.push(group.groupRoleName);
      }
      //let currentGroups = this.userEditFormGroup.value['userGroups'];
      //currentGroups = newGrantList;
      //console.log('test:'+ currentGrants+'patching with:' +this.visibleSecurityContext + '//' + JSON.stringify(newGrantList) + '//' + JSON.stringify(currentGrants));
       this.userEditFormGroup.patchValue({
         'userGroups': newGroupList
       });
    }

    /*
     *
     */
    expandGroups(): void {
      this.divyGroups();
    }



}
