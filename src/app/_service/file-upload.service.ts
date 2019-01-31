import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';
import 'rxjs/add/operator/map';

import { ICloudFile, CloudFile } from '../_model/cloud-file';

import { Log4ngService } from '../_service/log4ng.service';

@Injectable()
export class FileUploadService {

  private serviceUrl = `/api/v1/fileupload/system`;
  private cn: String = 'FileUploadService';

  constructor(
    private logger: Log4ngService,
    private http: HttpClient,

  ) {
    this.logger.debug(this.cn + 'constructor', 'running');

  }


  /*
   *
   */
  uploadFile(file: File): Observable<ICloudFile> {
          this.logger.debug(this.cn + 'constructor', 'uploadFile');

          const formData: FormData = new FormData();
          this.logger.debug(this.cn + '.uploadFile', 'filename' + file.name);
          formData.append('uploadCandidate', file, file.name);
          const headers = new Headers();
          /** No need to include Content-Type in Angular 4 */
          headers.append('Content-Type', 'multipart/form-data');
          headers.append('Accept', 'application/json');
          return this.http.post(this.serviceUrl, formData,  {observe: 'response'})
              .map(res => {
                            this.logger.debug(this.cn + '.uploadFile', 'running');
                            return <ICloudFile> res.body;
                          }
              )


    }

}
