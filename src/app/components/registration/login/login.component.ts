import { Component, OnInit, OnDestroy } from '@angular/core';
import { FirebaseAuthService } from 'src/app/services/firebase-auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    rememberMe: new FormControl(false)
  });

  resetEmailForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });

  isLoading = false;
  showResetPassword = false;
  returnUrl = '/home';
  hidePassword = true;
  
  private subscriptions = new Subscription();

  constructor(
    private authService: FirebaseAuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Get return URL from route parameters or default to '/home'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
    
    // Check if user is already authenticated
    const authSub = this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.router.navigate([this.returnUrl]);
      }
    });
    
    this.subscriptions.add(authSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  /**
   * Handle email/password login
   */
  async onLogin(): Promise<void> {
    if (this.loginForm.valid && !this.isLoading) {
      this.isLoading = true;
      
      try {
        const { email, password } = this.loginForm.value;
        await this.authService.signInWithEmail(email, password);
        
        // Navigation is handled in the auth service
        // Reset form
        this.loginForm.reset();
        
      } catch (error) {
        console.error('Login error:', error);
        // Error handling is done in the auth service
      } finally {
        this.isLoading = false;
      }
    } else {
      this.markFormGroupTouched(this.loginForm);
    }
  }

  /**
   * Handle Google sign in
   */
  async onGoogleSignIn(): Promise<void> {
    if (!this.isLoading) {
      this.isLoading = true;
      
      try {
        await this.authService.signInWithGoogle();
        // Navigation is handled in the auth service
      } catch (error) {
        console.error('Google sign in error:', error);
        // Error handling is done in the auth service
      } finally {
        this.isLoading = false;
      }
    }
  }

  /**
   * Handle password reset
   */
  async onResetPassword(): Promise<void> {
    if (this.resetEmailForm.valid && !this.isLoading) {
      this.isLoading = true;
      
      try {
        const { email } = this.resetEmailForm.value;
        await this.authService.resetPassword(email);
        
        // Reset form and hide reset password section
        this.resetEmailForm.reset();
        this.showResetPassword = false;
        
      } catch (error) {
        console.error('Password reset error:', error);
        // Error handling is done in the auth service
      } finally {
        this.isLoading = false;
      }
    } else {
      this.markFormGroupTouched(this.resetEmailForm);
    }
  }

  /**
   * Toggle password reset form
   */
  toggleResetPassword(): void {
    this.showResetPassword = !this.showResetPassword;
    if (this.showResetPassword) {
      // Pre-fill email if available
      const email = this.loginForm.get('email')?.value;
      if (email) {
        this.resetEmailForm.patchValue({ email });
      }
    }
  }

  /**
   * Toggle password visibility
   */
  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  /**
   * Get form field error message
   */
  getErrorMessage(fieldName: string, formGroup?: FormGroup): string {
    const form = formGroup || this.loginForm;
    const field = form.get(fieldName);
    
    if (field?.hasError('required')) {
      return `${this.getFieldDisplayName(fieldName)} is required`;
    }
    
    if (field?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    
    if (field?.hasError('minlength')) {
      const minLength = field.errors?.['minlength']?.requiredLength;
      return `Password must be at least ${minLength} characters long`;
    }
    
    return '';
  }

  /**
   * Check if form field has error
   */
  hasError(fieldName: string, formGroup?: FormGroup): boolean {
    const form = formGroup || this.loginForm;
    const field = form.get(fieldName);
    return !!(field?.invalid && (field?.dirty || field?.touched));
  }

  /**
   * Mark all fields in form group as touched
   */
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * Get display name for form field
   */
  private getFieldDisplayName(fieldName: string): string {
    const displayNames: { [key: string]: string } = {
      email: 'Email',
      password: 'Password',
      rememberMe: 'Remember Me'
    };
    
    return displayNames[fieldName] || fieldName;
  }

  /**
   * Navigate to registration page
   */
  goToRegister(): void {
    this.router.navigate(['/register'], {
      queryParams: { returnUrl: this.returnUrl }
    });
  }
}
