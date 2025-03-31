import {
  AdfFormatService,
  AttributeReadingBuilder,
  DataReadingBuilder,
  IDataReading,
  IGroupAttributes
} from '@adf/components';
import { Injectable } from '@angular/core';
import { IUserDataTransaction } from 'src/app/models/util-work-flow.interface';
import { UtilWorkFlowService } from 'src/app/service/common/util-work-flow.service';
import { UtilService } from 'src/app/service/common/util.service';
import { IDTDConfirmationRequest } from '../../interfaces/donation-definition.interface';

@Injectable({
  providedIn: 'root',
})
export class DtdTransferConfirmService {
  constructor(private util: UtilService, private formatService: AdfFormatService, private utilWorkFlow: UtilWorkFlowService) {}

  builderLayoutConfirmation(confirmationRequest: IDTDConfirmationRequest): IDataReading {
    const accountDebited = confirmationRequest?.accountDebited;
    const fundationAccount = confirmationRequest?.fundationAccount;
    const amount = confirmationRequest?.amount;

    const groupList: IGroupAttributes[] = [];

    const groupGrid: IGroupAttributes = {
      view: 'v-grid',
      attributes: [],
    };

    const userDataDebit: IUserDataTransaction = {
      account: accountDebited?.account,
      alias: accountDebited?.alias,
      currency: accountDebited?.currency,
      name: accountDebited?.name,
      product: accountDebited?.product,
    };

    const userDebit = this.utilWorkFlow.getUserDataTransaction(userDataDebit);

    const attributesAccountDevited = new AttributeReadingBuilder()
      .label('account_to_be_debited')
      .class('reading-text-uppercase')
      .values(userDebit)
      .build();

    const attributeAmountCredited = new AttributeReadingBuilder()
      .label('amount')
      .class('reading-text-uppercase')
      .values([`${this.util.geCurrencSymbol(accountDebited?.currency ?? 'undefined')}. ${this.formatService.formatAmount(amount)}`])
      .build();

    const attributesFundationAccount = new AttributeReadingBuilder()
      .label('credited_fundation')
      .class('reading-text-uppercase')
      .values([`${fundationAccount?.name ?? ''}`])
      .build();

    groupGrid.attributes.push(attributesAccountDevited);
    groupGrid.attributes.push(attributeAmountCredited);
    groupGrid.attributes.push(attributesFundationAccount);

    groupList.push(groupGrid);

    return new DataReadingBuilder()
      .title(confirmationRequest.title)
      .subtitle(confirmationRequest.subtitle)
      .class('padding-side')
      .groupList(groupList)
      .build();
  }
}
