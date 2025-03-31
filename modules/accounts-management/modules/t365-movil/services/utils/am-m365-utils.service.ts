import { Injectable } from '@angular/core';
import { ICON_IN_TABLE_KEY } from '@adf/components';
import {
  IAM365ManagementAnimationParameters,
  IAM365ManagementTableAnimationUtilsParameters
} from '../../interfaces/utils.interface';

@Injectable({
  providedIn: 'root'
})
export class AmM365UtilsService {
  setLoadingAnimationToAccountToAddFavorite(parameters: IAM365ManagementAnimationParameters) {
    const { account, layout } = parameters;
    return this.updateIconInLayout({
      account,
      layout,
      iconClassName: 'sprint2-icon-favoritos loading'
    });
  }

  removeLoadingAnimationFromAccount(parameters: IAM365ManagementAnimationParameters) {
    const { account, layout } = parameters;
    return this.updateIconInLayout({
      account,
      layout,
      iconClassName: 'sprint2-icon-favoritos'
    });
  }

  setLoadingAnimationToRemoveFromFavorite(parameters: IAM365ManagementAnimationParameters) {
    const { account, layout } = parameters;
    return this.updateIconInLayout({
      account,
      layout,
      iconClassName: 'sprint2-icon-favoritos loading'
    });
  }

  removeLoadingAnimationFromAccountFavorite(parameters: IAM365ManagementAnimationParameters) {
    const { account, layout } = parameters;
    return this.updateIconInLayout({
      account,
      layout,
      iconClassName: 'sprint2-icon-favoritos active'
    });
  }

  private updateIconInLayout(parameters: IAM365ManagementTableAnimationUtilsParameters) {
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
