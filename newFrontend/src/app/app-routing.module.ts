import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';

import {LoginComponent} from './login/login.component';
import { SignupComponent } from './signup/signup.component';

const routes: Routes = [
  { path:'login', component: LoginComponent},
  { path:'register', component: SignupComponent},
  { path:'dashboard', component: DashboardComponent},
  { path:'**', redirectTo: 'login'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
