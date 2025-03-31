import { AdfFormatService } from '@adf/components';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IUserDataModalPdf } from 'src/app/models/util-work-flow.interface';
import {
  IPrint,
  IPrintData,
  PrintBuilder,
  PrintDataBuilder
} from 'src/app/modules/transfer/interface/print-data-interface';
import { UtilWorkFlowService } from 'src/app/service/common/util-work-flow.service';
import { UtilService } from 'src/app/service/common/util.service';
import { ETypeAccount } from '../../../enum/payment-form.enum';
import { IVoucherPaymentTPL } from '../../../interfaces/payment-interface';

@Injectable({
  providedIn: 'root'
})
export class TpldVoucherPdfService {

  constructor(
    private util: UtilService,
    private utilWorkFlow: UtilWorkFlowService,
    private translate: TranslateService,
    private formatService: AdfFormatService
  ) { }

  buildOwnTransferPdf(voucherPdf: IVoucherPaymentTPL): IPrint {
    const accountToDebited = voucherPdf?.rootData;
    const accountToCredit = voucherPdf?.destinationData
    const dateOperation = voucherPdf?.rootData.dateOperation;
    const reference = voucherPdf?.reference;
    const title = 'payments_loans';
    const fileName = 'payments_loans';

    const comment = voucherPdf?.destinationData.comment;
    const attributes: IPrintData[] = [];

    const rootAccountThirdPaymentLoan = new PrintDataBuilder()
      .label('root-account')
      .title(true)
      .value(null!)
      .build();

    const dateTime = this.formatService.getFormatDateTime(dateOperation)

    const operationDatePaymentLoan = new PrintDataBuilder()
      .label('operation-date')
      .value(dateTime?.fullFormat ?? '')
      .build();

    const typeAccountThirdPartyPaymentLoan = new PrintDataBuilder()
      .label('root-account-type')
      .value(this.util.getLabelProduct(voucherPdf?.rootData.typeAccount))
      .build();

    const userDataDebited: IUserDataModalPdf = {
      account: voucherPdf?.rootData.accountDebited,
      name: voucherPdf?.rootData.nameAccount
    };

    const userDebited = this.utilWorkFlow.getUserDataModalPdf(userDataDebited);

    const accountDebitThirdPartyPayment = new PrintDataBuilder()
      .label('account_debited_modalTPL')
      .value(userDebited)
      .build();

    const amountDebitThirdPartyLoan = new PrintDataBuilder()
      .label('amount-debited')
      .value(`${this.util.getCurrencySymbolToIso(voucherPdf?.rootData.currency ?? '')}. ${this.formatService.formatAmount(voucherPdf?.rootData.amountDebited ?? '')}`)
      .build();

    const destinationAccount = new PrintDataBuilder()
      .label('destination-account')
      .title(true)
      .value(null!)
      .build();

    const userDataCredit: IUserDataModalPdf = {
      account: voucherPdf?.destinationData.accountCredit,
      name: voucherPdf?.destinationData.nameLoan
    };

    const userCredit = this.utilWorkFlow.getUserDataModalPdf(userDataCredit);

    const accountCredit = new PrintDataBuilder()
      .label('credited-account')
      .value(userCredit)
      .build();

    const typeCreditAccount = new PrintDataBuilder()
      .label('root-account-type')
      .value(this.util.getLabelProduct(ETypeAccount.LOANS))
      .build();

    attributes.push(rootAccountThirdPaymentLoan);
    attributes.push(operationDatePaymentLoan);
    attributes.push(typeAccountThirdPartyPaymentLoan);
    attributes.push(accountDebitThirdPartyPayment);
    attributes.push(amountDebitThirdPartyLoan);
    attributes.push(destinationAccount);
    attributes.push(accountCredit);
    attributes.push(typeCreditAccount);

    if (comment) {
      const commentAttribute = new PrintDataBuilder()
        .label('comment')
        .value(comment ?? '')
        .build();

      attributes.push(commentAttribute);
    }

    return new PrintBuilder()
      .items(attributes)
      .account({ ...accountToCredit, ...accountToDebited, referenceNumber: reference, date: dateTime })
      .referenceNumber(`${reference ?? ''}`)
      .fileName(this.translate.instant(fileName ?? 'undefined'))
      .title(title)
      .build();
  }


}
