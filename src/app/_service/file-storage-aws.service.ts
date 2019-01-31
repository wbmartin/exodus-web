import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';
import 'rxjs/add/operator/map';

import { Log4ngService } from '../_service/log4ng.service';
import { ClientConfigService } from '../_service/client-config.service';
import * as AWS from 'aws-sdk';
import { Guid } from 'guid-typescript';
import { CloudFile } from '../_model/cloud-file';

@Injectable({
  providedIn: 'root'
})

export class FileStorageAWSService {

  // private serviceUrl = `/api/v1/fileupload/system`;
  private cn: String = 'FileStorageServiceAWS';

  private  AWSService = AWS;
  private  region;
  private  bucketName;
  private  IdentityPoolId;
  private s3: any;

  constructor(
    private logger: Log4ngService,
    private clientConfigService: ClientConfigService,
    private http: HttpClient,

  ) {
    this.refreshConfig();
  }


  /*
   *
   */
  refreshConfig(): void {
    this.region = this.clientConfigService.cfg.AWS_Region;
    this.bucketName = this.clientConfigService.cfg.AWS_S3_BucketName;
    this.IdentityPoolId = this.clientConfigService.cfg.AWS_Cognito_IdentiyPoolId;

    this.AWSService.config.update({
      region: this.region,
      credentials: new this.AWSService.CognitoIdentityCredentials({
      IdentityPoolId: this.IdentityPoolId
      })
    });

    this.s3 = new this.AWSService.S3({
      apiVersion: '2006-03-01',
      params: { Bucket: this.bucketName}
    });


  }

  /*
   *
   */
  uploadFile(fileCandidate: File): Observable<any> {
    if (this.bucketName == null) {
      this.refreshConfig();
    }
    const uguid = Guid.create() + '/';
    const fguid: string  = uguid + fileCandidate.name;

    return new Observable (observer => {
      this.s3.upload({
        Key: fguid,
        Bucket: this.bucketName,
        Body: fileCandidate,
        ACL: 'private'
      }, function (err, data) {
        if (err) {
          console.warn('fileUpload Failing');
          throw(err);
        }
        observer.next(data);
        observer.complete();
      });

    } );
  }

  /*
   *
   */
  deleteFile(fileKey: string): Observable<any> {

    return new Observable (observer => {

      this.s3.deleteObject({
        Bucket: this.bucketName,
        Key: fileKey
      }, function(err, data) {
        if (err) {
          throw(err);
        }
        data.Key = fileKey;
        observer.next(data);
        observer.complete();
        });
      });
  }

  /*
   *
   */
  downloadFile(fileKey: string): Observable<any> {

    return new Observable (observer => {
      this.s3.getObject(
        {
          Bucket: this.bucketName,
          Key: fileKey
        },
        function (error, data) {
          if (error) {
            throw(error);
          }
          data.Key = fileKey;
          observer.next(data);
          observer.complete();
        });
        }
      );
  }











}



/*  component.ts functions

onSuccessfulCloudDownload(data) {
  const fileName = data.Key.substring(37);
  const link = document.createElement('a');
    const options = { type: data.ContentType };
    const blob = new Blob([data.Body], options);
    // Browsers that support HTML5 download attribute
    if (link.download !== undefined)         {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', fileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    this.usrMsgService.pushMsg('File Download Initiated', 'INFO');
}

onErrorCloudDownload(error) {
  this.logger.debug(this.cn + '.onErrorCloudDownload',
    'received Error: ' + error);
    this.usrMsgService.pushMsg('File Download Error', 'ERROR');

}


  awsUploadFiles(fileCandidate: File): void {
    this.fileStorageAWSService.uploadFile(fileCandidate).subscribe(
      data => this.onSuccessfulUpload(data),
      error => this.onErrorUpload(error)
    );
  }


onUpload(event) {
    for (const fileCandidate of event.files) {
      this.awsUploadFiles(fileCandidate);
    }
}

awsDownloadFile(fileKey: string): void {
  this.fileStorageAWSService.downloadFile(fileKey).subscribe(
    data => this.onSuccessfulCloudDownload(data),
    error => this.onErrorCloudDownload(error)
  );

}


awsDeleteFile(fileKey: string) {
  this.fileStorageAWSService.deleteFile(fileKey).subscribe(
    data => this.onSuccessfulCloudDelete(data),
    error => this.onErrorCloudDelete(error)
  );
}
*/
