import { Pipe, PipeTransform } from '@angular/core';
/*
 * https://stackoverflow.com/questions/17289448/angularjs-to-output-plain-text-instead-of-html
 * https://angular.io/guide/pipes
*/
@Pipe({name: 'guidStrip'})
export class GUIDStrip implements PipeTransform {
  /*
   *
   */
  transform(guidfp: string): string {
    return  guidfp.substring(37);
  }
}
