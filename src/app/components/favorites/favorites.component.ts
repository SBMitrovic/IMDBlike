import { Component, OnInit, OnDestroy } from '@angular/core';
import { Movie } from 'src/app/interfaces/movie';
import { UserListsService } from 'src/app/services/user-lists.service';
import { MatDialog } from '@angular/material/dialog';
import { MovieDetailsComponent } from '../movie-details/movie-details.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit, OnDestroy {
  favorites: Movie[] = [];
  loader = true;
  private subscription: Subscription = new Subscription();

  constructor(
    private userListsService: UserListsService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.userListsService.getFavorites().subscribe(favorites => {
        this.favorites = favorites;
        this.loader = false;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  openMovieModal(movie: Movie): void {
    if (this.dialog.openDialogs.length > 0) {
      return;
    }

    const dialogRef = this.dialog.open(MovieDetailsComponent, {
      width: '100vw',
      height: '100vh',
      maxWidth: '100vw',
      maxHeight: '100vh',
      data: { movieId: movie.id, movie: movie },
      panelClass: 'movie-modal-panel',
      disableClose: false,
      hasBackdrop: true,
      backdropClass: 'modal-backdrop',
      autoFocus: false,
      restoreFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Movie modal was closed');
    });
  }

  removeFromFavorites(movie: Movie, event: Event): void {
    event.stopPropagation();
    this.userListsService.removeFromFavorites(movie.id);
  }

  isInWatchLater(movieId: number): boolean {
    return this.userListsService.isInWatchLater(movieId);
  }

  toggleWatchLater(movie: Movie, event: Event): void {
    event.stopPropagation();
    this.userListsService.toggleWatchLater(movie);
  }
}
