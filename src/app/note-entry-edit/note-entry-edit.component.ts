import {
  Component,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';

import {
  ActivatedRoute,
  Router
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
  MatTableModule,
  MatTableDataSource,
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material';

import { Log4ngService } from '../_service/log4ng.service';
import { UsrMsgService } from '../_service/usr-msg.service';
import { NoteEntryService } from '../_service/note-entry.service';
//import { FileStorageAWSService } from '../_service/file-storage-aws.service';
import { FileUploadService } from '../_service/file-upload.service';
import { ClientConfigService } from '../_service/client-config.service';
import { ErrorHandlerService } from '../_service/error-handler.service';
import { SessionService } from '../_service/session.service';

import { CloudFile } from '../_model/cloud-file';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';
import 'rxjs/add/operator/map';

import {
  INoteEntry,
  NoteEntry,
} from '../_model/note-entry';

import { GUIDStrip } from '../guid-strip.pipe';


import {
  DialogSimpleGenericComponent,
} from '../dialog-simple-generic/dialog-simple-generic.component';



@Component({
  selector: 'app-note-entry-edit',
  templateUrl: './note-entry-edit.component.html',
  styleUrls: ['./note-entry-edit.component.css']
})
export class NoteEntryEditComponent implements OnInit {

  private cn: string = 'NoteEntryEditComponent';
  public noteEntryAttachmentDataSource: MatTableDataSource<CloudFile>; // exposed to HTML
  public noteEntryEditFormGroup: FormGroup;
  private dirtyUploads: boolean;

  // UI Authorization Variables
  public userCanCreate = false;
  public userCanUpdate = false;
  public userCanDelete = false;
  public userCanEdit = false;
  public formEditMode = 'UPD';

  uploadedFiles: any[] = [];


  constructor(
    private logger: Log4ngService,
    private noteEntryService: NoteEntryService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private usrMsgService: UsrMsgService,
    private clientConfigService: ClientConfigService,
    //private fileStorageAWSService: FileStorageAWSService,
    private fileUploadService: FileUploadService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private sessionService: SessionService,
    private errorHandlerService: ErrorHandlerService,


  ) {
    // this.currentNoteEntry = new NoteEntry();
    this.logger.debug(this.cn + 'constructor', 'starting');
    this.noteEntryAttachmentDataSource = new MatTableDataSource();
    this.noteEntryEditFormGroup = this.formBuilder.group({
      label: [{value: '',  disabled: false}],
      tags: [{value: '',  disabled: false}],
      body: [{value: '',  disabled: false}],
      attachments: [{value: [],  disabled: false}],
      _id: [{value: '',  disabled: false}],
      createDate: [{value: '',  disabled: false}],
      createUser: [{value: '',  disabled: false}],
      updateDate: [{value: '',  disabled: false}],
      updateUser: [{value: '',  disabled: false}],
      securityContext: [{value: '',  disabled: false}],
    });

    this.logger.debug(this.cn + 'constructor', 'finished');


  }



  /*
   *
   */
  ngOnInit() {

      this.logger.debug(this.cn + '.ngOnInit', 'running');
      this.dirtyUploads = false;
      const noteEntryId = this.activatedRoute.snapshot.params['_id'];
      const securityContext = this.activatedRoute.snapshot.params['securitycontext'];
      if (noteEntryId === '0') {
          this.noteEntryEditFormGroup.reset();
          this.formEditMode = 'INS';
      } else {
        this.noteEntryService.getNoteEntry(securityContext, noteEntryId).subscribe(
            res => this.getNoteEntryResponseCallback(res),
            err => this.stdNoteEntryErrorCallback(err)
        );
        this.formEditMode = 'UPD';
      }
      this.showAuthUIComponents(securityContext);
      this.logger.debug(this.cn + '.ngOnInit', 'finished');

  }

  /*
   * Adjust UI with authorized actions, remove unauthorized activites
   */
  showAuthUIComponents(securityContext: string = 'DEFAULTDENY'): void {
    this.logger.debug(this.cn + '.showAuthUIComponents', 'running');
    this.userCanDelete = this.sessionService.isAuthorized(securityContext, 'DEL_NOTE_ENTRY');
    this.userCanCreate = this.sessionService.isAuthorized(securityContext, 'INS_NOTE_ENTRY');
    this.userCanUpdate = this.sessionService.isAuthorized(securityContext, 'UPD_NOTE_ENTRY');
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
    this.logger.debug(this.cn + '.enableFormControls', 'running');

    if (en) {
      for (const ctrl in this.noteEntryEditFormGroup.controls) {
        this.noteEntryEditFormGroup.controls[ctrl].enable();
      }

    } else {
      for (const ctrl in this.noteEntryEditFormGroup.controls) {
        this.noteEntryEditFormGroup.controls[ctrl].disable();
      }

    }
  }

  /*
   *
   */
  canDeactivate(): Observable<boolean> | boolean {
    this.logger.debug(this.cn + '.canDeactivate', 'running');
    if (this.noteEntryEditFormGroup.dirty || this.dirtyUploads ) {
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
   *
   */
  stdNoteEntryErrorCallback (err: any): void {
    this.errorHandlerService.handleErrorCallback(
      this.cn,
      'stdNoteEntryErrorCallback', // functionName
      err,
      true // Notify User
    );
  }



  /*
   *
   */
  getNoteEntryResponseCallback(response: NoteEntry): void {
    if (response) {
      this.logger.debug(this.cn + '.getNoteEntryResponseCallback',
        'Successful getNoteEntry Response');
        // this.currentNoteEntry  = response;
        this.noteEntryEditFormGroup.reset();
        if (typeof response['attachments'] == null) {
          response['attachments'] = [];
        }
        this.dirtyUploads = false;
        this.noteEntryEditFormGroup.patchValue(response);
        this.logger.debug(this.cn + '.getNoteEntryResponseCallback',
          'response: ' + response);
        this.noteEntryAttachmentDataSource.data = response['attachments'];
        this.noteEntryEditFormGroup.patchValue(response);


    } else {
      this.logger.debug('noteEntryEditComponent.getNoteEntryResponseCallback',
        'Unexpected GetNoteEntry Response Code');
    }

  }

  /*
   *
   */
  attemptUpdate() {
      const securityContext = this.activatedRoute.snapshot.params['securitycontext'];
      this.noteEntryEditFormGroup.value.attachments = this.noteEntryAttachmentDataSource.data;
      this.noteEntryService.putNoteEntry(securityContext, this.noteEntryEditFormGroup.value).subscribe(
          res => this.putNoteEntryResponseCallback(res),
          err => this.stdNoteEntryErrorCallback(err)
      );
  }

  /*
   *
   */
  putNoteEntryResponseCallback(response: NoteEntry): void {
    const securityContext = this.activatedRoute.snapshot.params['securitycontext'];
    this.noteEntryEditFormGroup.markAsPristine();
    this.dirtyUploads = false;
    this.router.navigateByUrl(`/noteentries/${securityContext}`);
    this.logger.debug(this.cn + '.putNoteEntryResponseCallback',
        'Successful putNoteEntry Response');
    this.usrMsgService.pushMsg('Note Entry Updated', 'INFO');
  }



  /*
   *
   */
  attemptCreate() {
      const securityContext = this.activatedRoute.snapshot.params['securitycontext'];
      console.warn('security Context:' + securityContext);
      this.noteEntryEditFormGroup.value['securityContext'] = securityContext;
      this.noteEntryEditFormGroup.value['attachments'] = this.noteEntryAttachmentDataSource.data;
      this.noteEntryService.postNoteEntry(securityContext, this.noteEntryEditFormGroup.value).subscribe(
          res => this.postNoteEntryResponseCallback(res),
          err => this.stdNoteEntryErrorCallback(err)
      );
  }

  /*
   *
   */
  postNoteEntryResponseCallback(response: NoteEntry): void {
    const securityContext = this.activatedRoute.snapshot.params['securitycontext'];
    this.noteEntryEditFormGroup.markAsPristine();
    this.dirtyUploads = false;
    this.router.navigateByUrl(`/noteentries/${securityContext}`);
      this.logger.debug(this.cn + '.postNoteEntryResponseCallback',
        'Successful postNoteEntry Response');
    this.usrMsgService.pushMsg('Note Entry Added', 'INFO');
  }

  /*
   *
   */
  attemptDelete() {
      const securityContext = this.activatedRoute.snapshot.params['securitycontext'];

      this.noteEntryService.delNoteEntry(securityContext, this.noteEntryEditFormGroup.value).subscribe(
          res => this.delNoteEntryResponseCallback(res),
          err => this.stdNoteEntryErrorCallback(err)
      );
  }

  /*
   *
   */
  delNoteEntryResponseCallback(response: number): void {
    const securityContext = this.activatedRoute.snapshot.params['securitycontext'];
    this.noteEntryEditFormGroup.markAsPristine();
    this.router.navigateByUrl(`/noteentries/${securityContext}`);
      this.logger.debug(this.cn + '.delNoteEntryResponseCallback',
        'Successful delNoteEntry Response');
    this.usrMsgService.pushMsg('Note Entry Deleted', 'INFO');
  }


  /*
   *
   */
  gcpDownloadFile(fileKey: string): void {
  }

  /*
   *
   */
  gcpDeleteFile(fileKey: string) {

  }




  /*
   *
   */
  onSuccessfulCloudDelete(data) {
    this.logger.debug(this.cn + '.onSuccessfulCloudDelete',
      'Successfully Deleted: ' + data.Key);

    let index: any ;
     for (index in this.noteEntryEditFormGroup.value.attachments) {
          if (this.noteEntryEditFormGroup.value.attachments[index]['fileReference'] === data.Key) {
            break;
          }
        }


    if (index > -1) {
       this.noteEntryEditFormGroup.value.attachments.splice(index, 1);
       this.noteEntryAttachmentDataSource.data = this.noteEntryEditFormGroup.value.attachments;
    }
    this.usrMsgService.pushMsg('File Deleted', 'INFO');
  }

  onErrorCloudDelete(error) {
    this.logger.debug(this.cn + '.onErrorCloudDelete',
      'received Error: ' + error);
      this.usrMsgService.pushMsg('File Delete Error', 'ERROR');
  }

  uploadFiles(event): void {
    for (let f of event.files){
      this.logger.debug(this.cn + '.uploadFiles', 'file:' + JSON.stringify(f));
      this.fileUploadService.uploadFile(f).subscribe(
          res => this.onSuccessfulUpload(res),
          err => this.onErrorUpload(err)
      );
    }
  }




  /*
   *
   */
  gcpUploadFiles(fileCandidate: File): void {
  }

  /*
   *
   */
  onFileUpload(event: any): void {
    this.logger.debug(this.cn + '.onFileUpload', 'event' + JSON.stringify(event) );

  }

  /*
   *
   */
  onSuccessfulUpload(data: any): void {

    if (this.noteEntryEditFormGroup.value['attachments'] == null) {
      this.noteEntryEditFormGroup.value.attachments = [];
    }
    this.dirtyUploads = true;

    delete data['createDate'];
    delete data['updateDate'];
    data['_idref'] = data['_id']['$oid'];
    delete data['_id'];
    this.noteEntryEditFormGroup.value.attachments.push(data);
    this.noteEntryAttachmentDataSource.data = this.noteEntryEditFormGroup.value.attachments;
    this.usrMsgService.pushMsg('File Upload Successful', 'INFO');
  }

  /*
   *
   */
  onErrorUpload(error: any): void {
    this.logger.debug(this.cn + '.onErrorUpload',
      'received Error: ' + error);
    this.usrMsgService.pushMsg('File Upload Error', 'ERROR');
  }


}
