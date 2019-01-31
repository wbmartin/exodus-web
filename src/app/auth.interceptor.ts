import {Injectable} from '@angular/core';
import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor
} from '@angular/common/http';
import {HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import { SessionService } from './_service/session.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private sessionService: SessionService) {
    }

    /*
     *
     */
    intercept(req: HttpRequest<any>,
               next: HttpHandler): Observable<HttpEvent<any>> {
        const clonedRequest = req.clone(
          {
            headers: req.headers.set(
                'X-CSRF', this.sessionService.csrfToken
                )
          });
        return next.handle(clonedRequest);
    }
}
