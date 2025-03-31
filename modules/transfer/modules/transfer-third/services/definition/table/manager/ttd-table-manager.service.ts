import { Injectable } from '@angular/core';
import { TtdTableFavoritesService } from '../personalization/ttd-table-banpais-favorites.service';
import { TtdTableAssociatesService } from '../personalization/ttd-table-banpais-associates.service';
import { TtdTableFormFilterService } from '../personalization/ttd-table-banpais-form-filter.service';
import { environment } from 'src/environments/environment';
import { EProfile } from 'src/app/enums/profile.enum';
import { TtdTableBisvFormFilterService } from '../personalization/ttd-table-bisv-form-filter.service';
import { TtdTableBisvFavoritesService } from '../personalization/ttd-table-bisv-favorites.service';
import { TtdTableBisvAssociatesService } from '../personalization/ttd-table-bisv-associates.service';

@Injectable({
  providedIn: 'root'
})
export class TtdTableManagerService {

  constructor(
    private tableFavoriteDefinition: TtdTableFavoritesService,
    private tableFavoriteDefinitionBisv: TtdTableBisvFavoritesService,

    private tableAssociateDefinition: TtdTableAssociatesService,
    private tableAssociateDefinitionBisv: TtdTableBisvAssociatesService,

    private filterForm: TtdTableFormFilterService,
    private filterFormBisv: TtdTableBisvFormFilterService
  ) { }

  profile = environment.profile;

  buildFavoriteTable(menuOptionsLicenses: string[]) {

    switch (this.profile) {
      case EProfile.HONDURAS:
      case EProfile.PANAMA:
        return this.tableFavoriteDefinition.buildFavoriteTableLayout(menuOptionsLicenses);
      case EProfile.SALVADOR:
        return this.tableFavoriteDefinitionBisv.buildFavoriteTableLayout(menuOptionsLicenses)
      default:
        return this.tableFavoriteDefinition.buildFavoriteTableLayout(menuOptionsLicenses);
    }
  }

  buildAssociateTable(menuOptionsLicenses: string[]) {
    switch (this.profile) {
      case EProfile.HONDURAS:
      case EProfile.PANAMA:
        return this.tableAssociateDefinition.buildThirdTableLayout(menuOptionsLicenses);
      case EProfile.SALVADOR:
        return this.tableAssociateDefinitionBisv.buildThirdTableLayout(menuOptionsLicenses);
      default:
        return this.tableAssociateDefinition.buildThirdTableLayout(menuOptionsLicenses);
    }
  }

  buildFilterForm() {
    switch (this.profile) {
      case EProfile.HONDURAS:
      case EProfile.PANAMA:
        return this.filterForm.buildFilterLayout();
      case EProfile.SALVADOR:
        return this.filterFormBisv.buildFilterLayout();
      default:
        return this.filterForm.buildFilterLayout();
    }
  }
}
