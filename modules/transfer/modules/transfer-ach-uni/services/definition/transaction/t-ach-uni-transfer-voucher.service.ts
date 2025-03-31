import { Injectable } from '@angular/core';
import { IAchUniDVoucher, IAchUniVoucherLayout } from '../../../interfaces/ach-uni-definition';
import { IAccount } from 'src/app/models/account.inteface';
import { AchUniFormValues } from '../../../interfaces/ach-uni-transfer.interface';
import { TAchUniTransferManagerService } from './t-ach-uni-transfer-manager.service';
import { EachUniTransferManagerService } from '../../execution/e-ach-uni-transfer-manager.service';
import { AdfFormatService, AttributeReadingBuilder, DataReadingBuilder, IDataReading, IGroupAttributes } from '@adf/components';
import { IUserDataTransaction } from 'src/app/models/util-work-flow.interface';
import { UtilWorkFlowService } from 'src/app/service/common/util-work-flow.service';
import { AtdUtilService } from '../../../../transfer-ach/services/atd-util.service';
import { TAchUniTransferUtilService } from './t-ach-uni-transfer-util.service';
import { UtilService } from 'src/app/service/common/util.service';
import { EProductFromCode } from 'src/app/enums/product.enum';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class TAchUniTransferVoucherService {

  constructor(
    private adfFormat: AdfFormatService,
    private  utilWorkFlow: UtilWorkFlowService,
    private atdUtils: AtdUtilService,
    private atdUtil: TAchUniTransferUtilService,
    private util: UtilService,
    private translate: TranslateService,
  ) { }

  buildVoucherConfirmationLayout(properties: IAchUniDVoucher): IDataReading {
    const { transactionResponse, formValues, sourceAccount, targetAccount, bank, purpose } = properties ?? {};
    const { amount, comment, commission } = formValues;

    const groupList: IGroupAttributes[] = [];
    const groupGrid: IGroupAttributes = {
      view: 'v-grid',
      attributes: [],
    };

    const userDataDebited: IUserDataTransaction = {
      account: sourceAccount?.account ?? 'undefined',
      alias: sourceAccount?.alias ?? 'undefined',
      currency: sourceAccount?.currency ?? 'undefined',
      product: sourceAccount?.product
    };

    const userDebited = this.utilWorkFlow.getUserDataTransactionAchUniAccountInfo(userDataDebited);

    const attributeAccountDebited = new AttributeReadingBuilder()
      .label('ach-uni:transfer-source-account')
      .values(userDebited)
      .build();
    groupGrid.attributes.push(attributeAccountDebited);

    const attributeAccountDebitedName = new AttributeReadingBuilder()
    .label('ach-uni:transfer-source-account-name')
    .values([sourceAccount.name])
    .build();
    groupGrid.attributes.push(attributeAccountDebitedName);

    const attributeAmountDebited = new AttributeReadingBuilder()
      .label('ach-uni:ammount')
      .values([`${'USD'} ${this.adfFormat.formatAmount(formValues?.amount)}`])
      .build();
    groupGrid.attributes.push(attributeAmountDebited);

    const attributeTargetBank = new AttributeReadingBuilder()
      .label('ach-uni:bank')
      .values([`${bank?.description ?? 'UNDEFINED'}`])
      .build();
    groupGrid.attributes.push(attributeTargetBank);

    const userDataCredit: IUserDataTransaction = {
      account: targetAccount?.account,
      alias: targetAccount?.alias,
      name: targetAccount?.name,
      currency: targetAccount?.currency,
      product: this.atdUtil.getProduct(targetAccount?.type || '0'),
    };
    const userCredit = this.utilWorkFlow.getUserDataTransactionAchUniAccountCreditInfo(userDataCredit);

    const attributeAccountCredit = new AttributeReadingBuilder()
      .label('ach-uni:transfer-target-account')
      .values([targetAccount.account])
      .build();
    groupGrid.attributes.push(attributeAccountCredit);


    const userCreditAccountType = this.utilWorkFlow.getUserDataTransactionAchUniTypeAccountCreditInfo(userDataCredit);
    const codeProduct = Number(this.getCodeFromAccountType(targetAccount?.type));

    const attributeTypeAccountCredit = new AttributeReadingBuilder()
    .label('ach-uni:transfer-target-account-type')
    .values([`${this.util.getLabelProduct(codeProduct).toUpperCase()}`])
    .build();
    groupGrid.attributes.push(attributeTypeAccountCredit);

    const attributePurpose = new AttributeReadingBuilder()
    .label('ach-uni:purpose')
    .values([`${purpose?.code} - ${purpose?.description}`])
    .build();
    groupGrid.attributes.push(attributePurpose);

    if (formValues?.comment) {
      const attributeComment = new AttributeReadingBuilder()
        .label('ach-uni:comment')
        .values([formValues?.comment ?? 'UNDEFINED'])
        .build();
      groupGrid.attributes.push(attributeComment);
    }

    const attributeCommission = new AttributeReadingBuilder()
    .label('ach-uni:commission')
    .values([`${sourceAccount?.currency} ${this.adfFormat.formatAmount(commission)}`])
    .build();
    groupGrid.attributes.push(attributeCommission);

    groupList.push(groupGrid);

    return new DataReadingBuilder()
      .title('')
      .subtitle(properties?.subtitle)
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

  buildVoucherForStView(properties: IAchUniDVoucher): IDataReading {
    const { formValues, sourceAccount, targetAccount, bank, purpose } = properties ?? {};
    const { commission } = formValues;

    const groupList: IGroupAttributes[] = [];
    const groupGrid: IGroupAttributes = {
      view: 'v-grid',
      attributes: [],
    };


    const userDataDebited: IUserDataTransaction = {
      account: sourceAccount?.account ?? 'undefined',
      alias: sourceAccount?.alias ?? 'undefined',
      currency: sourceAccount?.currency ?? 'undefined',
      product: sourceAccount?.product
    };

    const userDebited = this.utilWorkFlow.getUserDataTransactionAchUniAccountInfo(userDataDebited);
    const attributeAccountDebited = new AttributeReadingBuilder()
      .label('ach-uni:transfer-source-account')
      .values(userDebited)
      .build();
    groupGrid.attributes.push(attributeAccountDebited);

    const attributeAccountDebitedName = new AttributeReadingBuilder()
      .label('ach-uni:transfer-source-account-name')
      .values([sourceAccount.name])
      .build();
    groupGrid.attributes.push(attributeAccountDebitedName);

    const attributeAmountDebited = new AttributeReadingBuilder()
      .label('ach-uni:ammount')
      .values([`${'USD'} ${this.adfFormat.formatAmount(formValues?.amount)}`])
      .build();
    groupGrid.attributes.push(attributeAmountDebited);

    const attributeTargetBank = new AttributeReadingBuilder()
      .label('ach-uni:bank')
      .values([`${bank?.description ?? 'UNDEFINED'}`])
      .build();
    groupGrid.attributes.push(attributeTargetBank);

    const attributeAccountCredit = new AttributeReadingBuilder()
      .label('ach-uni:transfer-target-account')
      .values([targetAccount.account])
      .build();
    groupGrid.attributes.push(attributeAccountCredit);


    const attributeTypeAccountCredit = new AttributeReadingBuilder()
      .label('ach-uni:transfer-target-account-type')
      .values([`${this.util.getLabelProduct(targetAccount.product)}`])
      .build();
    groupGrid.attributes.push(attributeTypeAccountCredit);

    if (purpose) {
      const attributePurpose = new AttributeReadingBuilder()
        .label('ach-uni:purpose')
        .values([`${purpose?.code} - ${purpose?.description}`])
        .build();
      groupGrid.attributes.push(attributePurpose);
    }

    if (formValues?.comment) {
      const attributeComment = new AttributeReadingBuilder()
        .label('ach-uni:comment')
        .values([formValues?.comment ?? 'UNDEFINED'])
        .build();
      groupGrid.attributes.push(attributeComment);
    }

    const attributeCommission = new AttributeReadingBuilder()
      .label('ach-uni:commission')
      .values([`${sourceAccount?.currency} ${this.adfFormat.formatAmount(commission)}`])
      .build();
    groupGrid.attributes.push(attributeCommission);

    groupList.push(groupGrid);

    return new DataReadingBuilder()
      .groupList(groupList)
      .build();
  }
}
