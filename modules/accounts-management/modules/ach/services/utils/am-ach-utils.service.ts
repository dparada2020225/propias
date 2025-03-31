import { Injectable } from '@angular/core';
import { ICON_IN_TABLE_KEY } from '@adf/components';
import {
  ICAAchManagementTableAnimationUtilsParameters,
  ICAchManagementAnimationParameters
} from '../../interfaces/utils.interface';

@Injectable({
  providedIn: 'root'
})
export class AmAchUtilsService {

  setLoadingAnimationToAccountToAddFavorite(parameters: ICAchManagementAnimationParameters) {
    const { account, layout } = parameters;
    return this.updateIconInLayout({
      account,
      layout,
      iconClassName: 'sprint2-icon-favoritos loading'
    });
  }

  removeLoadingAnimationFromAccount(parameters: ICAchManagementAnimationParameters) {
    const { account, layout } = parameters;
    return this.updateIconInLayout({
      account,
      layout,
      iconClassName: 'sprint2-icon-favoritos'
    });
  }

  setLoadingAnimationToRemoveFromFavorite(parameters: ICAchManagementAnimationParameters) {
    const { account, layout } = parameters;
    return this.updateIconInLayout({
      account,
      layout,
      iconClassName: 'sprint2-icon-favoritos loading'
    });
  }

  removeLoadingAnimationFromAccountFavorite(parameters: ICAchManagementAnimationParameters) {
    const { account, layout } = parameters;
    return this.updateIconInLayout({
      account,
      layout,
      iconClassName: 'sprint2-icon-favoritos active'
    });
  }

  private updateIconInLayout(parameters: ICAAchManagementTableAnimationUtilsParameters) {
    const { account, layout, iconClassName } = parameters;
    const { item } = account;

    const accountPosition = layout.items.findIndex((account) => account.account === item.account);

    const itemsUpdated = [
      ...layout.items.slice(0, accountPosition),
      {
        ...item,
        [ICON_IN_TABLE_KEY]: iconClassName
      },
      ...layout.items.slice(accountPosition + 1)
    ]

    return {
      ...layout,
      items: itemsUpdated,
    }
  }
}
