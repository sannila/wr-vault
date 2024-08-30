import { Routes } from '@angular/router';
import { IndexComponent } from './pages/index/index.component';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { UserComponent } from './pages/user/user.component';

export const routes: Routes = [
    {path: '', redirectTo: 'index', pathMatch: 'full'},
    {path: 'index', component: IndexComponent},
    {path: 'sign-in', component: SignInComponent},
    {path: 'user', component: UserComponent},
];
