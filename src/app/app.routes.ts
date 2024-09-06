import { Routes } from '@angular/router';
import { IndexComponent } from './pages/index/index.component';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { UserComponent } from './pages/user/user.component';
import { AuditLogsComponent } from './pages/audit-logs/audit-logs.component';
import { PasswordsComponent } from './pages/passwords/passwords.component';

export const routes: Routes = [
    {path: '', redirectTo: 'index', pathMatch: 'full'},
    {path: 'index', component: IndexComponent},
    {path: 'sign-in', component: SignInComponent},
    {path: 'user', component: UserComponent},
    {path: 'audit-log', component: AuditLogsComponent},
    {path: 'password', component: PasswordsComponent},
];
