import {Input,
} from '@angular/core';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

import { MatInputModule, } from '@angular/material/input';
import { MatButtonModule, } from '@angular/material/button';
import {
  MatIconModule,
  MatToolbarModule,
  MatSidenavModule,
  MatListModule,
  MatTableModule,
  MatTableDataSource,
  MatSelectModule,
  MatDialogModule,
} from '@angular/material';

import { MatExpansionModule } from '@angular/material/expansion';

import { HttpClientModule} from '@angular/common/http';


import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';

import { LoginComponent } from './login/login.component';
import { AuthService } from './_service/auth.service';
import { AuthRouteGuardService } from './_service/auth-route-guard.service';
import { Log4ngService } from './_service/log4ng.service';

import { HtmlToPlainText } from './html-to-plain-text.pipe';
import { GUIDStrip } from './guid-strip.pipe';
import { JSDateFormat } from './js-date-format.pipe';

import { DashboardComponent } from './dashboard/dashboard.component';
import { AccessDeniedComponent } from './access-denied/access-denied.component';

import { UserListComponent } from './user-list/user-list.component';
import { UserService } from './_service/user.service';
import { UserEditComponent } from './user-edit/user-edit.component';

import { NoteEntryListComponent } from './note-entry-list/note-entry-list.component';
import { NoteEntryEditComponent } from './note-entry-edit/note-entry-edit.component';
import { NoteEntryService } from './_service/note-entry.service';

//import { FileStorageAWSService } from './_service/file-storage-aws.service';
import { FileUploadService } from './_service/file-upload.service';
import { ClientConfigService } from './_service/client-config.service';

import { MasterSecurityContextService } from './_service/master-security-context.service';
import { MasterSecurityContextComponent } from './master-security-context/master-security-context.component';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import { SessionService } from './_service/session.service';
import { SessionRefreshService } from './_service/session-refresh.service';
import { GoogleLoginService } from './_service/google-login.service';

import { ErrorHandlerService } from './_service/error-handler.service';





import {
  EditorModule,
  FileUploadModule,
} from 'primeng/primeng';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FooterComponent } from './footer/footer.component';
import { UsrMsgComponent } from './usr-msg/usr-msg.component';
import { UsrMsgService } from './_service/usr-msg.service';
import { UsrMsgHubService } from './_service/usr-msg-hub.service';


import { SecurityContextListComponent } from './security-context-list/security-context-list.component';
import { SecurityContextService } from './_service/security-context.service';
import { SecurityContextEditComponent } from './security-context-edit/security-context-edit.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { UsrMsgHistoryComponent } from './usr-msg-history/usr-msg-history.component';
import { GoogleLoginComponent } from './google-login/google-login.component';

import { GroupGrantService } from './_service/group-grant.service';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { SkipSaveGuardService } from './_service/skip-save-guard.service';
import { UserGroupListComponent } from './user-group-list/user-group-list.component';
import { UserGroupEditComponent } from './user-group-edit/user-group-edit.component';

import { AppGrantListComponent } from './app-grant-list/app-grant-list.component';
import { AppGrantEditComponent } from './app-grant-edit/app-grant-edit.component';
import { AppGrantService } from './_service/app-grant.service';
import { DialogSimpleGenericComponent } from './dialog-simple-generic/dialog-simple-generic.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    AccessDeniedComponent,
    UserListComponent,
    UserEditComponent,
    FooterComponent,
    UsrMsgComponent,
    SecurityContextListComponent,
    SecurityContextEditComponent,
    NoteEntryListComponent,
    NoteEntryEditComponent,
    HtmlToPlainText,
    GUIDStrip,
    JSDateFormat,
    PasswordResetComponent,
    UsrMsgHistoryComponent,
    GoogleLoginComponent,
    UserGroupListComponent,
    UserGroupEditComponent,
    AppGrantListComponent,
    AppGrantEditComponent,
    DialogSimpleGenericComponent,
    MasterSecurityContextComponent

  ],
  imports: [
    BrowserModule,
    FormsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    MatInputModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule,
    MatToolbarModule,
    MatSidenavModule,
    MatSidenavModule,
    MatListModule,
    MatTableModule,
    MatSelectModule,
    EditorModule,
    FileUploadModule,
    DragDropModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatExpansionModule,




  ],
  providers: [
    Log4ngService,
    AuthService,
    GoogleLoginService,
    AuthRouteGuardService,
    UserService,
    SessionRefreshService,
    SessionService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    UsrMsgService,
    UsrMsgHubService,
    SecurityContextService,
    NoteEntryService,
    //FileStorageAWSService,
    FileUploadService,
    GroupGrantService,
    SkipSaveGuardService,
    ClientConfigService,
    AppGrantService,
    MasterSecurityContextService,
    ErrorHandlerService

  ],
  bootstrap: [AppComponent],
  entryComponents: [
    UsrMsgComponent,
    DialogSimpleGenericComponent,
  ]
})
export class AppModule {
  @Input() currentSecurityContext: string;
  constructor(

  ) {
    this.currentSecurityContext = 'system';
  }
}
