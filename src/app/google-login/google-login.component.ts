import { Component, OnInit } from '@angular/core';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import {
  GoogleLoginService,
} from '../_service/google-login.service';

import { Log4ngService } from '../_service/log4ng.service';
import { UsrMsgService } from '../_service/usr-msg.service';
import { SessionService } from '../_service/session.service';
import { ErrorHandlerService } from '../_service/error-handler.service';


import { IGoogleCreds, GoogleCreds } from '../_model/google-creds';

@Component({
  selector: 'app-google-login',
  templateUrl: './google-login.component.html',
  styleUrls: ['./google-login.component.css']
})
export class GoogleLoginComponent implements OnInit {
  // tslint:disable-next-line:max-line-length
  // http://localhost:4200/googlelogin#id_token=eyJhbGciOiJSUzI1NiIsImtpZCI6ImJhNGRlZDdmNWE5MjQyOWYyMzM1NjFhMzZmZjYxM2VkMzg3NjJjM2QifQ.eyJhenAiOiI4NzgzNjUxOTQzMzItY2UyMThudWYzYXBzNWpuMWxqbTJhdTR2anFoY3RpMmouYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI4NzgzNjUxOTQzMzItY2UyMThudWYzYXBzNWpuMWxqbTJhdTR2anFoY3RpMmouYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDQxMDI2OTc2MjE0NjI3NDczODkiLCJlbWFpbCI6IncuYnJhbmRvbi5tYXJ0aW5AZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImV4cCI6MTUxODI2MDg3OCwiaXNzIjoiYWNjb3VudHMuZ29vZ2xlLmNvbSIsImp0aSI6IjlkMTczNWJlM2I3M2Y1ZTJmZTg1YTJiYTUzYWFmNTIzYTlkZGRjNjQiLCJpYXQiOjE1MTgyNTcyNzh9.CXaNh8RPmsbMLP2b7viingdW8mkzGxPdkpB_PRubmxK8yB5nm2wWlX8Mux2nOqAbIZKZtKnf6peWTA3HckvIXvjbyL4FeGCbPxLpYBkgw3q1sHM28Eb9a_qYAtOl9M24mE2Fvn76RujIKVD6pqOgGH1rL0qT-hoDSn9NpXdz_2Wyfv75OeKBjxY2xcp-nx2Q99nhZMrnG4G2D6NCiF6Y4HMCF559h0Z3JWICrqmuz4aMbByunfJo1Ba1_fYLuufzQVjqeJ0MunTpfsKixjaR8EFcYVIzQvOny7UtBc7GSoVx-rGeJfMHM2F0sz9QgqhLVu1hlvBPFJdg38JRGUWRJg&login_hint=AJDLj6JUa8yxXrhHdWRHIV0S13cAEqEK8TD0optgKmr9cSxNr8Uf29zWUvJV-8L1-TXkhxKZBkSJcP257CU7-C86grtHb3tWxQ&client_id=878365194332-ce218nuf3aps5jn1ljm2au4vjqhcti2j.apps.googleusercontent.com
  private idToken: string;
  private clientId: string;
  private cn: string = 'GoogleLoginComponent';

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private googleLoginService: GoogleLoginService,
    private logger: Log4ngService,
    private sessionService: SessionService,
    private usrMsgService: UsrMsgService,
    private errorHandlerService: ErrorHandlerService,
  ) { }

  /*
   *
   */
  ngOnInit() {
    this.logger.debug('googlelogincomponent.ngOnInit',
      'running');
    // Note the idtoken and client id are in the fragment.
    // https://stackoverflow.com/questions/14707345/oauth2-query-string-vs-fragment
    const googlefragment = this.activatedRoute.snapshot.fragment.split('&');
    this.idToken = googlefragment[0].split('=')[1];
    this.clientId = googlefragment[1].split('=')[1];
    this.logger.debug('googlelogincomponent.ngOnInit',
      'token:' + this.idToken);
    const attempt = new GoogleCreds( this.idToken, this.clientId, );
    this.googleLoginService.attemptTokenExchange(attempt).subscribe(
        res => this.googleloginResponseCallback(res),
        err => this.googleloginErrorCallback(err)
       );


  }


  /*
   *  Callbackfunction for Check Credentials Response
   */
  googleloginResponseCallback (response: boolean): void {
    if (response) {
        this.logger.debug(this.cn + '.loginAttemptResponseCallback',
            this.sessionService.getCurrentSession());
        this.logger.debug(this.cn + '.response',
              response);
        this.router.navigateByUrl('/dashboard/system');
        this.usrMsgService.clearMsgRegisters();
    } else {
      this.logger.debug(this.cn + '.loginAttemptResponseCallback',
        'Unexpected login Response Code');
    }
  }

  /*
   *  callback function for check credentials error
   */
  googleloginErrorCallback (err: any): void {
    this.errorHandlerService.handleErrorCallback(
      this.cn, // component Name
      'logoutErrorCallback', //FunctionName
      err, // Error Object
      false // Notify User
    );
    this.usrMsgService.pushDetailedMsg('Sorry, I didn\'t recognize those credentials', err, 'ERROR');
  }

}
