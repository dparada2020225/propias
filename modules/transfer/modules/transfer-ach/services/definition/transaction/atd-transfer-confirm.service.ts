import {
  AdfFormatService,
  AttributeReadingBuilder,
  DataReadingBuilder,
  FavoriteWidget,
  IDataReading,
  IGroupAttributes
} from '@adf/components';
import { Injectable } from '@angular/core';
import { IATDConfirm } from '../../../interfaces/ach-transfer-definition.inteface';
import { IUserDataTransaction } from '../../../../../../../models/util-work-flow.interface';
import { UtilWorkFlowService } from 'src/app/service/common/util-work-flow.service';
import { AtdUtilService } from '../../atd-util.service';

@Injectable({
  providedIn: 'root',
})
export class AtdTransferConfirmService {
  constructor
  (private adfFormat: AdfFormatService,
   private utilWorkFlow: UtilWorkFlowService,
   private atdUtil: AtdUtilService,
  ) {}

  buildVoucherConfirmationLayout(confirmProps: IATDConfirm, isFavoriteWidget: boolean = true): IDataReading {
    const { formValues, accountToCredit, accountToDebited } = confirmProps ?? {};
    const { amount, comment } = formValues;

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

    const userDebited = this.utilWorkFlow.getUserDataTransaction(userDataDebited);

    const attributeAccountDebited = new AttributeReadingBuilder().label('account_to_be_debited').values(userDebited).build();

    groupGrid.attributes.push(attributeAccountDebited);

    const attributeTargetBank = new AttributeReadingBuilder()
      .label('target-bank')
      .values([`${accountToCredit?.bankName}`])
      .build();
    groupGrid.attributes.push(attributeTargetBank);

    const userDataCredit: IUserDataTransaction = {
      account: accountToCredit?.account,
      alias: accountToCredit?.alias,
      name: accountToCredit?.name,
      currency: accountToCredit?.currency,
      product: this.atdUtil.getProduct(accountToCredit?.type || '0'),
    };

    const userCredit = this.utilWorkFlow.getUserDataTransaction(userDataCredit);

    const attributeAccountCredit = new AttributeReadingBuilder().label('account_to_be_credited').values(userCredit).build();

    groupGrid.attributes.push(attributeAccountCredit);

    const attributeAmountDebited = new AttributeReadingBuilder()
      .label('amount_to_be_debited')
      .values([`${accountToDebited?.currency} ${this.adfFormat.formatAmount(amount)}`])
      .build();
    groupGrid.attributes.push(attributeAmountDebited);

    if (comment) {
      const attributeComment = new AttributeReadingBuilder().label('comment').values([comment]).build();
      groupGrid.attributes.push(attributeComment);
    }

    groupList.push(groupGrid);

    const favoriteWidget = new FavoriteWidget()
      .icon('sprint2-icon-favoritos')
      .label('add_to_favorite')
      .build();

    return new DataReadingBuilder()
      .title(confirmProps?.title ?? '')
      .subtitle(confirmProps?.subtitle ?? '')
      .isFavoriteWidget(isFavoriteWidget ? favoriteWidget : null as any)
      .class(`padding-side ${accountToCredit?.favorite ? 'is_favorite' : ''} `)
      .groupList(groupList)
      .build();
  }
}
