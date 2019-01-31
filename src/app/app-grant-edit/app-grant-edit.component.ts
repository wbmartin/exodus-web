import {
  Component,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';

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

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { Log4ngService } from '../_service/log4ng.service';
import { UsrMsgService } from '../_service/usr-msg.service';
import { AppGrantService } from '../_service/app-grant.service';
import { MasterSecurityContextService } from '../_service/master-security-context.service';
import { SessionService } from '../_service/session.service';
import { ErrorHandlerService } from '../_service/error-handler.service';


import {
  IAppGrant,
  AppGrant,
} from '../_model/app-grant';

import { GUIDStrip } from '../guid-strip.pipe';

import {
  DialogSimpleGenericComponent,
} from '../dialog-simple-generic/dialog-simple-generic.component';



@Component({
  selector: 'app-app-grant-edit',
  templateUrl: './app-grant-edit.component.html',
  styleUrls: ['./app-grant-edit.component.css']
})
export class AppGrantEditComponent implements OnInit {

  private cn: string = 'AppGrantEditComponent';
  public appGrantEditFormGroup: FormGroup;

  // UI Authorization Variables
  public userCanCreate = false;
  public userCanUpdate = false;
  public userCanDelete = false;
  public userCanEdit = false;
  public formEditMode = 'UPD';



  uploadedFiles: any[] = [];

  constructor(
    private logger: Log4ngService,
    private appGrantService: AppGrantService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private usrMsgService: UsrMsgService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private masterSecurityContextService: MasterSecurityContextService,
    private sessionService: SessionService,
    private errorHandlerService: ErrorHandlerService,



  ) {
    // this.currentAppGrant = new AppGrant();
    this.appGrantEditFormGroup = this.formBuilder.group({
      longName: [{value: '',  disabled: false}],
      shortName: [{value: '',  disabled: false}],
      note: [{value: '',  disabled: false}],
      systemOnly: [{value: '',  disabled: false}],
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

      const appGrantId = this.activatedRoute.snapshot.params['_id'];
      const securityContext = this.activatedRoute.snapshot.params['securitycontext'];
      if (appGrantId === '0') {
        this.appGrantEditFormGroup.reset();
      } else {
        this.appGrantService.getAppGrant(securityContext, appGrantId).subscribe(
            res => this.getAppGrantResponseCallback(res),
            err => this.stdAppGrantErrorCallback(err)
        );
      }

      this.showAuthUIComponents('system');
  }

  /*
   *
   */
  canDeactivate(): Observable<boolean> | boolean {
    this.logger.debug(this.cn + '.canDeactivate',
      'running');
    if (this.appGrantEditFormGroup.dirty  ) {
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
      for (const ctrl in this.appGrantEditFormGroup.controls) {
        console.log ('enbling' + ctrl)
        this.appGrantEditFormGroup.controls[ctrl].enable();
      }

    } else {
      for (const ctrl in Object.keys(this.appGrantEditFormGroup.controls)) {
        this.appGrantEditFormGroup.controls[ctrl].disable();
      }

    }
  }




  /*
   *
   */
  stdAppGrantErrorCallback (err: any): void {
    this.errorHandlerService.handleErrorCallback(
      this.cn, // component Name
      'stdAppGrantErrorCallback', //FunctionName
      err, // Error Object
      true // Notify User
    );
  }

  /*
   *
   */
  getAppGrantResponseCallback(response: AppGrant): void {
    if (response) {
      this.appGrantEditFormGroup.markAsPristine();
      this.logger.debug(this.cn + '.getAppGrantResponseCallback',
        'Successful getAppGrant Response');
        this.appGrantEditFormGroup.setValue(response);
        this.usrMsgService.pushMsg('App Grants Retrieved', 'INFO');
    } else {
      this.logger.debug('appGrantEditComponent.getAppGrantResponseCallback',
        'Unexpected GetAppGrant Response Code');
    }

  }

  /*
   *
   */
  attemptUpdate() {
      const securityContext = this.activatedRoute.snapshot.params['securitycontext'];
      this.appGrantService.putAppGrant(securityContext, this.appGrantEditFormGroup.value).subscribe(
          res => this.putAppGrantResponseCallback(res),
          err => this.stdAppGrantErrorCallback(err)
      );
  }

  /*
   *
   */
  putAppGrantResponseCallback(response: AppGrant): void {
    this.appGrantEditFormGroup.markAsPristine();
    const securityContext = this.activatedRoute.snapshot.params['securitycontext'];
    this.router.navigateByUrl(`/appgrants/${securityContext}`);
    this.logger.debug(this.cn + '.putAppGrantResponseCallback',
        'Successful putAppGrant Response');
    this.usrMsgService.pushMsg('App Grant Updated', 'INFO');
  }



  /*
   *
   */
  attemptCreate() {
      const securityContext = this.activatedRoute.snapshot.params['securitycontext'];
      this.appGrantService.postAppGrant(securityContext, this.appGrantEditFormGroup.value).subscribe(
          res => this.postAppGrantResponseCallback(res),
          err => this.stdAppGrantErrorCallback(err)
      );
  }

  /*
   *
   */
  postAppGrantResponseCallback(response: AppGrant): void {
    this.appGrantEditFormGroup.markAsPristine();
    const securityContext = this.activatedRoute.snapshot.params['securitycontext'];
    this.router.navigateByUrl(`/appgrants/${securityContext}`);
      this.logger.debug(this.cn + '.postAppGrantResponseCallback',
        'Successful postAppGrant Response');
    this.usrMsgService.pushMsg('App Grants Added', 'INFO');
  }

  /*
   *
   */
  attemptDelete() {
      const securityContext = this.activatedRoute.snapshot.params['securitycontext'];
      this.appGrantService.delAppGrant(securityContext, this.appGrantEditFormGroup.value).subscribe(
          res => this.delAppGrantResponseCallback(res),
          err => this.stdAppGrantErrorCallback(err)
      );
  }

  /*
   *
   */
  delAppGrantResponseCallback(response: number): void {
    this.appGrantEditFormGroup.markAsPristine();
    const securityContext = this.activatedRoute.snapshot.params['securitycontext'];
    this.router.navigateByUrl(`/appgrants/${securityContext}`);
      this.logger.debug(this.cn + '.delAppGrantResponseCallback',
        'Successful delAppGrant Response');
    this.usrMsgService.pushMsg('App Grants Deleted', 'INFO');
  }


}
