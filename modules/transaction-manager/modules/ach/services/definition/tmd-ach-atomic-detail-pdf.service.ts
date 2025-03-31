import { Injectable } from '@angular/core';
import { IPrintData, PrintBuilder, PrintDataBuilder } from '../../../../../transfer/interface/print-data-interface';
import {
  ITMAtomicACHTransactionDetailPdfParameters,
} from '../../interfaces/tm-atomic-transaction-detail.interface';
import { AdfFormatService } from '@adf/components';
import { UtilService } from '../../../../../../service/common/util.service';
import { TranslateService } from '@ngx-translate/core';
import { TmdAchUtilsService } from './tmd-ach-utils.service';

@Injectable({
  providedIn: 'root'
})
export class TmdAchAtomicDetailPdfService {

  constructor(
    private adfFormatService: AdfFormatService,
    private utilData: TmdAchUtilsService,
    private translateService: TranslateService,
  ) { }

  buildLayoutPdf(parameters: ITMAtomicACHTransactionDetailPdfParameters) {
    const { transaction, fileName, title } = parameters;
    const {
      typeOperation,
      service,
      idTransference,
      sourceAccount,
      sourceAccountName,
      status,
    } = transaction;

    const attributes: IPrintData[] = [];

    const attributeTypeOperation = new PrintDataBuilder()
      .label('operation_type')
      .value(typeOperation)
      .build();
    attributes.push(attributeTypeOperation);

    const attributeService = new PrintDataBuilder()
      .label('label:service')
      .value(this.utilData.getServiceName(service))
      .build();
    attributes.push(attributeService);

    const attributeIdTransference = new PrintDataBuilder()
      .label('tm:ach:no_transference')
      .value(idTransference)
      .build();
    attributes.push(attributeIdTransference);

    const dateFormatted = this.adfFormatService.getFormatDateTime(transaction.dateRaw);
    const attributeDateCreated = new PrintDataBuilder()
      .label('tm:ach:date_created')
      .value(transaction.date)
      .build();
    attributes.push(attributeDateCreated);

    const attributeSourceAccount = new PrintDataBuilder()
      .label('account-debited')
      .value(`${sourceAccount} ${sourceAccountName}`)
      .build();
    attributes.push(attributeSourceAccount);

    attributes.push(...this.utilData.buildDataForTargetAccountPdf(parameters));

    const attributeDataOperation = new PrintDataBuilder()
      .label('tm:ach:title_group_data_operation')
      .title(true)
      .build();
    attributes.push(attributeDataOperation);

    const attributeStatus = new PrintDataBuilder()
      .label('status')
      .value(status.toUpperCase())
      .build();
    attributes.push(attributeStatus);

    const nameFile = this.translateService.instant(fileName) + `${transaction.idTransference}_${Date.now()}`;

    return new PrintBuilder()
      .items(attributes)
      .account({ referenceNumber: transaction.idTransference, date: dateFormatted })
      .referenceNumber(idTransference)
      .fileName(nameFile)
      .title(title)
      .build();
  }
}
