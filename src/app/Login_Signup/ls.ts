import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {MatIconModule, MatIconRegistry} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { MatToolbarModule, MatToolbar } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { merge } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

const Twitter = `
<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 24 24">
  <path d="M0 0h24v24H0z" fill="none"/>
  <path d="M22.46 6c-.77.35-1.6.59-2.46.7a4.3 4.3 0 001.88-2.38 8.59 8.59 0 01-2.72 1.04 4.28 4.28 0 00-7.3 3.9 12.13 12.13 0 01-8.8-4.46 4.28 4.28 0 001.33 5.72 4.25 4.25 0 01-1.94-.54v.06a4.28 4.28 0 003.43 4.2 4.3 4.3 0 01-1.93.07 4.28 4.28 0 003.99 2.97A8.59 8.59 0 012 19.54a12.1 12.1 0 006.56 1.92c7.88 0 12.2-6.53 12.2-12.2 0-.19 0-.39-.01-.58A8.63 8.63 0 0022.46 6z"/>
</svg>
`;
const Google = `
<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 24 24">
  <path d="M0 0h24v24H0z" fill="none"/>
  <path d="M21.35 11.1H12v2.9h5.3c-.3 1.6-1.2 2.9-2.6 3.7-1 .6-2.3.9-3.7.7-2.6-.4-4.6-2.6-4.6-5.3 0-3 2.4-5.4 5.4-5.4 1.5 0 2.8.6 3.7 1.5l2.2-2.2C16.2 5.3 14.2 4.5 12 4.5 7.6 4.5 4 8.1 4 12.5s3.6 8 8 8c4.7 0 8-3.3 8-8 0-.5-.1-1-.2-1.4z"/>
</svg>
`;
/**
 * @title Toolbar overview
 */
@Component({
  selector: 'Login_Signup',
  templateUrl: 'ls.html',
  styleUrls: ['ls.css'],
  imports: [MatFormFieldModule, MatButtonModule,MatInputModule, MatIconModule, MatToolbar,FormsModule, ReactiveFormsModule]
  
})
export class Login_Signup {
     readonly email = new FormControl('', [Validators.required, Validators.email]);

  errorMessage = signal('');

  constructor(
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {
    merge(this.email.statusChanges, this.email.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());

    this.iconRegistry.addSvgIconLiteral('Google', this.sanitizer.bypassSecurityTrustHtml(Google));
    this.iconRegistry.addSvgIconLiteral('Twitter', this.sanitizer.bypassSecurityTrustHtml(Twitter));
  }

  updateErrorMessage() {
    if (this.email.hasError('required')) {
      this.errorMessage.set('You must enter a value');
    } else if (this.email.hasError('email')) {
      this.errorMessage.set('Not a valid email');
    } else {
      this.errorMessage.set('');
    }
}

  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

}
