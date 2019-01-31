import { Component, OnInit } from '@angular/core';

import { Log4ngService } from '../_service/log4ng.service';
import { UsrMsgService } from '../_service/usr-msg.service';
import { SessionService } from '../_service/session.service';
// import { FooterComponent } from '../footer/footer.component';
import { NoteEntryService } from '../_service/note-entry.service';
import { MasterSecurityContextService } from '../_service/master-security-context.service';
import { ErrorHandlerService } from '../_service/error-handler.service';


import { NoteEntry, INoteEntry } from '../_model/note-entry';
import { Router } from '@angular/router';
import {
  MatTableModule,
  MatTableDataSource,
} from '@angular/material';

@Component({
  selector: 'app-note-entry-list',
  templateUrl: './note-entry-list.component.html',
  styleUrls: ['./note-entry-list.component.css']
})
export class NoteEntryListComponent implements OnInit {

  private noteEntryList: Array<NoteEntry>;
  public noteEntryDataSource: MatTableDataSource<NoteEntry>; // exposed to HTML
  private cn: string = 'NoteEntryListComponent';
  public masterSecurityContext: string;
  public userCanCreate = false;

  constructor(
    private logger: Log4ngService,
    private noteEntryService: NoteEntryService,
    public sessionService: SessionService, // exposed to HTML
    private usrMsgService: UsrMsgService,
    private router: Router,
    private masterSecurityContextService: MasterSecurityContextService,
    private errorHandlerService: ErrorHandlerService,
  ) {
      this.noteEntryDataSource = new MatTableDataSource();
      this.masterSecurityContext = this.masterSecurityContextService.getCurrentMasterSecurityContext();

  }

  ngOnInit() {
    this.masterSecurityContext = this.masterSecurityContextService.getCurrentMasterSecurityContext();
    this.noteEntryService.getNoteEntryList(this.masterSecurityContext).subscribe(
      res => this.getNoteEntryListResponseCallback(res),
      err => this.getNoteEntryListErrorCallback(err)
     );
    this.showAuthUIComponents(this.masterSecurityContext);


  }

  /*
   *  Show hide UI components based on authorization
   */
  showAuthUIComponents(securityContext: string = 'DEFAULTDENY'): void {
    this.userCanCreate = this.sessionService.isAuthorized(securityContext, 'INS_NOTE_ENTRY');
  }

  /*
   *  Callbackfunction for Check Credentials Response
   */
  getNoteEntryListResponseCallback (response: Array<NoteEntry>): void {
    if (response) {
      this.logger.debug(this.cn + '.getNoteEntryListResponseCallback',
        'Successfuls getNoteEntryList Response');
        this.noteEntryList = response;
        this.noteEntryDataSource.data = this.noteEntryList;
    } else {
      this.logger.debug(this.cn + '.getNoteEntryListResponseCallback',
        'Unexpected GetNoteEntryList Response Code');
    }
  }

  /*
   *  callback function for check credentials error
   */
  getNoteEntryListErrorCallback (err: any): void {
    this.errorHandlerService.handleErrorCallback(
      this.cn, // component Name
      'getNoteEntryListErrorCallback', //FunctionName
      err, // Error Object
      true // Notify User
    );
  }

  /*
   *
   */
  createNewNoteEntry(): void {
    this.router.navigateByUrl('/noteentries/' + this.masterSecurityContext + '/0');
  }


}
