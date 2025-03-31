import { Injectable } from '@angular/core';
import { AtdTableAssociatesService } from './atd-table-associates.service';
import { AtdTableFavoritesService } from './atd-table-favorites.service';
import { AtdFormFilterService } from './atd-form-filter.service';
import { IAchAccount } from '../../../interfaces/ach-account-interface';
import { AtdTableModifyService } from './atd-table-modify.service';
import { UtilWorkFlowService } from '../../../../../../../service/common/util-work-flow.service';
import { IAchCrudTransactionResponse } from '../../../interfaces/crud/crud-create.interface';

@Injectable({
  providedIn: 'root',
})
export class AtdTableManagerService {
  constructor(
    private associatedTableDefinition: AtdTableAssociatesService,
    private favoriteTableDefinition: AtdTableFavoritesService,
    private filterFormDefinition: AtdFormFilterService,
    private modifyTableDefinition: AtdTableModifyService,
    private  utilWorkFlow: UtilWorkFlowService,
  ) {}

  buildFavoriteTable(accountList: IAchAccount[], menuOptionsLicenses: string[]) {
    return this.favoriteTableDefinition.builderFavoriteAccountTableLayout(accountList, menuOptionsLicenses);
  }

  buildAssociateTable(accountList: IAchAccount[], menuOptionsLicenses: string[]) {
    return this.associatedTableDefinition.builderAssociateAccountTableLayout(accountList, menuOptionsLicenses);
  }

  buildModifyHistoryTable(account: IAchAccount, serviceResponse?: IAchCrudTransactionResponse) {
    return this.modifyTableDefinition.buildModifyTableLayout(account, serviceResponse);
  }

  buildFilterForm() {
    return this.filterFormDefinition.buildFilterLayout();
  }

  buildDeleteAssociatedAlert() {
    return this.utilWorkFlow.buildDeleteAchAlert();
  }

  buildDeleteFavoriteAlert() {
    return this.utilWorkFlow.buildDeleteFavoriteAlert();
  }
}
