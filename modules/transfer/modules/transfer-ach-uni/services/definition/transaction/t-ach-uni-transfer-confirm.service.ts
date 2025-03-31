import { Injectable } from '@angular/core';
import {
  AdfFormatService,
  AttributeReadingBuilder,
  DataReadingBuilder,
  FavoriteWidget,
  IDataReading,
  IGroupAttributes
} from '@adf/components';
import { UtilWorkFlowService } from 'src/app/service/common/util-work-flow.service';
import { AchUniConfirmationData } from '../../../interfaces/ach-uni-confirmation-data';
import { IUserDataTransaction } from 'src/app/models/util-work-flow.interface';
import { TAchUniTransferUtilService } from './t-ach-uni-transfer-util.service';
import { UtilService } from 'src/app/service/common/util.service';
import { EProductFromCode } from 'src/app/enums/product.enum';

@Injectable({
  providedIn: 'root'
})
export class TAchUniTransferConfirmService {

  constructor
  (private adfFormat: AdfFormatService,
   private utilWorkFlow: UtilWorkFlowService,
   private atdUtil: TAchUniTransferUtilService,
   private util: UtilService,
  ) {}

  buildVoucherConfirmationLayout(confirmProps: AchUniConfirmationData, isFavoriteWidget: boolean = true): IDataReading {

    const { formValues, accountToCredit, accountToDebited, bank, purpose } = confirmProps ?? {};
    const { amount, comment, commission } = formValues;
    const groupList: IGroupAttributes[] = [];
    const groupGrid: IGroupAttributes = {
      view: 'v-grid',
      attributes: [],
    };

    const userDataDebited: IUserDataTransaction = {
      account: accountToDebited?.account ?? 'undefined',
      alias: accountToDebited?.alias ?? 'undefined',
      name: accountToDebited?.name ?? 'undefined',
      currency: accountToDebited?.currency ?? 'undefined',
      product: accountToDebited?.product
    };

    const userDebitedAccount = this.utilWorkFlow.getUserDataTransactionAchUniAccountInfo(userDataDebited);
    const attributeAccountDebited = new AttributeReadingBuilder()
    .label('ach-uni:transfer-source-account')
    .values(userDebitedAccount)
    .build();
    groupGrid.attributes.push(attributeAccountDebited);

    const userDebited = this.utilWorkFlow.getUserDataTransactionAchUniNameInfo(userDataDebited);
    const attributeNameDebited = new AttributeReadingBuilder()
    .label('ach-uni:transfer-source-account-name')
    .values(userDebited)
    .build();
    groupGrid.attributes.push(attributeNameDebited);

    const attributeAmountDebited = new AttributeReadingBuilder()
    .label('ach-uni:ammount')
    .values([`${'USD'} ${this.adfFormat.formatAmount(amount)}`])
    .build();
    groupGrid.attributes.push(attributeAmountDebited);

    const attributeBank = new AttributeReadingBuilder()
    .label('ach-uni:bank')
    .values([`${bank.description}`])
    .build();
    groupGrid.attributes.push(attributeBank);

    const userDataCredit: IUserDataTransaction = {
      account: accountToCredit?.account,
      alias: accountToCredit?.alias,
      name: accountToCredit?.name,
      currency: accountToCredit?.currency,
      product: this.atdUtil.getProduct(accountToCredit?.type || '0'),
    };

    const userCredit = this.utilWorkFlow.getUserDataTransactionAchUniAccountCreditInfo(userDataCredit);
    const attributeAccountCredit = new AttributeReadingBuilder()
    .label('ach-uni:transfer-target-account')
    .values(userCredit)
    .build();
    groupGrid.attributes.push(attributeAccountCredit);

    const codeProduct = Number(this.getCodeFromAccountType(accountToCredit?.type));
    const product = this.util.getLabelProduct(codeProduct);
    const attributeTypeAccountCredit = new AttributeReadingBuilder()
    .label('ach-uni:transfer-target-account-type')
    .values([`${product}`])
    .build();
    groupGrid.attributes.push(attributeTypeAccountCredit);

    const attributePurpose = new AttributeReadingBuilder()
    .label('ach-uni:purpose')
    .values([`${purpose?.code} - ${purpose?.description}`])
    .build();
    groupGrid.attributes.push(attributePurpose);

    if (comment) {
      const attributeComment = new AttributeReadingBuilder()
      .label('ach-uni:comment')
      .values([comment])
      .build();
      groupGrid.attributes.push(attributeComment);
    }

    const attributeCommission = new AttributeReadingBuilder()
    .label('ach-uni:commission')
    .values([`${accountToDebited?.currency} ${this.adfFormat.formatAmount(commission)}`])
    .build();
    groupGrid.attributes.push(attributeCommission);
      // const attributeTargetBank = new AttributeReadingBuilder()
      //   .label('target-bank')
      //   .values([`${accountToCredit?.bankName}`])
      //   .build();
      // groupGrid.attributes.push(attributeTargetBank);

    groupList.push(groupGrid);

    // const favoriteWidget = new FavoriteWidget()
    //   .icon('sprint2-icon-favoritos')
    //   .label('add_to_favorite')
    //   .build();

    return new DataReadingBuilder()
      .title(confirmProps?.title ?? '')
      .subtitle(confirmProps?.subtitle ?? '')
      // .isFavoriteWidget(isFavoriteWidget ? favoriteWidget : null as any)
      .class(`padding-side ${accountToCredit?.favorite ? 'is_favorite' : ''} `)
      .groupList(groupList)
      .build();
  }

  getCodeFromAccountType(type: string | undefined): string | null {

    if (type === undefined) {
      return null;
    }
    const entries = Object.entries(EProductFromCode) as [string, string][];
    const entry = entries.find(([, value]) => value === type);
    return entry ? entry[0] : null;
  }

}
