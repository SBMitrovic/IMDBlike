import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseAuthService } from 'src/app/services/firebase-auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  email: string = '';
  password: string = '';
  acceptTerms: boolean = false;
  message: string = '';
  hidePassword: boolean = true;
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private authService: FirebaseAuthService
  ) { }

  ngOnInit(): void {
    // Clear any previous messages
    this.message = '';
  }

  async register() {
    if (!this.email || !this.password || !this.acceptTerms) {
      this.message = 'Please fill in all required fields and accept the terms.';
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.message = 'Please enter a valid email address.';
      return;
    }
    
    this.isLoading = true;
    this.message = '';
    
    try {
      // Use the email directly for Firebase authentication
      await this.authService.signUpWithEmail(
        this.email,
        this.password,
        this.email.split('@')[0] // Use the part before @ as display name
      );
      
      this.message = 'Registration successful! Please check your email to verify your account.';
      
      // Redirect to login after successful registration
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 3000);
      
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // Handle specific Firebase auth errors
      if (error.code === 'auth/email-already-in-use') {
        this.message = 'This email address is already registered. Please use a different email or try logging in.';
      } else if (error.code === 'auth/weak-password') {
        this.message = 'Password is too weak. Please use at least 6 characters.';
      } else if (error.code === 'auth/invalid-email') {
        this.message = 'Please enter a valid email address.';
      } else if (error.code === 'auth/operation-not-allowed') {
        this.message = 'Email registration is not enabled. Please contact support.';
      } else {
        this.message = error.message || 'Registration failed. Please try again.';
      }
    } finally {
      this.isLoading = false;
    }
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  async onGoogleSignUp() {
    if (this.isLoading) return;
    
    this.isLoading = true;
    this.message = '';
    
    try {
      await this.authService.signInWithGoogle();
      // Navigation is handled in the auth service
    } catch (error: any) {
      console.error('Google sign up error:', error);
      this.message = error.message || 'Google sign up failed. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}