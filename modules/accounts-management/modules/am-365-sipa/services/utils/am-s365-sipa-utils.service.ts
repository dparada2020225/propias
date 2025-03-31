import { Injectable } from '@angular/core';
import { ICON_IN_TABLE_KEY } from '@adf/components';
import {
  IAMManagementAnimationParameters,
  IAMManagementTableAnimationParameters
} from '../../../../interfaces/utils.interface';
import { IAMS365Account } from '../../../../interfaces/am-account-list.interface';

@Injectable({
  providedIn: 'root'
})
export class AmS365SipaUtilsService {

  constructor() { }

  setLoadingAnimationToAccountToAddFavorite(parameters: IAMManagementAnimationParameters<IAMS365Account>) {
    const { account, layout } = parameters;
    return this.updateIconInLayout({
      account,
      layout,
      iconClassName: 'sprint2-icon-favoritos loading'
    });
  }

  removeLoadingAnimationFromAccount(parameters: IAMManagementAnimationParameters<IAMS365Account>) {
    const { account, layout } = parameters;
    return this.updateIconInLayout({
      account,
      layout,
      iconClassName: 'sprint2-icon-favoritos'
    });
  }

  setLoadingAnimationToRemoveFromFavorite(parameters: IAMManagementAnimationParameters<IAMS365Account>) {
    const { account, layout } = parameters;
    return this.updateIconInLayout({
      account,
      layout,
      iconClassName: 'sprint2-icon-favoritos loading'
    });
  }

  removeLoadingAnimationFromAccountFavorite(parameters: IAMManagementAnimationParameters<IAMS365Account>) {
    const { account, layout } = parameters;
    return this.updateIconInLayout({
      account,
      layout,
      iconClassName: 'sprint2-icon-favoritos active'
    });
  }

  private updateIconInLayout(parameters: IAMManagementTableAnimationParameters<IAMS365Account>) {
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
