import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, 
         signOut, signInWithPopup, GoogleAuthProvider, User, onAuthStateChanged, 
         sendPasswordResetEmail, updateProfile } from '@angular/fire/auth';
import { Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  provider: string;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthService {
  
  private currentUserSubject = new BehaviorSubject<UserProfile | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(
    private auth: Auth,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    // Listen for authentication state changes
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        const userProfile: UserProfile = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          provider: this.getAuthProvider(user),
          createdAt: new Date(user.metadata.creationTime || Date.now())
        };
        this.currentUserSubject.next(userProfile);
        this.saveUserToLocalStorage(userProfile);
      } else {
        this.currentUserSubject.next(null);
        this.removeUserFromLocalStorage();
      }
    });
    
    // Load user from localStorage on app startup
    this.loadUserFromLocalStorage();
  }

  /**
   * Sign in with email and password
   */
  async signInWithEmail(email: string, password: string): Promise<void> {
    try {
      this.loadingSubject.next(true);
      const result = await signInWithEmailAndPassword(this.auth, email, password);
      
      this.showSnackBar('Login successful!', 'success');
      console.log('User signed in:', result.user);
      
      // Navigate to home or dashboard
      this.router.navigate(['/home']);
      
    } catch (error: any) {
      console.error('Login error:', error);
      this.handleAuthError(error);
      throw error;
    } finally {
      this.loadingSubject.next(false);
    }
  }

  /**
   * Sign up with email and password
   */
  async signUpWithEmail(email: string, password: string, displayName?: string): Promise<void> {
    try {
      this.loadingSubject.next(true);
      const result = await createUserWithEmailAndPassword(this.auth, email, password);
      
      // Update profile with display name if provided
      if (displayName && result.user) {
        await updateProfile(result.user, { displayName });
      }
      
      this.showSnackBar('Account created successfully!', 'success');
      console.log('User registered:', result.user);
      
      // Navigate to home or dashboard
      this.router.navigate(['/home']);
      
    } catch (error: any) {
      console.error('Registration error:', error);
      this.handleAuthError(error);
      throw error;
    } finally {
      this.loadingSubject.next(false);
    }
  }

  /**
   * Sign in with Google
   */
  async signInWithGoogle(): Promise<void> {
    try {
      this.loadingSubject.next(true);
      const provider = new GoogleAuthProvider();
      
      // Add scopes if needed
      provider.addScope('profile');
      provider.addScope('email');
      
      const result = await signInWithPopup(this.auth, provider);
      
      this.showSnackBar('Login with Google successful!', 'success');
      console.log('User signed in with Google:', result.user);
      
      // Navigate to home or dashboard
      this.router.navigate(['/home']);
      
    } catch (error: any) {
      console.error('Google login error:', error);
      this.handleAuthError(error);
      throw error;
    } finally {
      this.loadingSubject.next(false);
    }
  }

  /**
   * Sign out user
   */
  async signOut(): Promise<void> {
    try {
      await signOut(this.auth);
      this.showSnackBar('Logged out successfully', 'success');
      this.router.navigate(['/login']);
    } catch (error: any) {
      console.error('Logout error:', error);
      this.handleAuthError(error);
    }
  }

  /**
   * Reset password
   */
  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(this.auth, email);
      this.showSnackBar('Password reset email sent!', 'success');
    } catch (error: any) {
      console.error('Password reset error:', error);
      this.handleAuthError(error);
      throw error;
    }
  }

  /**
   * Get current user
   */
  getCurrentUser(): UserProfile | null {
    return this.currentUserSubject.value;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  /**
   * Get authentication provider
   */
  private getAuthProvider(user: User): string {
    if (user.providerData && user.providerData.length > 0) {
      return user.providerData[0]?.providerId || 'unknown';
    }
    return 'unknown';
  }

  /**
   * Handle authentication errors
   */
  private handleAuthError(error: any): void {
    let message = 'An error occurred';
    
    switch (error.code) {
      case 'auth/user-not-found':
        message = 'No user found with this email address';
        break;
      case 'auth/wrong-password':
        message = 'Incorrect password';
        break;
      case 'auth/email-already-in-use':
        message = 'Email address is already in use';
        break;
      case 'auth/weak-password':
        message = 'Password should be at least 6 characters';
        break;
      case 'auth/invalid-email':
        message = 'Invalid email address';
        break;
      case 'auth/popup-closed-by-user':
        message = 'Google sign-in was cancelled';
        break;
      case 'auth/network-request-failed':
        message = 'Network error. Please check your connection';
        break;
      default:
        message = error.message || 'Authentication failed';
    }
    
    this.showSnackBar(message, 'error');
  }

  /**
   * Show snackbar message
   */
  private showSnackBar(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'CLOSE', {
      duration: 4000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: type === 'success' ? 'success-snackbar' : 'error-snackbar'
    });
  }

  /**
   * Save user to localStorage
   */
  private saveUserToLocalStorage(user: UserProfile): void {
    localStorage.setItem('imdblike_user', JSON.stringify(user));
  }

  /**
   * Load user from localStorage
   */
  private loadUserFromLocalStorage(): void {
    const savedUser = localStorage.getItem('imdblike_user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        this.currentUserSubject.next(user);
      } catch (error) {
        console.error('Error loading user from localStorage:', error);
        localStorage.removeItem('imdblike_user');
      }
    }
  }

  /**
   * Remove user from localStorage
   */
  private removeUserFromLocalStorage(): void {
    localStorage.removeItem('imdblike_user');
  }
}
