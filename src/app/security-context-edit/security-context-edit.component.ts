import { Component,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';

import {
  ActivatedRoute,
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
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material';

import { Observable } from 'rxjs/Observable';

import { Log4ngService } from '../_service/log4ng.service';
import { SecurityContextService } from '../_service/security-context.service';
import { MasterSecurityContextService } from '../_service/master-security-context.service';
import { SessionService } from '../_service/session.service';
import { ErrorHandlerService } from '../_service/error-handler.service';



import {
  ISecurityContext,
  SecurityContext,
} from '../_model/security-context';

import { Router } from '@angular/router';
import { UsrMsgService } from '../_service/usr-msg.service';

import {
  DialogSimpleGenericComponent,
} from '../dialog-simple-generic/dialog-simple-generic.component';


@Component({
  selector: 'app-security-context-edit',
  templateUrl: './security-context-edit.component.html',
  styleUrls: ['./security-context-edit.component.css']
})
export class SecurityContextEditComponent implements OnInit {

  public securityContextEditFormGroup: FormGroup;
  private cn: string = 'SecurityContextEditComponent';

  // UI Authorization Variables
  public userCanCreate = false;
  public userCanUpdate = false;
  public userCanDelete = false;
  public userCanEdit = false;
  public formEditMode = 'UPD';

  constructor(
    private logger: Log4ngService,
    private securityContextService: SecurityContextService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private usrMsgService: UsrMsgService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private masterSecurityContextService: MasterSecurityContextService,
    private sessionService: SessionService,
    private errorHandlerService: ErrorHandlerService,

  ) {
  //  this.currentSecurityContext = new SecurityContext();
    this.securityContextEditFormGroup = this.formBuilder.group({
      shortName: [{value: '',  disabled: false}],
      longName: [{value: '',  disabled: false}],
      note: [{value: '',  disabled: false}],
      _id: [{value: '',  disabled: false}],
      createDate: [{value: '',  disabled: false}],
      createUser: [{value: '',  disabled: false}],
      updateDate: [{value: '',  disabled: false}],
      updateUser: [{value: '',  disabled: false}],
      securityContext: [{value: 'system',  disabled: false}],

    });

  }

  /*
   *
   */
  ngOnInit() {
      this.masterSecurityContextService.setCurrentMasterSecurityContext('system');
      this.securityContextEditFormGroup.value['_id'] = this.activatedRoute.snapshot.params['securitycontextid'];

      if (this.securityContextEditFormGroup.value['_id'] === '0') {
        this.resetFormGroup();
        this.formEditMode = 'INS';
      } else {
        this.securityContextService.getSecurityContext(this.securityContextEditFormGroup.value['_id']).subscribe(
            res => this.getSecurityContextResponseCallback(res),
            err => this.stdSecurityContextErrorCallback(err)
        );
      }
      this.showAuthUIComponents('system');
  }

  /*
   *
   */
   resetFormGroup(): void {
     this.securityContextEditFormGroup.reset();
     this.securityContextEditFormGroup.patchValue({
       'securityContext': 'system',
       '_id':'0',
     });

   }

  /*
   *
   */
  canDeactivate(): Observable<boolean> | boolean {
    this.logger.debug(this.cn + '.canDeactivate',
      'running');
    if (this.securityContextEditFormGroup.dirty  ) {
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
      for (const ctrl in this.securityContextEditFormGroup.controls) {
        this.securityContextEditFormGroup.controls[ctrl].enable();
      }

    } else {
      for (const ctrl in this.securityContextEditFormGroup.controls) {
        this.securityContextEditFormGroup.controls[ctrl].disable();
      }

    }
  }

  /*
   *
   */
  stdSecurityContextErrorCallback (err: any): void {
    this.errorHandlerService.handleErrorCallback(
      this.cn, // component Name
      'stdSecurityContextErrorCallback', //FunctionName
      err, // Error Object
      true // Notify User
    );
  }

  /*
   *
   */
  getSecurityContextResponseCallback(response: SecurityContext): void {
    if (response) {
      this.securityContextEditFormGroup.markAsPristine();
      this.logger.debug(this.cn + '.getSecurityContextResponseCallback',
        'Successful getSecurityContext Response');
        this.securityContextEditFormGroup.setValue(response);
      this.usrMsgService.pushMsg('Security Contexts Retrieved', 'INFO');
    } else {
      this.logger.debug(this.cn + '.getSecurityContextResponseCallback',
        'Unexpected GetSecurityContext Response Code');
      this.usrMsgService.pushMsg('Security Contexts Retrieve Error', 'ERROR');
    }

  }

  /*
   *
   */
  attemptUpdate() {
      this.securityContextService.putSecurityContext(this.securityContextEditFormGroup.value).subscribe(
          res => this.putSecurityContextResponseCallback(res),
          err => this.stdSecurityContextErrorCallback(err)
      );
  }

  /*
   *
   */
  putSecurityContextResponseCallback(response: SecurityContext): void {
    this.securityContextEditFormGroup.markAsPristine();
    this.router.navigateByUrl('/securitycontexts/system');
      this.logger.debug(this.cn + '.putSecurityContextResponseCallback',
        'Successful putSecurityContext Response');
  }



  /*
   *
   */
  attemptCreate() {
     this.securityContextService.postSecurityContext(this.securityContextEditFormGroup.value).subscribe(
          res => this.postSecurityContextResponseCallback(res),
          err => this.stdSecurityContextErrorCallback(err)
      );
  }

  /*
   *
   */
  postSecurityContextResponseCallback(response: SecurityContext): void {
    this.securityContextEditFormGroup.markAsPristine();
    this.router.navigateByUrl('/securitycontexts/system');
      this.logger.debug(this.cn + '.postSecurityContextResponseCallback',
        'Successful postSecurityContext Response');
    this.usrMsgService.pushMsg('Security Contexts Added', 'INFO');
  }

  /*
   *
   */
  attemptDelete() {
      this.securityContextService.delSecurityContext(this.securityContextEditFormGroup.value).subscribe(
          res => this.delSecurityContextResponseCallback(res),
          err => this.stdSecurityContextErrorCallback(err)
      );
  }

  /*
   *
   */
  delSecurityContextResponseCallback(response: number): void {
    this.securityContextEditFormGroup.markAsPristine();
    this.router.navigateByUrl('/securitycontexts/system');
      this.logger.debug(this.cn + '.delSecurityContextResponseCallback',
        'Successful delSecurityContext Response');
    this.usrMsgService.pushMsg('Security Contexts Deleted', 'INFO');
  }


}
