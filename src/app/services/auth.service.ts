import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, user, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail, updateProfile, sendEmailVerification, User as FirebaseUser } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc, docData, serverTimestamp } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap, catchError, map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  emailVerified: boolean;
  createdAt?: any;
  lastLoginAt?: any;
  provider?: string;
  watchlist?: string[];
  favoriteGenres?: string[];
  ratingsGiven?: number;
  reviewsCount?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  user$: Observable<User | null>;
  loading = false;

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    // Get the authenticated user and user document
    this.user$ = user(this.auth).pipe(
      switchMap(firebaseUser => {
        if (firebaseUser) {
          // Get user document from Firestore
          const userDocRef = doc(this.firestore, `users/${firebaseUser.uid}`);
          return docData(userDocRef).pipe(
            map(userData => ({
              uid: firebaseUser.uid,
              email: firebaseUser.email!,
              displayName: firebaseUser.displayName || undefined,
              photoURL: firebaseUser.photoURL || undefined,
              emailVerified: firebaseUser.emailVerified,
              ...userData
            }))
          );
        } else {
          return of(null);
        }
      }),
      catchError(error => {
        console.error('Auth state error:', error);
        return of(null);
      })
    );
  }

  /**
   * Sign up with email and password
   */
  async signUp(email: string, password: string, displayName?: string): Promise<any> {
    try {
      this.loading = true;
      const credential = await createUserWithEmailAndPassword(this.auth, email, password);
      
      if (credential.user) {
        // Update profile with display name
        if (displayName) {
          await updateProfile(credential.user, { displayName });
        }
        
        // Send email verification
        await this.sendEmailVerification();
        
        // Create user document in Firestore
        await this.updateUserData(credential.user, {
          displayName: displayName || '',
          provider: 'email',
          createdAt: serverTimestamp(),
          watchlist: [],
          favoriteGenres: [],
          ratingsGiven: 0,
          reviewsCount: 0
        });
        
        this.showMessage('Account created successfully! Please check your email for verification.');
        return credential;
      }
    } catch (error: any) {
      this.handleError(error);
      throw error;
    } finally {
      this.loading = false;
    }
  }

  /**
   * Sign in with email and password
   */
  async signIn(email: string, password: string): Promise<any> {
    try {
      this.loading = true;
      const credential = await signInWithEmailAndPassword(this.auth, email, password);
      
      if (credential.user) {
        // Update last login time
        await this.updateUserData(credential.user, {
          lastLoginAt: serverTimestamp()
        });
        
        this.showMessage('Welcome back!');
        this.router.navigate(['/home']);
        return credential;
      }
    } catch (error: any) {
      this.handleError(error);
      throw error;
    } finally {
      this.loading = false;
    }
  }

  /**
   * Sign in with Google
   */
  async googleSignIn(): Promise<any> {
    try {
      this.loading = true;
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      
      const credential = await signInWithPopup(this.auth, provider);
      
      if (credential.user) {
        // Create or update user document
        await this.updateUserData(credential.user, {
          provider: 'google',
          lastLoginAt: serverTimestamp()
        });
        
        this.showMessage(`Welcome ${credential.user.displayName || 'back'}!`);
        this.router.navigate(['/home']);
        return credential;
      }
    } catch (error: any) {
      this.handleError(error);
      throw error;
    } finally {
      this.loading = false;
    }
  }

  /**
   * Sign out
   */
  async signOut(): Promise<void> {
    try {
      await signOut(this.auth);
      this.showMessage('Signed out successfully');
      this.router.navigate(['/login']);
    } catch (error: any) {
      this.handleError(error);
    }
  }

  /**
   * Send email verification
   */
  async sendEmailVerification(): Promise<void> {
    const currentUser = this.auth.currentUser;
    if (currentUser && !currentUser.emailVerified) {
      await sendEmailVerification(currentUser);
      this.showMessage('Verification email sent. Please check your inbox.');
    }
  }

  /**
   * Reset password
   */
  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(this.auth, email);
      this.showMessage('Password reset email sent. Please check your inbox.');
    } catch (error: any) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Get current user
   */
  getCurrentUser(): Observable<FirebaseUser | null> {
    return user(this.auth);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): Observable<boolean> {
    return user(this.auth).pipe(
      map(user => !!user)
    );
  }

  /**
   * Update user data in Firestore
   */
  private async updateUserData(user: FirebaseUser, additionalData: any = {}): Promise<void> {
    const userRef = doc(this.firestore, `users/${user.uid}`);
    
    const data: Partial<User> = {
      uid: user.uid,
      email: user.email!,
      displayName: user.displayName || '',
      photoURL: user.photoURL || '',
      emailVerified: user.emailVerified,
      ...additionalData
    };

    // Use merge to avoid overwriting existing data
    return setDoc(userRef, data, { merge: true });
  }

  /**
   * Handle authentication errors
   */
  private handleError(error: any): void {
    console.error('Auth error:', error);
    
    let message = 'An error occurred. Please try again.';
    
    switch (error.code) {
      case 'auth/user-not-found':
        message = 'No user found with this email address.';
        break;
      case 'auth/wrong-password':
        message = 'Incorrect password.';
        break;
      case 'auth/email-already-in-use':
        message = 'An account with this email already exists.';
        break;
      case 'auth/weak-password':
        message = 'Password is too weak. Please choose a stronger password.';
        break;
      case 'auth/invalid-email':
        message = 'Invalid email address.';
        break;
      case 'auth/user-disabled':
        message = 'This account has been disabled.';
        break;
      case 'auth/too-many-requests':
        message = 'Too many failed attempts. Please try again later.';
        break;
      case 'auth/popup-closed-by-user':
        message = 'Sign-in popup was closed. Please try again.';
        break;
      case 'auth/popup-blocked':
        message = 'Popup blocked by browser. Please allow popups and try again.';
        break;
      default:
        message = error.message || 'Authentication failed.';
    }
    
    this.showMessage(message, 'error');
  }

  /**
   * Show snackbar message
   */
  private showMessage(message: string, type: 'success' | 'error' = 'success'): void {
    this.snackBar.open(message, 'Close', {
      duration: 4000,
      panelClass: type === 'error' ? 'error-snackbar' : 'success-snackbar',
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }
}