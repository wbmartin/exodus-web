import {
  Component,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import { Observable } from 'rxjs/Observable';

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

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import { PasswordResetRequest } from '../_model/password-reset-request';
import { AuthService } from '../_service/auth.service';
import { SessionService } from '../_service/session.service';
import { UsrMsgService } from '../_service/usr-msg.service';
import { ErrorHandlerService } from '../_service/error-handler.service';

import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent implements OnInit {
  /*
   * Username and Password wrapper
   */
  // @Input() passwordResetRequest: PasswordResetRequest;
  public passwordResetRequestFormGroup: FormGroup;
  private cn: string = 'PasswordResetComponent';
  /*
   * Inject dependencies
   */
  constructor(
    private logger: Log4ngService,
    private authService: AuthService,
    private router: Router,
    private sessionService: SessionService,
    private usrMsgService: UsrMsgService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private errorHandlerService: ErrorHandlerService,
    ) {
      // this.passwordResetRequest = new PasswordResetRequest();
      this.passwordResetRequestFormGroup = this.formBuilder.group({

        passwd: [{value: '',  disabled: false}],
        confirmPasswd: [{value: '',  disabled: false}],
        resetToken: [{value: '',  disabled: false}],
        body: [{value: '',  disabled: false}],


      });
    }

  /*
   * inherited function, set default values, initialize variables
   */
  ngOnInit() {


  }
  /*
   * wrapper for check Credentials Service
   */
  attemptChangePassword(): void {
    if (this.passwordResetRequestFormGroup.value['passwd'] === this.passwordResetRequestFormGroup.value['confirmPasswd']) {
      this.passwordResetRequestFormGroup.patchValue({'resetToken': this.activatedRoute.snapshot.params['resettoken']});
      this.authService.attemptChangePassword(this.passwordResetRequestFormGroup.value)
        .subscribe(
          res => this.changePasswordResponseCallback(res),
          err => this.changePasswordErrorCallback(err)
         );
    } else {
      this.usrMsgService.pushMsg('Oops, those passwords don\'t match.');
    }

  }

  /*
   *  Callbackfunction for Check passwordResetRequest Response
   */
  changePasswordResponseCallback (response: boolean): void {
    if (response) {
        this.logger.debug(this.cn + '.response',
          response
        );
        this.router.navigateByUrl('/login');
        this.usrMsgService.pushMsg('Password Changed', 'INFO');
    } else {

      this.logger.debug(this.cn + '.changePasswordAttemptResponseCallback',
        'Unexpected changePassword Response Code');
    }
  }

  /*
   *  callback function for check passwordResetRequest error
   */
  changePasswordErrorCallback (err: any): void {
    this.errorHandlerService.handleErrorCallback(
      this.cn, // component Name
      'changePasswordErrorCallback', //FunctionName
      err, // Error Object
      false // Notify User
    );
    this.usrMsgService.pushDetailedMsg('Sorry, Something went wrong changing that password.', err, 'ERROR');
  }

  /*
   * wrapper for form submit.
   */
  onSubmit() {

  }



}
