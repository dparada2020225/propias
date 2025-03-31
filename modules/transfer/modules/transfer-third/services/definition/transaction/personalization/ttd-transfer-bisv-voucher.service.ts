import {AdfFormatService, DataReadingBuilder, FavoriteWidget, IGroupAttributes} from '@adf/components';
import {Injectable} from '@angular/core';
import {IUserDataTransaction} from 'src/app/models/util-work-flow.interface';
import {UtilWorkFlowService} from 'src/app/service/common/util-work-flow.service';
import {UtilService} from 'src/app/service/common/util.service';
import {IThirdTransferSampleVoucher} from '../../../../interfaces/third-transfer.interface';
import {TtdBaseTransferService} from '../base/ttd-base-transfer.service';
import {IBasicAttributeVC} from 'src/app/models/build.interface';

@Injectable({
  providedIn: 'root'
})
export class TtdTransferBisvVoucherService {


  constructor(
    private util: UtilService,
    private utilWorkFlow: UtilWorkFlowService,
    private formatService: AdfFormatService,
    private base: TtdBaseTransferService
  ) {
  }

  buildSampleVoucher(sampleVoucherProps: IThirdTransferSampleVoucher, isShowFavoriteWidget: boolean = true) {
    const accountToCredit = sampleVoucherProps?.accountToCredit;
    const accountToDebit = sampleVoucherProps?.accountToDebit;
    const formValues = sampleVoucherProps?.formValues;
    const isFavorite = sampleVoucherProps?.isFavorite;
    const email = formValues.email;
    const amount = formValues.amount;
    const comment = formValues.comment;
    const reference = sampleVoucherProps?.reference;

    const groupList: IGroupAttributes[] = [];
    const groupGrid: IGroupAttributes = {
      view: 'v-custom',
      attributes: [],
    };

    const userDataDebited: IUserDataTransaction = {
      account: accountToDebit?.account,
      alias: accountToDebit?.alias,
      name: accountToDebit?.name,
      currency: accountToDebit?.currency,
      product: +accountToDebit?.product
    };

    if (sampleVoucherProps?.reference) {

      const attributeReference: IBasicAttributeVC = {
        label: 'reference',
        class: 'order-lg-1',
        values: [`${sampleVoucherProps?.reference}`]
      }

      groupGrid.attributes.push(this.base.builderDataReading(attributeReference));

    }

    const userDebited = this.utilWorkFlow.getUserDataTransaction(userDataDebited);

    const attributeAccountDebited: IBasicAttributeVC = {
      label: 'account_to_be_debited',
      class: `${reference ? 'order-lg-3' : 'order-lg-1'}`,
      values: userDebited
    }

    const attributeAmountAttribute: IBasicAttributeVC = {
      label: 'amount',
      class: `${reference ? 'order-lg-4' : 'order-lg-2'}`,
      values: [`${this.util.geCurrencSymbol(accountToDebit?.currency ?? 'not_found')}. ${this.formatService.formatAmount(amount)}`]
    }

    const userDataCredit: IUserDataTransaction = {
      account: accountToCredit?.account,
      alias: accountToCredit?.alias,
      name: accountToCredit?.name,
      currency: accountToCredit?.currency,
      product: accountToCredit?.type ? +accountToCredit?.type : Number(accountToCredit?.product)
    };

    const userCredit = this.utilWorkFlow.getUserDataTransaction(userDataCredit);


    const attributeAccountCredit: IBasicAttributeVC = {
      label: 'account_to_be_credited',
      class: `${reference ? 'order-lg-5' : 'order-lg-3'}`,
      values: userCredit
    }

    groupGrid.attributes.push(this.base.builderDataReading(attributeAccountDebited));
    groupGrid.attributes.push(this.base.builderDataReading(attributeAmountAttribute));
    groupGrid.attributes.push(this.base.builderDataReading(attributeAccountCredit));

    if (email) {
      const attributeNotify: IBasicAttributeVC = {
        label: 'notify_to',
        class: `${reference ? 'order-lg-7' : 'order-lg-5'}`,
        values: [email ?? '']
      }
      groupGrid.attributes.push(this.base.builderDataReading(attributeNotify));
    }

    if (comment) {
      const attributeComment: IBasicAttributeVC = {
        label: 'comment',
        class: `${reference ? 'order-lg-2' : 'order-lg-6'}`,
        values: [comment ?? '']
      }
      groupGrid.attributes.push(this.base.builderDataReading(attributeComment));
    }

    groupList.push(groupGrid);

    const favoriteWidget = new FavoriteWidget()
      .icon('sprint2-icon-favoritos')
      .label('add_to_favorite')
      .build();

    return new DataReadingBuilder()
      .title(sampleVoucherProps?.title)
      .subtitle(sampleVoucherProps?.subtitle)
      .class(`padding-side ${isFavorite ? 'is_favorite' : ''}`)
      .isFavoriteWidget(isShowFavoriteWidget ? favoriteWidget : null as any)
      .groupList(groupList)
      .build();
  }

}
