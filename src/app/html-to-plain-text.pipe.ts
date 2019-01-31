import { Pipe, PipeTransform } from '@angular/core';
/*
 * https://stackoverflow.com/questions/17289448/angularjs-to-output-plain-text-instead-of-html
 * https://angular.io/guide/pipes
*/
@Pipe({name: 'htmlToPlainText'})
export class HtmlToPlainText implements PipeTransform {
  /*
   *
   */
  transform(htmltext: string): string {
    return  htmltext ? String(htmltext).replace(/<[^>]+>/gm, '') : '';
  }
}
