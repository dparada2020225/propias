import { Injectable } from '@angular/core';
import { AttributeReadingBuilder, DataReadingBuilder, IGroupAttributes } from '@adf/components';
import {
  ITMAtomicACHTransactionDetailVoucherParameters, ITMConsultACHLoteVoucherParameters
} from '../../interfaces/tm-atomic-transaction-detail.interface';
import { ETMACHService } from '../../enum/form-control-name.enum';
import { TmdAchUtilsService } from './tmd-ach-utils.service';

@Injectable({
  providedIn: 'root'
})
export class TmdAchAtomicDetailService {

  constructor(
    private achUtils: TmdAchUtilsService,
  ) { }

  buildTransactionLayout(parameters: ITMAtomicACHTransactionDetailVoucherParameters) {
    const { transaction, className, typeService } = parameters;
    const {
      typeOperation,
      service,
      date,
      idTransference,
      sourceAccount,
      sourceAccountName,
      status,
    } = transaction;

    const groupTargetAccount = this.achUtils.buildDataForTargetAccount(parameters);
    const groupList: IGroupAttributes[] = [];

    const groupGeneralInformation: IGroupAttributes = {
      view: 'v-grid',
      attributes: [],
    };


    const groupDataOperation: IGroupAttributes = {
      view: 'v-grid',
      attributes: [],
    };


    const attributeTypeOperation = new AttributeReadingBuilder()
      .label('operation_type')
      .values([typeOperation])
      .class(className ?? '')
      .build();
    groupGeneralInformation.attributes.push(attributeTypeOperation);

    if (typeService === ETMACHService.ATOMIC) {
      const attributeService = new AttributeReadingBuilder()
        .label('label:service')
        .values([this.achUtils.getServiceName(service)])
        .class(className ?? '')
        .build();
      groupGeneralInformation.attributes.push(attributeService);
    }


    const attributeDateCreated = new AttributeReadingBuilder()
      .label('tm:ach:date_created')
      .values([date])
      .class(className ?? '')
      .build();
    groupGeneralInformation.attributes.push(attributeDateCreated);

    const attributeIdTransference = new AttributeReadingBuilder()
      .label('tm:ach:no_transference')
      .values([idTransference])
      .class(className ?? '')
      .build();
    groupGeneralInformation.attributes.push(attributeIdTransference);

    const attributeSourceAccount = new AttributeReadingBuilder()
      .label('account-debited')
      .values([`${sourceAccount} ${sourceAccountName}`])
      .class(className ?? '')
      .build();
    groupGeneralInformation.attributes.push(attributeSourceAccount);

    const attributeDataOperation = new AttributeReadingBuilder()
      .label('tm:ach:title_group_data_operation')
      .class('reading-text-uppercase col-md-12 group-title')
      .build();
    groupDataOperation.attributes.push(attributeDataOperation);

    const attributeStatus = new AttributeReadingBuilder()
      .label('status')
      .values([status.toUpperCase()])
      .class(className ?? '')
      .build();
    groupDataOperation.attributes.push(attributeStatus);

    groupList.push(groupGeneralInformation);
    groupList.push(groupTargetAccount);
    groupList.push(groupDataOperation);

    return new DataReadingBuilder()
      .groupList(groupList)
      .build();
  }

  buildDetailLoteTransaction(parameters: ITMConsultACHLoteVoucherParameters) {
    const { transaction } = parameters;
    const {
      date,
      lote,
      status,
      accountName,
      sourceAccount,
    } = transaction;

    const groupList: IGroupAttributes[] = [];

    const groupGeneralInformation: IGroupAttributes = {
      view: 'v-grid',
      attributes: [],
    };

    const attributeDate = new AttributeReadingBuilder()
      .label('date')
      .values([date])
      .build();
    groupGeneralInformation.attributes.push(attributeDate);

    const attributeLote = new AttributeReadingBuilder()
      .label('tm:ach:label_lote')
      .values([lote])
      .build();
    groupGeneralInformation.attributes.push(attributeLote);

    const attributeStatus = new AttributeReadingBuilder()
      .label('status')
      .values([status])
      .build();
    groupGeneralInformation.attributes.push(attributeStatus);

    const attributeSourceAccount = new AttributeReadingBuilder()
      .label('ach:bisv:label_source_account')
      .values([sourceAccount])
      .build();
    groupGeneralInformation.attributes.push(attributeSourceAccount);

    const attributeSourceAccountName = new AttributeReadingBuilder()
      .label('accountName')
      .values([accountName])
      .build();
    groupGeneralInformation.attributes.push(attributeSourceAccountName);

    groupList.push(groupGeneralInformation);

    return new DataReadingBuilder()
      .groupList(groupList)
      .build();
  }
}
