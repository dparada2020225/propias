import { Injectable } from '@angular/core';
import { IAchAccount } from '../../../interfaces/ach-account-interface';
import {
  AdfFormatService,
  ITableHeader,
  ITableStructure,
  TableHeaderBuilder,
  TableStructuredBuilder
} from '@adf/components';
import { EAchTableKeys } from '../../../enum/ach-table-keys.enum';
import { TranslateService } from '@ngx-translate/core';
import { IAchCrudTransactionResponse } from '../../../interfaces/crud/crud-create.interface';
import {
  ParameterManagementService
} from '../../../../../../../service/navegation-parameters/parameter-management.service';
import { IUserInfo } from '../../../../../../../models/user-info.interface';

@Injectable({
  providedIn: 'root'
})
export class AtdTableModifyService {

  constructor(
    private adfFormat: AdfFormatService,
    private translate: TranslateService,
    private parameterManagement: ParameterManagementService,
  ) { }

  buildModifyTableLayout(account: IAchAccount, serviceResponse?: IAchCrudTransactionResponse): ITableStructure {
    const favoriteTableHeaders: ITableHeader[] = [];

    const headAccountNumber = new TableHeaderBuilder()
      .label('label:type_modification')
      .key(EAchTableKeys.TYPE_MODIFY)
      .build();
    favoriteTableHeaders.push(headAccountNumber);

    const headTypeAccount = new TableHeaderBuilder()
      .label('date')
      .key(EAchTableKeys.DATE)
      .build();
    favoriteTableHeaders.push(headTypeAccount);

    const headBank = new TableHeaderBuilder()
      .label('user')
      .key(EAchTableKeys.USER)
      .build();
    favoriteTableHeaders.push(headBank);

    let modifyItems: any[] = [];

    const labelCreation = this.translate.instant('label:creation');
    const labelModification = this.translate.instant('label:modification');

    const userCreated = this.buildModifyItemObject(labelCreation, account?.userOfCreation, account?.creationDate);
    const userModifier = this.buildModifyItemObject(labelModification, account?.userOfModification, account?.modificationDate);

    if (account?.userOfCreation !== '' && account?.creationDate !== '00000000000000') {
      modifyItems.push(userCreated);
    }

    if (account?.userOfModification !== '' && account?.modificationDate !== '00000000000000' && !serviceResponse) {
      modifyItems.push(userModifier);
    }

    if (serviceResponse) {
      const user: IUserInfo = this.parameterManagement.getParameter('userInfo');
      const userModifier = this.buildModifyItemObject(labelModification, account?.userOfModification || user.username, serviceResponse?.dateTime);
      modifyItems = [...modifyItems, userModifier];
    }

    return new TableStructuredBuilder()
      .head(favoriteTableHeaders)
      .body(modifyItems)
      .build();
  }

  private buildModifyItemObject(typeModify: string, user: string, date: string) {
    return {
      typeModify,
      user,
      date: this.adfFormat.getFormatDateTime(date).standard,
    };
  }


}
