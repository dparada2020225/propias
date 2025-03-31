import { Injectable } from '@angular/core';
import { ICADDetailTransactionPDFParameters } from '../../interfaces/consult-ach-definition.interface';
import { TranslateService } from '@ngx-translate/core';
import { ICOTransactionCreditDetail } from '../../interfaces/navigate-parameters.interface';
import { AdfFormatService } from '@adf/components';
import { UtilService } from '../../../../../../service/common/util.service';
import { UtilWorkFlowService } from '../../../../../../service/common/util-work-flow.service';
import { IUserDataModalPdf } from '../../../../../../models/util-work-flow.interface';
import { IPrintData, PrintBuilder, PrintDataBuilder } from '../../../../interface/print-data-interface';

@Injectable({
  providedIn: 'root'
})
export class CadPdfService {

  constructor(
    private util: UtilService,
    private format: AdfFormatService,
    private utilWorkFlow: UtilWorkFlowService,
    private translate: TranslateService
  ) { }

  buildVoucherPdf(parameters: ICADDetailTransactionPDFParameters, transactionCreditDetail?: ICOTransactionCreditDetail) {
    const { detailTransaction, reference } = parameters;

    const attributes: IPrintData[] = [];

    const originAccount = new PrintDataBuilder()
      .label('root-account')
      .title(true)
      .value('')
      .build();
    attributes.push(originAccount);

    const date = this.format.getFormatDateTime(transactionCreditDetail?.operationDate || '');

    const operationDate = new PrintDataBuilder()
      .label('operation-date')
      .value(`${date.fullFormat}`)
      .build();
    attributes.push(operationDate);

    const typeAccount = new PrintDataBuilder()
      .label('root-account-type')
      .value(`${this.translate.instant(this.util.getProductName(this.util.parseCustomNumber(transactionCreditDetail?.product as string)))}`)
      .build();
    attributes.push(typeAccount);

    const userDataDebited: IUserDataModalPdf = {
      account: transactionCreditDetail?.debitAccount as string,
      name: transactionCreditDetail?.debitAccountName as string,
    };

    const userDebited = this.utilWorkFlow.getUserDataModalPdf(userDataDebited);

    const accountDebited = new PrintDataBuilder()
      .label('account-debited')
      .value(`${userDebited}`)
      .build();
    attributes.push(accountDebited);

    const amountDebited = new PrintDataBuilder()
      .label('amount-debited')
      .value(`${this.util.getCurrencySymbolToIso(transactionCreditDetail?.currency || '')} ${this.format.formatAmount(transactionCreditDetail?.amount || '')}`)
      .build();
    attributes.push(amountDebited);


    const destinationAccount = new PrintDataBuilder()
      .label('destination-account')
      .title(true)
      .build();
    attributes.push(destinationAccount);

    const creditAccount = new PrintDataBuilder()
      .label('credit_account')
      .value(`${transactionCreditDetail?.beneficiaryAccount}`)
      .build();
    attributes.push(creditAccount);

    const financialInstitution = new PrintDataBuilder()
      .label('financial-institution')
      .value(detailTransaction?.issuingDestination || '')
      .build();
    attributes.push(financialInstitution);

    const achName = new PrintDataBuilder()
      .label('currency_name_header')
      .value(detailTransaction?.senderBeneficiary || '')
      .build();
    attributes.push(achName);

    const achResult = new PrintDataBuilder()
      .label('ach-result')
      .value(detailTransaction?.status ?? 'UNDEFINED')
      .build();
    attributes.push(achResult);


    return new PrintBuilder()
      .title('transfers_other_banks')
      .account({ ...detailTransaction, referenceNumber: reference })
      .referenceNumber(reference ?? 'UNDEFINED')
      .fileName(this.translate.instant('consult-ach-filename'))
      .items(attributes)
      .build();
  }
}
