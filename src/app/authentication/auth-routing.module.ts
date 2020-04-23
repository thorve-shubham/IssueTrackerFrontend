import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { UnauthService } from '../routeGuards/unauth.service';
import { SignUpComponent } from './sign-up/sign-up.component';

const routes: Routes = [
  { path: 'logIn', component: LoginComponent, canActivate: [UnauthService] },
  { path: 'signUp', component: SignUpComponent, canActivate: [UnauthService] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
