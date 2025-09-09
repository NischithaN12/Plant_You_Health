import { Routes } from '@angular/router';
import { Login_Signup } from './Login_Signup/ls';

import { App } from './app';
import { Profile_SetupComponent } from './Profile_setup/ps';
import { Welcome } from './welcome/wel';
import { Component } from '@angular/core';
import { ActivitieSComponent } from './Activities/act';


export const routes = [
  
  {path: 'welcome', component: Welcome },
  { path: 'login', component: Login_Signup },
  {path: 'profile', component: Profile_SetupComponent},
  

];