import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  CanDeactivate,
} from '@angular/router';

// @Injectable({
//   providedIn: 'root'
// })

export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

export class SkipSaveGuardService implements CanDeactivate<CanComponentDeactivate> {
  private cn: String = 'SkipSaveGuardService';

  constructor() { }
  canDeactivate(component: CanComponentDeactivate,
           route: ActivatedRouteSnapshot,
           state: RouterStateSnapshot) {

     const url: string = state.url;
     return component.canDeactivate ? component.canDeactivate() : true;
  }
}
