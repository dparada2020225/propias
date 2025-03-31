import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UtilService} from "../../../../../../service/common/util.service";
import {IAddFavoriteACH} from "../../../transfer-ach/interfaces/ach-transfer.interface";
import {TransferThirdService} from "../../services/transaction/transfer-third.service";
import {IAddFavoriteThird} from "../../interfaces/third-crud.interface";
import {IInfoFavorite} from "../../interfaces/third-transfer.interface";

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
  selector: 'byte-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit {

  @Input() account: IAddFavoriteACH | null = null;
  @Input() isFavorite: boolean = false;
  @Output() changeInfo = new EventEmitter<IInfoFavorite>();

  text: string = FavoriteTexts.BASE;
  favClassName = FavoriteClassNames.NO_FAVORITE;

  constructor(
    private utils: UtilService,
    private transferThirdService: TransferThirdService,
  ) {
  }

  ngOnInit(): void {
    this.setFavoriteVisuals();
  }

  setFavoriteVisuals(): void {
    this.text = this.isFavorite ? FavoriteTexts.SUCCESS : FavoriteTexts.BASE;
    this.favClassName = this.isFavorite ? FavoriteClassNames.SUCCESS : FavoriteClassNames.NO_FAVORITE;
  }

  handleFav() {
    this.utils.showPulseLoader();
    this.text = this.isFavorite ? FavoriteTexts.ALTERNATE : FavoriteTexts.LOADING;
    this.favClassName = FavoriteClassNames.LOADING;

    if (this.isFavorite) {
      this.deleteFavorite();
    } else {
      this.addFavorite();
    }
  }

  addFavorite(): void {
    const body: IAddFavoriteThird = {
      alias: this.account?.alias ?? '',
      number: this.account?.number ?? ''
    }

    this.transferThirdService.addFavorite(body).subscribe({
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
    const accountToDeleteFavorites = this.account?.number ?? '';
    this.transferThirdService.deleteFavorite(accountToDeleteFavorites).subscribe({
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
    this.utils.hidePulseLoader();
  }

  onFavoriteError(error: any): void {
    this.utils.scrollToTop();
    this.setFavoriteVisuals();
    this.changeInfo.emit({
      favorite: this.isFavorite,
      typeAlert: 'error',
      message: 'error_add_favorite_account'
    });
    this.utils.hidePulseLoader();
  }

}
