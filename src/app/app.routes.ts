import { Routes } from '@angular/router';


import { App } from './app';
import { ProfileSetupComponent } from './Profile_setup/ps';

export const routes = [
  {path: '', component: App },

  {path: 'profile', component: ProfileSetupComponent},

];
