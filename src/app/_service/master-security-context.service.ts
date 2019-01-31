import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { Log4ngService } from './log4ng.service';

@Injectable({
  providedIn: 'root'
})
export class MasterSecurityContextService {


  public currentMasterSecurityContext$;
  private currentMasterSecurityContext: string;
  private currentMasterSecurityContextSource: Subject<any>;
  private cn: string = 'MasterSecurityContextService';

  constructor(
    private logger: Log4ngService,
  ) {
    this.currentMasterSecurityContextSource = new Subject<any>();
    this.currentMasterSecurityContext$ = this.currentMasterSecurityContextSource.asObservable();
    this.currentMasterSecurityContext = 'INITIALIZING';

  }


  /*
   *
   */
  setCurrentMasterSecurityContext(newSecurityContext: string) {
    this.logger.debug(this.cn + '.setCurrentMasterSecurityContext', 'Setting MasterSecurityContext' + newSecurityContext);
    if (newSecurityContext !== this.currentMasterSecurityContext) {
      this.currentMasterSecurityContext = newSecurityContext;
      this.currentMasterSecurityContextSource.next(newSecurityContext);
    }
  }

  /*
   *
   */
  getCurrentMasterSecurityContext(): string {
    return this.currentMasterSecurityContext;
  }
}
