import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';


import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';
import 'rxjs/add/operator/map';

import { INoteEntry, NoteEntry } from '../_model/note-entry';
import { Log4ngService } from '../_service/log4ng.service';

@Injectable(
  {
    providedIn: 'root'
  }
)
export class NoteEntryService {
  private serviceUrl = `/api/v1/noteentries`;
  public noteEntryListResult: Array<NoteEntry>;
  public noteEntryResult: NoteEntry;
  private cn: String = 'NoteEntryService';

  constructor(
    private logger: Log4ngService,
    private http: HttpClient,
  ) { }

  /*
   *
   */
  getNoteEntryList(securityContext: string): Observable<INoteEntry[]> {
    const url = `${this.serviceUrl}/${securityContext}`;
    // return full HTTP response triggered by anon observe object below
    this.logger.debug(this.cn + '.getNoteEntryList', 'executing');
    return this.http.get (url, {observe: 'response'})
      .map( res => {
        this.logger.debug(this.cn + '.getNoteEntryList', 'mapping');
        this.noteEntryListResult = <INoteEntry[]> res.body;
        return (this.noteEntryListResult);
      });

  }

  /*
   *
   */
  getNoteEntry(securityContext: string, noteEntryId: string, ): Observable<INoteEntry> {
    const url = `${this.serviceUrl}/${securityContext}/${noteEntryId}`;
    // return full HTTP response triggered by anon observe object below
    this.logger.debug(this.cn + '.getNoteEntry', 'executing');
    return this.http.get (url, {observe: 'response'})
      .map( res => {
        this.noteEntryResult = <INoteEntry> res.body;
        return (this.noteEntryResult);
      });

  }

  /*
   *
   */
  putNoteEntry(securityContext: string, noteEntryObj: NoteEntry): Observable<INoteEntry> {
    const url = `${this.serviceUrl}/${securityContext}`;
    // return full HTTP response triggered by anon observe object below
    this.logger.debug(this.cn + '.putNoteEntry', 'executing');
    return this.http.put(url, noteEntryObj, {observe: 'response'})
      .map( res => {
                    this.noteEntryResult = <INoteEntry> res.body;
                    return (this.noteEntryResult);
            }
          );
  }

  /*
   *
   */
  postNoteEntry(securityContext: string, noteEntryObj: NoteEntry): Observable<INoteEntry> {
    const url = `${this.serviceUrl}/${securityContext}`;
    // return full HTTP response triggered by anon observe object below
    this.logger.debug(this.cn + '.delNoteEntry', 'executing');
    return this.http.post(url, noteEntryObj, {observe: 'response'})
      .map( res => {
        this.noteEntryResult = <INoteEntry> res.body;
        return (this.noteEntryResult);
      });
  }

  /*
   *
   */
  delNoteEntry(securityContext: string, noteEntryObj: NoteEntry): Observable<number> {
    const url = `${this.serviceUrl}/${securityContext}/${noteEntryObj['_id']['$oid']}`;
    // return full HTTP response triggered by anon observe object below
    this.logger.debug(this.cn + '.delNoteEntry', 'executing');
    return this.http.delete(url, {observe: 'response'})
      .map( res => {
        return (res.status);
      });
  }




}
