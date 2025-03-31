import { Injectable } from '@angular/core';
import { UtilService } from 'src/app/service/common/util.service';
import { TranslateService } from '@ngx-translate/core';
import { ITMAchUniVoucherParameters } from '../../interfaces/ach-uni-voucher-definition.interface';
import { AttributeReadingBuilder, DataReadingBuilder, IGroupAttributes, ITableHeader, ITableStructure, TableHeaderBuilder,
         TableStructuredBuilder } from '@adf/components';
import { ITMAchUniAchAccount, ITMAchUniTableDefinitionParameters, ITMAchUniTableKeys } from '../../interfaces/ach-uni-table.interface';
import { TBisvMassiveAchLoteDetailMappedResponse } from '../../interfaces/lote-detail.interface';

@Injectable({
  providedIn: 'root'
})
export class TmAchUniVoucherService {


  constructor(
    private utils: UtilService,
    private translate: TranslateService,
  ) {
  }

  buildVoucherConfirmationLayout(parameters: ITMAchUniVoucherParameters) {
    const { sourceAccount} = parameters;

    const groupList: IGroupAttributes[] = [];

    const groupGrid: IGroupAttributes = {
      view: 'v-grid',
      attributes: [],
    };

    const attributeSourceAccount = new AttributeReadingBuilder()
      .label('tm-ach-uni:confirmation_source_account')
      .values([sourceAccount.account])
      .build();
    groupGrid.attributes.push(attributeSourceAccount);

    const attributeSourceAccountName = new AttributeReadingBuilder()
      .label('tm-ach-uni:confirmation_name_account')
      .values([sourceAccount.name])
      .build();
    groupGrid.attributes.push(attributeSourceAccountName);

    groupList.push(groupGrid);
    return new DataReadingBuilder()
      .groupList(groupList)
      .build();
  }

  buildTableLayout(parameters: ITMAchUniTableDefinitionParameters): ITableStructure {

    const { accounts } = parameters;
    const tmUniTableHeaders: ITableHeader[] = [];
    const headerBankName = new TableHeaderBuilder()
      .label('tm-ach-uni:confirmation_bank')
      .key(ITMAchUniTableKeys.BANK)
      .build();
    tmUniTableHeaders.push(headerBankName);

    const headerProductName = new TableHeaderBuilder()
      .label('tm-ach-uni:confirmation_product')
      .key(ITMAchUniTableKeys.PRODUCT)
      .build();
    tmUniTableHeaders.push(headerProductName);

    const headerCurrency = new TableHeaderBuilder()
      .label('tm-ach-uni:confirmation_currency')
      .key(ITMAchUniTableKeys.CURRENCY)
      .isActive(true)
      .build();
    tmUniTableHeaders.push(headerCurrency);

    const headerAccount = new TableHeaderBuilder()
      .label('tm-ach-uni:confirmation_number_account')
      .key(ITMAchUniTableKeys.ACCOUNT)
      .build();
    tmUniTableHeaders.push(headerAccount);

    const headerAmount = new TableHeaderBuilder()
      .label('tm-ach-uni:confirmation_amount')
      .key(ITMAchUniTableKeys.AMOUNT)
      .isActive(true)
      .build();
    tmUniTableHeaders.push(headerAmount);

    const headerComment = new TableHeaderBuilder()
      .label('tm-ach-uni:confirmation_comment')
      .key(ITMAchUniTableKeys.COMMENT)
      .build();
    tmUniTableHeaders.push(headerComment);


    return new TableStructuredBuilder()
      .head(tmUniTableHeaders)
      .body(this.parseAccounts(accounts))
      .build();
  }

  buildTableLayoutForStOperations(registers: TBisvMassiveAchLoteDetailMappedResponse) {
    const { headers } = this.buildTableLayout({
      accounts: [],
    });

    return new TableStructuredBuilder()
      .head(headers)
      .body(this.parseAccountsForStOperations(registers))
      .manageAlertMessage({
        typeAlert: 'info',
        message: 'tm:ach:not_found_lote'
      })
      .build();
  }

  private parseAccounts(accounts: Array<ITMAchUniAchAccount>) {
    return accounts.map((account, index) => {
      return {
        bankName: account.bankName,
        productName: this.getProductName(account.dataFromFile.product),
        currency: account.currency,
        account: account.account,
        amountFormatted: this.utils.formatAmount(account.dataFromFile.amount),
        comment: account.dataFromFile.description,
      }
    });
  }

  private parseAccountsForStOperations(accounts: TBisvMassiveAchLoteDetailMappedResponse) {
    return accounts.map((account) => {
      return {
        ...account,
        amountFormatted: this.utils.formatAmount(account.amount),
      }
    });
  }

  private getProductName(product: string) {
    const productName = this.utils.getLabelProduct(Number(product));

    return `${productName}`.toUpperCase();
  }

  getTypeClient(value: string): string{
    return (value === 'J') ? 'tm-ach-uni:client-type-j' : 'tm-ach-uni:client-type-n';
  }
}
