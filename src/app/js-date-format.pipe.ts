import { Pipe, PipeTransform } from '@angular/core';
/*
 * https://stackoverflow.com/questions/17289448/angularjs-to-output-plain-text-instead-of-html
 * https://angular.io/guide/pipes
*/
@Pipe({name: 'JSDateFormat'})
export class JSDateFormat implements PipeTransform {
  /*
   *
   */
  transform(ts: string): string {
    return new Date(ts).toString() ;
  }
}
