import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Movie } from '../interfaces/movie';
import { FirebaseAuthService } from './firebase-auth.service';

@Injectable({
  providedIn: 'root'
})

export class UserListsService {
  private favoritesSubject = new BehaviorSubject<Movie[]>([]);
  private watchLaterSubject = new BehaviorSubject<Movie[]>([]);

  public favorites$ = this.favoritesSubject.asObservable();
  public watchLater$ = this.watchLaterSubject.asObservable();

  constructor(private authService: FirebaseAuthService) {
    this.loadUserLists();
  }

  private loadUserLists(): void {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.loadFavoritesFromStorage(user.uid);
        this.loadWatchLaterFromStorage(user.uid);
      } else {
        this.favoritesSubject.next([]);
        this.watchLaterSubject.next([]);
      }
    });
  }

  private loadFavoritesFromStorage(userId: string): void {
    const storedFavorites = localStorage.getItem(`favorites_${userId}`);
    if (storedFavorites) {
      this.favoritesSubject.next(JSON.parse(storedFavorites));
    }
  }

  private loadWatchLaterFromStorage(userId: string): void {
    const storedWatchLater = localStorage.getItem(`watchLater_${userId}`);
    if (storedWatchLater) {
      this.watchLaterSubject.next(JSON.parse(storedWatchLater));
    }
  }

  private saveFavoritesToStorage(userId: string, favorites: Movie[]): void {
    localStorage.setItem(`favorites_${userId}`, JSON.stringify(favorites));
  }

  private saveWatchLaterToStorage(userId: string, watchLater: Movie[]): void {
    localStorage.setItem(`watchLater_${userId}`, JSON.stringify(watchLater));
  }

  // Favorites methods
  addToFavorites(movie: Movie): boolean {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return false;

    const currentFavorites = this.favoritesSubject.value;
    if (!this.isInFavorites(movie.id)) {
      const updatedFavorites = [...currentFavorites, movie];
      this.favoritesSubject.next(updatedFavorites);
      this.saveFavoritesToStorage(currentUser.uid, updatedFavorites);
      return true;
    }
    return false;
  }

  removeFromFavorites(movieId: number): boolean {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return false;

    const currentFavorites = this.favoritesSubject.value;
    const updatedFavorites = currentFavorites.filter(movie => movie.id !== movieId);
    this.favoritesSubject.next(updatedFavorites);
    this.saveFavoritesToStorage(currentUser.uid, updatedFavorites);
    return true;
  }

  isInFavorites(movieId: number): boolean {
    return this.favoritesSubject.value.some(movie => movie.id === movieId);
  }

  getFavorites(): Observable<Movie[]> {
    return this.favorites$;
  }

  // Watch Later methods
  addToWatchLater(movie: Movie): boolean {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return false;

    const currentWatchLater = this.watchLaterSubject.value;
    if (!this.isInWatchLater(movie.id)) {
      const updatedWatchLater = [...currentWatchLater, movie];
      this.watchLaterSubject.next(updatedWatchLater);
      this.saveWatchLaterToStorage(currentUser.uid, updatedWatchLater);
      return true;
    }
    return false;
  }

  removeFromWatchLater(movieId: number): boolean {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return false;

    const currentWatchLater = this.watchLaterSubject.value;
    const updatedWatchLater = currentWatchLater.filter(movie => movie.id !== movieId);
    this.watchLaterSubject.next(updatedWatchLater);
    this.saveWatchLaterToStorage(currentUser.uid, updatedWatchLater);
    return true;
  }

  isInWatchLater(movieId: number): boolean {
    return this.watchLaterSubject.value.some(movie => movie.id === movieId);
  }

  getWatchLater(): Observable<Movie[]> {
    return this.watchLater$;
  }

  // Toggle methods for easier UI interaction
  toggleFavorite(movie: Movie): boolean {
    if (this.isInFavorites(movie.id)) {
      return this.removeFromFavorites(movie.id);
    } else {
      return this.addToFavorites(movie);
    }
  }
  
  toggleWatchLater(movie: Movie): boolean {
    if (this.isInWatchLater(movie.id)) {
      return this.removeFromWatchLater(movie.id);
    } else {
      return this.addToWatchLater(movie);
    }
  }
}
