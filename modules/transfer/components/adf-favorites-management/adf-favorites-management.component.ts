import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
enum FavoriteTexts {
  BASE = 'add_to_favorite-sv',
  LOADING = 'add_to_favorite-sv-loading',
  SUCCESS = 'added_favorite-sv',
  ALTERNATE = 'added_favorite-sv-loading'
}

enum FavoriteClassNames {
  NO_FAVORITE = 'fav-nofavorite',
  SUCCESS = 'fav-success',
  LOADING = 'fav-loading'
}

@Component({
  selector: 'byte-adf-favorites-management',
  templateUrl: './adf-favorites-management.component.html',
  styleUrls: ['./adf-favorites-management.component.scss']
})
export class AdfFavoritesManagementComponent implements OnInit {
  @Input() isFavorite: boolean = false;
  @Output() changeInfo = new EventEmitter<any>();

  @Input() loaderHideService!: () => void;
  @Input() loaderShowService!: () => void;
  @Input() addToFavoriteService!: () => Observable<any>;
  @Input() removeToFavoriteService!: () => Observable<any>;

  text: string = FavoriteTexts.BASE;
  favClassName = FavoriteClassNames.NO_FAVORITE;

  constructor() { }

  ngOnInit(): void {
    this.setFavoriteVisuals();
  }

  setFavoriteVisuals(): void {
    this.text = this.isFavorite ? FavoriteTexts.SUCCESS : FavoriteTexts.BASE;
    this.favClassName = this.isFavorite ? FavoriteClassNames.SUCCESS : FavoriteClassNames.NO_FAVORITE;
  }

  handleFav() {
    this.loaderShowService();
    this.text = this.isFavorite ? FavoriteTexts.ALTERNATE : FavoriteTexts.LOADING;
    this.favClassName = FavoriteClassNames.LOADING;

    if (this.isFavorite) {
      this.deleteFavorite();
      return;
    }

    this.addFavorite();
  }

  addFavorite(): void {
    this.addToFavoriteService().subscribe({
        next: () => {
          this.onFavoriteSuccess()
        },
        error: (err) => {
          this.onFavoriteError(err)
        }
      }
    );
  }

  deleteFavorite(): void {
    this.removeToFavoriteService().subscribe({
      next: () => {
        this.onFavoriteSuccess()
      },
      error: (err) => {
        this.onFavoriteError(err)
      }
    });
  }

  onFavoriteSuccess(): void {
    this.isFavorite = !this.isFavorite;
    this.setFavoriteVisuals();
    this.changeInfo.emit({
      favorite: this.isFavorite,
    });

    this.loaderHideService();
  }

  onFavoriteError(error: any): void {
    this.setFavoriteVisuals();
    this.changeInfo.emit({
      favorite: this.isFavorite,
      typeAlert: 'error',
      message: 'error_add_favorite_account'
    });

    this.loaderHideService();
  }

}
