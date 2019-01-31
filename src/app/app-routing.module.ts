import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { AuthRouteGuardService } from './_service/auth-route-guard.service';

import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { AccessDeniedComponent } from './access-denied/access-denied.component';
import { GoogleLoginComponent } from './google-login/google-login.component';

import { UserListComponent } from './user-list/user-list.component';
import { UserEditComponent } from './user-edit/user-edit.component';

import { NoteEntryListComponent } from './note-entry-list/note-entry-list.component';
import { NoteEntryEditComponent } from './note-entry-edit/note-entry-edit.component';

import { AppGrantListComponent } from './app-grant-list/app-grant-list.component';
import { AppGrantEditComponent } from './app-grant-edit/app-grant-edit.component';

import { SecurityContextListComponent } from './security-context-list/security-context-list.component';
import { SecurityContextEditComponent } from './security-context-edit/security-context-edit.component';


import { UserGroupListComponent } from './user-group-list/user-group-list.component';
import { UserGroupEditComponent } from './user-group-edit/user-group-edit.component';

import { PasswordResetComponent } from './password-reset/password-reset.component';
import { UsrMsgHistoryComponent } from './usr-msg-history/usr-msg-history.component';
import { SkipSaveGuardService } from './_service/skip-save-guard.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'dashboard/:securitycontext',
    component: DashboardComponent,
    canActivate: [AuthRouteGuardService],
    data: {
      grantRequired: 'LOGON',
    }
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'users/:securitycontext',
    component: UserListComponent,
    canActivate: [AuthRouteGuardService],
    data: {
      grantRequired: 'USER_ADMIN',
    }
  },
  {
    path: 'users/:securitycontext/:userid',
    component: UserEditComponent,
    canActivate: [AuthRouteGuardService],
    canDeactivate: [SkipSaveGuardService],
    data: {
      grantRequired: 'USER_ADMIN',
    }
  },
  {
    path: 'usergroups/:securitycontext',
    component: UserGroupListComponent,
    canActivate: [AuthRouteGuardService],
    data: {
      grantRequired: 'USER_ADMIN',
    }
  },
  {
    path: 'usergroups/:securitycontext/:usergroupid',
    component: UserGroupEditComponent,
    canActivate: [AuthRouteGuardService],
    canDeactivate: [SkipSaveGuardService],
    data: {
      grantRequired: 'USER_ADMIN',
    }
  },
  {
    path: 'securitycontexts/:securitycontext',
    component: SecurityContextListComponent,
    canActivate: [AuthRouteGuardService],
    data: {
      grantRequired: 'SEC_CONTEXT_ADMIN',
    }
  },
  {
    path: 'securitycontexts/:securitycontext/:securitycontextid',
    component: SecurityContextEditComponent,
    canActivate: [AuthRouteGuardService],
    canDeactivate: [SkipSaveGuardService],
    data: {
      grantRequired: 'SEC_CONTEXT_ADMIN',

    }
  },



  {
    path: 'noteentries/:securitycontext',
    component: NoteEntryListComponent,
    canActivate: [AuthRouteGuardService],
    data: {
      grantRequired: 'SEL_NOTE_ENTRY',
    }
  },
  {
    path: 'noteentries/:securitycontext/:_id',
    component: NoteEntryEditComponent,
    canActivate: [AuthRouteGuardService],
    canDeactivate: [SkipSaveGuardService],
    data: {
      grantRequired: 'SEL_NOTE_ENTRY', // edit checks occur when edit attempted
    }
  },

  {
    path: 'appgrants/:securitycontext',
    component: AppGrantListComponent,
    canActivate: [AuthRouteGuardService],
    data: {
      grantRequired: 'SEL_APP_GRANT',
    }
  },
  {
    path: 'appgrants/:securitycontext/:_id',
    component: AppGrantEditComponent,
    canActivate: [AuthRouteGuardService],
    canDeactivate: [SkipSaveGuardService],
    data: {
      grantRequired: 'SEL_APP_GRANT', // edit checks occur when edit attempted
    }
  },


  {
    path: 'usrmsghistory/:securitycontext',
    component: UsrMsgHistoryComponent,
    canActivate: [AuthRouteGuardService],
    data: {
      grantRequired: 'LOGON',
    }
  },
  {
    path: 'passwordreset/:resettoken',
    component: PasswordResetComponent,
  },
  {
    path: 'googlelogin',
    component: GoogleLoginComponent,
  },
  {
    path: 'access-denied',
    component: AccessDeniedComponent
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, { enableTracing: false }) ],
  exports: [ RouterModule ],
  providers: [ SkipSaveGuardService, ],
  declarations: []
})
export class AppRoutingModule { }
