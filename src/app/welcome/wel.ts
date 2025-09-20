import { ChangeDetectionStrategy, Component, inject, signal, ViewChild } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

import { Profile_SetupComponent } from '../Profile_setup/ps';
import { act} from '../Activities/act';
import { Dashboard} from "../dashboard/dashboard";



@Component({
  selector: 'welcome',
  
    imports: [
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    RouterLink,
    Profile_SetupComponent,
    RouterModule,
    act,
    Dashboard
],
  templateUrl: './wel.html',
  styleUrls: ['./wel.css'],

})

export class Welcome{

  protected readonly title = signal('Frontend');

  isLinear = true;
  firstFormGroup: any;
  secondFormGroup: any;

  constructor(private router: Router, private _formBuilder: FormBuilder) {}
ngOnInit() {
  this.firstFormGroup = this._formBuilder.group({}); // no validators, always valid
  this.secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required]
  });
}
}