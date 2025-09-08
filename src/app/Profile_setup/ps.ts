import {Component} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';

/**
 * @title Toolbar overview
 */
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';


@Component({
  selector: 'Profile_Setup',
  templateUrl: 'ps.html',
  styleUrl: 'ps.css',
  imports: [MatIconModule, MatButtonModule, MatToolbarModule, RouterModule, FormsModule, MatFormFieldModule, MatInputModule]
})


export class Profile_SetupComponent {
 
 
}
