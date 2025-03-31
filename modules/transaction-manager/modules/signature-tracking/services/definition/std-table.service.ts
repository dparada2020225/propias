import { Injectable } from '@angular/core';
import { ITableHeader, ITableStructure, SortAble, TableHeaderBuilder, TableStructuredBuilder } from '@adf/components';
import { ITMTransaction } from '../../../../interfaces/tm-transaction.interface';
import { ESTTableOptions } from '../../enum/st-transaction-status.enum';
import { StUtilsService } from './st-utils.service';
import { ISignatureTrackingServiceResponse } from '../../interfaces/signature-tracking.interface';
import { ESTTransactionStatus } from '../../enum/st-common.enum';
import { SignatureTrackingTableKeys } from '../../enum/signature-tracking.enum';
import { environment } from '../../../../../../../environments/environment';
import { EProfile } from '../../../../../../enums/profile.enum';
import { FeatureManagerService } from '../../../../../../service/common/feature-manager.service';

@Injectable({
  providedIn: 'root'
})
export class StdTableService {

  constructor(
    private stUtils: StUtilsService,
    private featureManager: FeatureManagerService,
  ) { }

  alertMapped = {
    [EProfile.HONDURAS]: 'warning',
    [EProfile.SALVADOR]: 'info',
    [EProfile.PANAMA]: 'info',
  }

  private buildBaseTableHeaders() {
    const tableHeaders: ITableHeader[] = [];

    const dateCreatedHeader = new TableHeaderBuilder()
      .label('date_created')
      .class('head-date')
      .key(SignatureTrackingTableKeys.DATE)
      .build();
    tableHeaders.push(dateCreatedHeader);

    const transactionHeader = new TableHeaderBuilder()
      .label('transaction')
      .class('head-transaction')
      .key(SignatureTrackingTableKeys.TRANSACTION)
      .build();
    tableHeaders.push(transactionHeader);

    const referenceHeader = new TableHeaderBuilder()
      .label('reference')
      .class('head-reference')
      .key(SignatureTrackingTableKeys.REFERENCE)
      .isActive(true)
      .build();
    tableHeaders.push(referenceHeader);

    const currencyHeader = new TableHeaderBuilder()
      .label('head_currency')
      .class('head-currency')
      .key(SignatureTrackingTableKeys.CURRENCY)
      .isActive(true)
      .build();
    tableHeaders.push(currencyHeader);

    const amountHeader = new TableHeaderBuilder()
      .label('amount')
      .class('head_amount')
      .key(SignatureTrackingTableKeys.AMOUNT)
      .isActive(true)
      .build();
    tableHeaders.push(amountHeader);

    const userHeader = new TableHeaderBuilder()
      .label('user_created')
      .class('head_user')
      .key(SignatureTrackingTableKeys.USER)
      .build();
    tableHeaders.push(userHeader);

    return tableHeaders;
  }

  buildToAuthorizeSignatureTrackingTable(accountList: ITMTransaction[]) {
    const tableHeaders = this.buildBaseTableHeaders();

    const sortByDate = new SortAble()
      .label('sort_by_date')
      .key(SignatureTrackingTableKeys.DATA_ORDER)
      .build();

    const optionsToThirdTable = this.getOptionsForToAuthorizeTable();

    const structure =  new TableStructuredBuilder()
      .head(tableHeaders)
      .title('transaction_authorization')
      .body(this.stUtils.parseAccounts(accountList))
      .options(optionsToThirdTable)
      .sortAble(sortByDate)
      .findElement(SignatureTrackingTableKeys.REFERENCE)
      .manageAlertMessage({
        typeAlert: this.alertMapped[environment.profile],
        message: 'empty_to_authorize_accounts'
      })
      .checkedProperty({
        name: 'isChecked',
        value: false,
      })
      .build();

    return this.buildStructureTable(structure);
  }

