import { Routes } from '@angular/router';
import { Login_Signup } from './Login_Signup/ls';

import { App } from './app';
import { ProfileSetupComponent } from './ProfileSetup/ps';

export const routes = [
  {path: '', component: App },
   
  {path: 'login', component: Login_Signup },
  {path: 'profile', component: ProfileSetupComponent},

];