import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { CustomValidators } from 'src/app/components/registration/custom-validator';
import { FirebaseAuthService } from 'src/app/services/firebase-auth.service';
import { tap } from 'rxjs';
import { Router } from '@angular/router';
import { RegisterRequest } from 'src/app/interfaces/reglogin';

@Component({
  selector: 'app-register',
  templateUrl: './register2.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  registerForm = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    username: new FormControl(null, [Validators.required]),
    firstname: new FormControl(null, [Validators.required]),
    lastname: new FormControl(null, [Validators.required]),
    password: new FormControl(null, [Validators.required]),
    passwordConfirm: new FormControl(null, [Validators.required])
  },
    // add custom Validators to the form, to make sure that password and passwordConfirm are equal
    { validators: CustomValidators.passwordsMatching }
  )

  constructor(
    private router: Router,
    private authService: FirebaseAuthService
  ) { }

  async register() {
    if (!this.registerForm.valid) {
      return;
    }
    
    try {
      const formValues = this.registerForm.value;
      const displayName = `${formValues.firstname} ${formValues.lastname}`;
      
      await this.authService.signUpWithEmail(
        formValues.email!,
        formValues.password!,
        displayName
      );
      
      // Navigation is handled in the auth service
    } catch (error) {
      console.error('Registration error:', error);
      // Error handling is done in the auth service
    }
  }

}