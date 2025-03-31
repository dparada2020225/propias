import { AdfFormatService } from '@adf/components';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IDTDPdf } from '../../interfaces/donation-definition.interface';
import { IPrintData, PrintBuilder, PrintDataBuilder } from '../../../../interface/print-data-interface';
import { UtilService } from 'src/app/service/common/util.service';
import { UtilWorkFlowService } from 'src/app/service/common/util-work-flow.service';
import { IUserDataModalPdf } from 'src/app/models/util-work-flow.interface';

@Injectable({
  providedIn: 'root'
})
export class DtdTransferPdfService {

  constructor(
    private util: UtilService,
    private utilWorkFlow: UtilWorkFlowService,
    private formatService: AdfFormatService,
    private translateService: TranslateService
  ) { }

  buildDonationTransferPdf(pdfProperties: IDTDPdf) {
    const { formValues, date, accountDebited, fundationAccredit, title, fileName, referenceNumber } = pdfProperties ?? {}

    const { amount } = formValues;
    const attributes: IPrintData[] = [];

    const sourceAccountDonation = new PrintDataBuilder()
      .label('root-account')
      .title(true)
      .build();

    const operationDateDonation = new PrintDataBuilder()
      .label('operation-date')
      .value(`${date?.numberFormat} ${date?.hourSuffix}`)
      .build();

    const typeAccountDonation = new PrintDataBuilder()
      .label('root-account-type')
      .value(this.util.getLabelProduct(accountDebited?.product ?? 0))
      .build();

    const userDataDebit: IUserDataModalPdf = {
      account: accountDebited?.account,
      name: accountDebited?.name
    };

    const userDebit = this.utilWorkFlow.getUserDataModalPdf(userDataDebit);

    const accountDebit = new PrintDataBuilder()
      .label('account-debited')
      .value(userDebit)
      .build();

    const amountDebit = new PrintDataBuilder()
      .label('amount-debited')
      .value(`${this.util.geCurrencSymbol(accountDebited?.currency ?? '')}. ${this.formatService.formatAmount(amount)}`)
      .build();

    const destinationAccount = new PrintDataBuilder()
      .label('destination-account')
      .title(true)
      .build();

    const userDataCredit: IUserDataModalPdf = {
      account: fundationAccredit?.account,
      name: fundationAccredit?.name
    };

    const userCredit = this.utilWorkFlow.getUserDataModalPdf(userDataCredit);

    const accountCredit = new PrintDataBuilder()
      .label('donation_to')
      .value(userCredit)
      .build();

    const typeCreditAccount = new PrintDataBuilder()
      .label('root-account-type')
      .value(this.util.getLabelProduct(+fundationAccredit?.productCode ?? 0))
      .build();

    attributes.push(sourceAccountDonation);
    attributes.push(operationDateDonation);
    attributes.push(typeAccountDonation);
    attributes.push(accountDebit);
    attributes.push(amountDebit);
    attributes.push(destinationAccount);
    attributes.push(accountCredit);
    attributes.push(typeCreditAccount);

    return new PrintBuilder()
      .items(attributes)
      .account({ ...accountDebit, ...fundationAccredit, referenceNumber, date })
      .referenceNumber(referenceNumber)
      .fileName(this.translateService.instant(fileName ?? 'undefined'))
      .title(title)
      .build();
  }
}