  buildAuthorizedAccountsTable(accountList: ITMTransaction[]) {
    const tableHeaders = this.buildBaseTableHeaders();

    const sortByDate = new SortAble()
      .label('sort_by_date')
      .key(SignatureTrackingTableKeys.DATA_ORDER)
      .build();

    const options = this.getOptionsForAuthorizedTable();

    const structure = new TableStructuredBuilder()
      .head(tableHeaders)
      .title('authorized_transactions')
      .body(this.stUtils.parseAccounts(accountList))
      .options(options)
      .sortAble(sortByDate)
      .findElement(SignatureTrackingTableKeys.REFERENCE)
      .manageAlertMessage({
        typeAlert: this.alertMapped[environment.profile],
        message: 'empty_authorized_accounts'
      })
      .checkedProperty({
        name: 'isChecked',
        value: false,
      })
      .build();

    return this.buildStructureTable(structure);
  }

  buildEnteredAccountsTable(accountList: ITMTransaction[]) {
     const tableHeaders = this.buildBaseTableHeaders();

    const sortByDate = new SortAble()
      .label('sort_by_date')
      .key(SignatureTrackingTableKeys.DATA_ORDER)
      .build();

    const options = this.getOptionsForEnteredTable();

    const structure = new TableStructuredBuilder()
      .head(tableHeaders)
      .title('entered_transactions')
      .options(options)
      .body(this.stUtils.parseAccounts(accountList))
      .findElement(SignatureTrackingTableKeys.REFERENCE)
      .manageAlertMessage({
        typeAlert: this.alertMapped[environment.profile],
        message: 'empty_entered_accounts'
      })
      .checkedProperty({
        name: 'isChecked',
        value: false,
      })
      .sortAble(sortByDate)
      .build();

    return this.buildStructureTable(structure);
  }

  buildTransactionDetailTable(accountList: ISignatureTrackingServiceResponse[]) {
    const failedTransaction = accountList.filter((acc) => acc.status === ESTTransactionStatus.FAILED);
    const tableHeaders = this.buildBaseTableHeaders();
    tableHeaders.pop();

    tableHeaders[0] = new TableHeaderBuilder()
      .label('date_created')
      .class('head-date')
      .key(SignatureTrackingTableKeys.DATE_TIME)
      .build();


    const userMessaged = new TableHeaderBuilder()
      .label('breadcrumb.user.detail')
      .class('head_transaction_detail')
      .key(SignatureTrackingTableKeys.ERROR_DETAIL)
      .isActive(true)
      .build();
    tableHeaders.push(userMessaged);

    return new TableStructuredBuilder()
      .head(tableHeaders)
      .body(failedTransaction)
      .manageAlertMessage({
        typeAlert: this.alertMapped[environment.profile],
        message: 'empty_entered_accounts'
      })
      .build();
  }

  private buildStructureTable(tableStructure: ITableStructure) {
    if (environment.profile !== EProfile.SALVADOR) {
      return {
        ...tableStructure,
        checkedProperty: {
          name: 'isChecked',
          value: false,
        },
        findElement: SignatureTrackingTableKeys.REFERENCE,
      }
    }

    return tableStructure
  }

  private getOptionsForEnteredTable() {
    const optionsToThirdTable: string[] = [];
    optionsToThirdTable.push(ESTTableOptions.VIEW);
    optionsToThirdTable.push(ESTTableOptions.UPDATE);

    if (!this.featureManager.isStBisvMultipleEnabled()) {
      optionsToThirdTable.push(ESTTableOptions.DELETE);
      optionsToThirdTable.push(ESTTableOptions.SEND);
    }

    return optionsToThirdTable;
  }

  private getOptionsForToAuthorizeTable() {
    const optionsToThirdTable: string[] = [];
    optionsToThirdTable.push(ESTTableOptions.VIEW);
    optionsToThirdTable.push(ESTTableOptions.VIEW_SIGNATURE);

    if (!this.featureManager.isStBisvMultipleEnabled()) {
      optionsToThirdTable.push(ESTTableOptions.REJECT);
      optionsToThirdTable.push(ESTTableOptions.AUTHORIZE);
    }


    return optionsToThirdTable;
  }

  private getOptionsForAuthorizedTable() {
    const optionsToThirdTable: string[] = [];
    optionsToThirdTable.push(ESTTableOptions.VIEW);
    optionsToThirdTable.push(ESTTableOptions.VIEW_SIGNATURE);

    if (!this.featureManager.isStBisvMultipleEnabled()) {
      optionsToThirdTable.push(ESTTableOptions.REJECT);
      optionsToThirdTable.push(ESTTableOptions.PROCESS);
    }

    return optionsToThirdTable;
  }
}
