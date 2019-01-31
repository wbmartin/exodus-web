import {
  Component,
  OnInit,
  AfterViewInit,
 } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';

import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  NgForm,
  FormControl,
} from '@angular/forms';

import { Log4ngService } from '../_service/log4ng.service';
import {
  Session,
  ISession
} from '../_model/session';

// import { Credentials } from '../_model/credentials';
import { AuthService } from '../_service/auth.service';
import { SessionService } from '../_service/session.service';
import { UsrMsgService } from '../_service/usr-msg.service';
import { ClientConfigService } from '../_service/client-config.service';
import { ErrorHandlerService } from '../_service/error-handler.service';





@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterViewInit {
  /*
   * Username and Password wrapper
   */
    public loginFormGroup: FormGroup;
    public gapi: any;
    public auth2: any;
    private cn: string = 'LoginComponent';




  /*
   * Inject dependencies
   */
  constructor(
    private logger: Log4ngService,
    private authService: AuthService,
    private router: Router,
    private sessionService: SessionService,
    private usrMsgService: UsrMsgService,
    private clientConfigService: ClientConfigService,
    private formBuilder: FormBuilder,
    private errorHandlerService: ErrorHandlerService,
    ) {
      this.loginFormGroup = this.formBuilder.group({
        username: [{value: '',  disabled: false}],
        passwd: [{value: '',  disabled: false}],

      });
      // this.testdiv.show = false;
    }

  /*
   * inherited function, set default values, initialize variables
   */
  ngOnInit() {
    /*this.loginFormGroup.setValue({
      'username': 'admin',
      'passwd': 'passwd2'
    });
    */


  }

  /*
   * wrapper for form submit.
   */
  onSubmit() {
  //  this.attemptLogin();
  }

  ngAfterViewInit () {
    this.logger.debug(this.cn + '.ngAfterViewInit',
      'running');
        this.googleInit();
  }

  /*
   * wrapper for check Credentials Service
   */
  attemptLogin(): void {
    this.logger.debug(this.cn + '.attemptLogin', 'running');
    this.authService.attemptLogin(this.loginFormGroup.value)
      .subscribe(
        res => this.loginResponseCallback(res),
        err => this.loginErrorCallback(err)
       );
  }

  /*
   *  Callbackfunction for Check Credentials Response
   */
  loginResponseCallback (response: boolean): void {
    if (response) {
        this.logger.debug(this.cn + '.loginAttemptResponseCallback',
          'Successful response Recd');
        this.loginFormGroup.patchValue({'passwd': ''});

          this.clientConfigService.getClientConfig('system').subscribe(
              res => this.getClientConfigResponseCallBack(res),
              err => this.getClientConfigErrorCallBack(err)
          );


        this.logger.debug(this.cn + '.loginAttemptResponseCallback',
            this.sessionService.getCurrentSession());
        this.logger.debug(this.cn + '.response',
              response);
        this.router.navigateByUrl('/dashboard/system');
        this.usrMsgService.clearMsgRegisters();
        this.usrMsgService.pushMsg('Credentials Accepted', 'INFO');

    } else {

      this.logger.debug(this.cn + '.loginAttemptResponseCallback',
        'Unexpected login Response Code');
    }
  }

  /*
   *  callback function for check credentials error
   */
  loginErrorCallback (err: any): void {
    this.errorHandlerService.handleErrorCallback(
      this.cn, // component Name
      'loginErrorCallback', //FunctionName
      err, // Error Object
      false // Notify User
    );
    this.loginFormGroup.patchValue({'passwd': ''});
    this.usrMsgService.pushDetailedMsg('Sorry, I didn\'t recognize those credentials', err, 'ERROR');
  }



  /*
   *
   */
  initPasswordReset(): void {
    this.authService.attemptInitPasswordReset(this.loginFormGroup.value)
      .subscribe(
        res => this.passwordResetResponseCallback(res),
        err => this.passwordResetErrorCallback(err)
       );
  }

  /*
   *  Callbackfunction for Check Credentials Response
   */
  passwordResetResponseCallback (response: boolean): void {
    if (response) {
      this.usrMsgService.pushMsg('We will send an email if that account exists.');
    } else {

      this.logger.debug('logincomponent.passwordResetAttemptResponseCallback',
        'Unexpected passwordReset Response Code');
    }
  }

  /*
   *  callback function for check credentials error
   */
  passwordResetErrorCallback (err: any): void {
    this.errorHandlerService.handleErrorCallback(
      this.cn, // component Name
      'loginErrorCallback', //FunctionName
      err, // Error Object
      true // Notify User
    );
  }


  /*
   *
   */
   attemptGoogleAuthLogin (): void {
     this.logger.debug(this.cn + '.attemptGoogleAuthLogin',
       'running');
   }

   onSignIn(googleUser): void {
      this.logger.debug(this.cn + '.onSignIn-googleuser',
        'running');
      const profile = googleUser.getBasicProfile();
      /*
      console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
      console.log('Name: ' + profile.getName());
      console.log('Image URL: ' + profile.getImageUrl());
      console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
      */
   }

   /*
    *
    */
   public googleInit() {
     this.logger.debug(this.cn + '.googleinit', 'running');
     this.logger.debug(this.cn + 'Note', 'unhandled exception comes from domain not whitelisted with google.');
     gapi.load('auth2', () => {
       this.auth2 = gapi.auth2.init({
         client_id: '878365194332-9n35knnjdpal53oeecn53fam2ergg87s.apps.googleusercontent.com',
         scope: 'profile email',
         ux_mode: 'redirect',
          redirect_uri: 'http://localhost:4200/googlelogin',
       });
       this.attachSignin(document.getElementById('googleAuthButton'));
     });
   }

   /*
    *
    */
   public attachSignin(element) {
     this.logger.debug(this.cn + '.attachSignin',
       'running');
     this.auth2.attachClickHandler(element, {},
       (googleUser) => {
         this.logger.debug(this.cn + '.attachSignin-clickhandler',
           'running');
         const profile = googleUser.getBasicProfile();
         /*
         console.log('Token || ' + googleUser.getAuthResponse().id_token);
         console.log('ID: ' + profile.getId());
         console.log('Name: ' + profile.getName());
         console.log('Image URL: ' + profile.getImageUrl());
         console.log('Email: ' + profile.getEmail());
         // YOUR CODE HERE
         */


       }, (error) => {
         alert(JSON.stringify(error, undefined, 2));
       });
   }

   /*
    *
    */
   getClientConfigResponseCallBack(res: any) {
     this.logger.debug(this.cn + '.getClientConfigResponseCallBack',
       'running');
     this.usrMsgService.pushMsg('Client Config Received', 'INFO');

   }

   /*
    *
    */
   getClientConfigErrorCallBack(err: any) {
     this.errorHandlerService.handleErrorCallback(
       this.cn, // component Name
       'getClientConfigErrorCallBack', //FunctionName
       err, // Error Object
       false // Notify User
     );

   }



}
