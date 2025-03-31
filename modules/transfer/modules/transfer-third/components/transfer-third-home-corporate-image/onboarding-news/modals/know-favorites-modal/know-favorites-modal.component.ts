import {Component} from '@angular/core';

@Component({
  selector: 'byte-know-favorites-modal',
  templateUrl: './know-favorites-modal.component.html',
  styleUrls: ['./know-favorites-modal.component.scss'],
})
export class KnowFavoritesModalComponent {
  imgMobile: string = 'assets/images/private/transfer-third/onboarding/BIES_KnowFavorites_MOB.gif';
  imgTablet: string = 'assets/images/private/transfer-third/onboarding/BIES_KnowFavorites_TBT.gif';
  imgDesktop: string = 'assets/images/private/transfer-third/onboarding/BIES_KnowFavorites_DSK.gif';

}
