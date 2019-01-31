import { Injectable } from '@angular/core';

@Injectable()
export class Log4ngService {
  /*
  * 1 - Error
  * 2 - Warn
  * 3 - info
  * 4 - debug
  * 5 - log
  */
  public logLevel: number;
  constructor() {
    this.logLevel = 2;
  }
  /*
   *
   */

  debug(loc: string, msg: any, obj?: any): void {
    if ( this.logLevel <= 4 ) {
      if ( typeof msg !== 'string' ) {
        msg = JSON.stringify(msg);
      }
      console.log (new Date().toISOString() + ' DEBUG: ' + msg + ' (' + loc + ')');
      if (obj) {
        console.log(obj);
      }
    }
  }

}
