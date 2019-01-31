import {
  Component,
  OnInit,
  ChangeDetectorRef,
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

import { Observable } from 'rxjs/Observable';

import {
  MatTableModule,
  MatTableDataSource,
  MatOptionSelectionChange,
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material';

import { Log4ngService } from '../_service/log4ng.service';
import { UsrMsgService } from '../_service/usr-msg.service';
import { UserGroupService } from '../_service/user-group.service';
import { SecurityContextService } from '../_service/security-context.service';
import { AppGrantService } from '../_service/app-grant.service';
import { MasterSecurityContextService } from '../_service/master-security-context.service';
import { SessionService } from '../_service/session.service';
import { ErrorHandlerService } from '../_service/error-handler.service';



import {
  IUserGroup,
  UserGroup,
} from '../_model/user-group';

import {
  IAppGrant,
  AppGrant
} from '../_model/app-grant';

import {
  ISecurityContext,
  SecurityContext
} from '../_model/security-context';

import {
  DialogSimpleGenericComponent,
} from '../dialog-simple-generic/dialog-simple-generic.component';

@Component({
  selector: 'app-user-group-edit',
  templateUrl: './user-group-edit.component.html',
  styleUrls: ['./user-group-edit.component.css']
})
export class UserGroupEditComponent implements OnInit {

  private cn: string = 'UserGroupEditComponent';
  public userGroupEditFormGroup: FormGroup;
  private appGrantList: Array<AppGrant>;
  public appliedGrantList: Array<AppGrant>;
  public availGrantList: Array<AppGrant>; // exposed to HTML
  public isFormDirty: boolean; // exposed to HTML
  public securityContextList: Array<SecurityContext>; // exposed to HTML
  public visibleSecurityContext: string;

  // UI Authorization Variables
  public userCanCreate = false;
  public userCanUpdate = false;
  public userCanDelete = false;
  public userCanEdit = false;
  public formEditMode = 'UPD';

  constructor(
    private logger: Log4ngService,
    private userGroupService: UserGroupService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private usrMsgService: UsrMsgService,
    private formBuilder: FormBuilder,
    private securityContextService: SecurityContextService,
    private appGrantService: AppGrantService,
    private dialog: MatDialog,
    private masterSecurityContextService: MasterSecurityContextService,
    private sessionService: SessionService,
    private errorHandlerService: ErrorHandlerService,

  ) {
    this.appGrantList = [];
    this.userGroupEditFormGroup = this.formBuilder.group({
      groupRoleName: [{value: '',  disabled: false}],
      userGroupNotes: [{value: '',  disabled: false}],
      privilegeGrants: [{value: {},  disabled: false}],
      _id: [{value: '',  disabled: false}],
      createDate: [{value: '',  disabled: false}],
      createUser: [{value: '',  disabled: false}],
      updateDate: [{value: '',  disabled: false}],
      updateUser: [{value: '',  disabled: false}],
      securityContext: [{value: '',  disabled: false}],
    });


  }

  /*
   *
   */
  ngOnInit() {
      this.masterSecurityContextService.setCurrentMasterSecurityContext('system');
      this.refreshGrantsFromServer();


      const userGroupId = this.activatedRoute.snapshot.params['usergroupid'];
      if (userGroupId === '0') {
        this.resetFormGroup();
        this.formEditMode = 'INS';
      } else {
        this.formEditMode = 'UPD';
        this.userGroupService.getUserGroup('system', userGroupId).subscribe(
            res => this.getUserGroupResponseCallback(res),
            err => this.stdUserGroupErrorCallback(err)
        );
      }
      this.showAuthUIComponents('system');
  }

  /*
   *
   */
  resetFormGroup(): void {
    this.userGroupEditFormGroup.reset();
    this.userGroupEditFormGroup.patchValue({'privilegeGrants': {}});

  }

  /*
   *
   */
  canDeactivate(): Observable<boolean> | boolean {
    this.logger.debug(this.cn + '.canDeactivate',
      'running');
    if (this.userGroupEditFormGroup.dirty || this.isFormDirty) {
      return this.confirmSkipSave();
    } else {
      return true;
    }
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
   *
   */
  stdUserGroupErrorCallback (err: any): void {
    this.errorHandlerService.handleErrorCallback(
      this.cn, // component Name
      'stdUserGroupErrorCallback', //FunctionName
      err, // Error Object
      true // Notify User
    );

  }

  /*
   *
   */
  getUserGroupResponseCallback(response: UserGroup): void {
    if (response) {
      this.logger.debug(this.cn + '.getUserGroupResponseCallback',
        'Successful getUserGroup Response');
        this.userGroupEditFormGroup.setValue(response);
      this.usrMsgService.pushMsg('User Group Retrieved', 'INFO');
    } else {
      this.logger.debug(this.cn + '.getUserGroupResponseCallback',
        'Unexpected GetUserGroup Response Code');
      this.usrMsgService.pushMsg('User Group Retrieve Error', 'ERROR');
    }

  }

  /*
   *
   */
  attemptUpdate() {
      this.userGroupService.putUserGroup('system', this.userGroupEditFormGroup.value).subscribe(
          res => this.putUserGroupResponseCallback(res),
          err => this.stdUserGroupErrorCallback(err)
      );
  }

  /*
   *
   */
  putUserGroupResponseCallback(response: UserGroup): void {
    this.userGroupEditFormGroup.markAsPristine();
    this.isFormDirty = false;
    this.router.navigateByUrl('/usergroups/system');
    this.logger.debug(this.cn + '.putUserGroupResponseCallback',
        'Successful putUserGroup Response');
    this.usrMsgService.pushMsg('User Group Updated', 'INFO');
  }



  /*
   *
   */
  attemptCreate() {
    if (false) {
      // TODO attemp create logic check
      // this.usrMsgService.pushMsg('Oops - the two passwords don\'t match yet');
    } else {
      this.userGroupService.postUserGroup('system', this.userGroupEditFormGroup.value).subscribe(
          res => this.postUserGroupResponseCallback(res),
          err => this.stdUserGroupErrorCallback(err)
      );
    }
  }

  /*
   *
   */
  postUserGroupResponseCallback(response: UserGroup): void {
    this.userGroupEditFormGroup.markAsPristine();
    this.isFormDirty = false;
    this.router.navigateByUrl('/usergroups/system');
    this.logger.debug(this.cn + '.postUserGroupResponseCallback',
        'Successful postUserGroup Response');
    this.usrMsgService.pushMsg('User Group Created', 'INFO');
  }

  /*
   *
   */
  attemptDelete() {
      this.userGroupService.delUserGroup('system', this.userGroupEditFormGroup.value).subscribe(
          res => this.delUserGroupResponseCallback(res),
          err => this.stdUserGroupErrorCallback(err)
      );
  }

  /*
   *
   */
  delUserGroupResponseCallback(response: number): void {
    this.userGroupEditFormGroup.markAsPristine();
    this.isFormDirty = false;
    this.router.navigateByUrl('/usergroups/system');
    this.logger.debug(this.cn + '.delUserGroupResponseCallback',
        'Successful delUserGroup Response');
    this.usrMsgService.pushMsg('User Group Deleted', 'INFO');
  }
/*
  compareGroupNames (o1: any, o2: any): boolean {
    return o1.groupRoleName === o2.groupRoleName;
  }
  */
  compareSecurityContexts (selOption: any, selControlValue: any): boolean {
    /*this.logger.debug(this.cn + '.compareSecurityContexts',
    "selOption" + selOption.shortName + " selControlValue: " +
    selControlValue.shortName)
    */
    return selOption.shortName === selControlValue.shortname;
  }

  /*
   *
   */
  refreshGrantsFromServer (): void {
    this.securityContextService.getSecurityContextList().subscribe(
      res => this.getSecurityContextListResponseCallback(res),
      err => this.getSecurityContextListErrorCallback(err)
    );


    this.appGrantService.getAppGrantList('system').subscribe(
      res => this.getAppGrantListResponseCallback(res),
      err => this.getAppGrantListErrorCallback(err)
    );
    this.isFormDirty = false;
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
        this.visibleSecurityContext = 'system';
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
      'stdUserGroupErrorCallback', //FunctionName
      err, // Error Object
      true // Notify User
    );

  }


  /*
   *  Callbackfunction for Check Credentials Response
   */
  getAppGrantListResponseCallback (response: Array<AppGrant>): void {
    if (response) {
      this.logger.debug(this.cn + '.getAppGrantListResponseCallback',
        'Successfuls getAppGrantpList Response');
        this.appGrantList = response;
      //  this.userGroupDataSource.data = this.userGroupList;
      this.usrMsgService.pushMsg('App Grants Retrieved', 'INFO');
    } else {
      this.logger.debug(this.cn + '.getAppGrantListResponseCallback',
        'Unexpected GetAppGrantList Response Code');
      this.usrMsgService.pushMsg('App Grants Retrieval Error', 'ERROR');
    }
  }

  /*
   *  callback function for check credentials error
   */
  getAppGrantListErrorCallback (err: any): void {
    this.logger.debug(this.cn + '.getAppGrantListResponseCallback',
      'received Error: ', err);
    this.usrMsgService.pushDetailedMsg('Something went wrong - App Grants Retrieve Error ' , err, 'ERROR');

  }

  /*
   *
   */
  onChangeSecurityContext (event: MatOptionSelectionChange, securityContext: any) {
      if (event.source.selected) {
        this.logger.debug(this.cn + '.onChangeSecurityContext',
          'shortname:' + JSON.stringify(securityContext.shortName)  );
        this.divyGrants(securityContext.shortName);
      }
  }

  /*
   *
   */
  expandGrants(): void {
    this.divyGrants(this.visibleSecurityContext);
  }

  // to work with onchange, from the DropDown select list, it must receive the argument from the event
  /*
   *
   */
  divyGrants (selectedContext: string): void {
    this.appliedGrantList = [];
    this.availGrantList = [];
    /*this.logger.debug(this.cn + '.divyGrants', "shortname: " +
      selectedContext.shortName)
    */
    if (selectedContext === undefined) {
      this.logger.debug(this.cn + '.divyGrants', 'no context selected');
    }  else {
      this.isFormDirty = false;
      // iterate over all grants to determine which are applied vs. available
      for (const grant of this.appGrantList) {
        // Skip Systemin non-system context and vice versa
        if ( ( grant.systemOnly === 'Y' && selectedContext === 'system' ) ||
             ( grant.systemOnly !== 'Y' && selectedContext !== 'system' ) ) {
          // if grant is present in the group add it to the applied list

          if ( typeof this.userGroupEditFormGroup.value['privilegeGrants'][selectedContext] != "undefined" &&
               this.userGroupEditFormGroup.value['privilegeGrants'][selectedContext].includes(grant.shortName) ) {
            this.appliedGrantList.push(grant);
          } else { // The grant is available to be applied
            this.availGrantList.push(grant);
          } // if
        } // if
      } // form
    }// if
  }

  /*
   *
   */
  grantChangeDrop(event: CdkDragDrop<string[]>) {
      if (event.previousContainer === event.container) {
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      } else {
        this.isFormDirty = true;
        transferArrayItem(event.previousContainer.data,
                          event.container.data,
                          event.previousIndex,
                          event.currentIndex);
        this.buildUserGroupGrants();
      }
    }
/*
    updateGrantChanges() {
      this.buildUserGroupGrants();
      this.logger.debug(this.cn + '.updateGrantChanges',
          'running');
      this.userGroupService.putUserGroup('system', this.userGroupEditFormGroup.value).subscribe(
          res => this.putUserGroupResponseCallback(res),
          err => this.stdUserGroupErrorCallback(err)
      );
    }
    */

    /*
     *
     */
    buildUserGroupGrants(): void {
      const newGrantList: Array<String> = [];
      for (const grant of this.appliedGrantList) {
        newGrantList.push(grant.shortName);
      }
      let currentGrants = this.userGroupEditFormGroup.value['privilegeGrants'];
      currentGrants[this.visibleSecurityContext] = newGrantList;
      //console.log('test:'+ currentGrants+'patching with:' +this.visibleSecurityContext + '//' + JSON.stringify(newGrantList) + '//' + JSON.stringify(currentGrants));
       this.userGroupEditFormGroup.patchValue({
         'privilegeGrants': currentGrants
       });
    }


}
