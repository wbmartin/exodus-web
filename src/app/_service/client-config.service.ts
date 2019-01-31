import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';


import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';
import 'rxjs/add/operator/map';

import { IClientConfig, ClientConfig } from '../_model/client-config';
import { Log4ngService } from '../_service/log4ng.service';

@Injectable(
  {
    providedIn: 'root'
  }
)
export class ClientConfigService {
  private serviceUrl = '/api/v1/clientconfig';
  public cfg: ClientConfig;
  private cn: String = 'ClientConfigService';

  constructor(
    private logger: Log4ngService,
    private http: HttpClient,
  ) {
    this.cfg = new ClientConfig();
  }

  /*
   *
   */
  getClientConfig(securityContext: string): Observable<IClientConfig> {
    const url = `${this.serviceUrl}/${securityContext}`;

    this.logger.debug(this.cn + '.getClientConfig', 'executingXX' + url);
    return this.http.get (url, {observe: 'response'})
      .map( res => {
        this.logger.debug(this.cn + '.getClientConfig', '******************mapping');
        this.cfg = <IClientConfig> res.body;
        return (this.cfg);
      });

  }






}
