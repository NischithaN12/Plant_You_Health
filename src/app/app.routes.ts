import { Routes } from '@angular/router';
import { Login_Signup } from './Login_Signup/ls';

import { App } from './app';
import { Profile_SetupComponent } from './Profile_setup/ps';


export const routes = [
  {path: '', component: App },
   {path:'login', component: Login_Signup },
   {path:'profile', component: Profile_SetupComponent }

];