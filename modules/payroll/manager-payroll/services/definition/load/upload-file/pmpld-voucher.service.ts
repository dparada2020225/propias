import {Injectable} from '@angular/core';
import {
  AdfFormatService,
  AttributeReadingBuilder,
  DataReadingBuilder,
  IDataReading,
  IGroupAttributes
} from '@adf/components';
import {environment} from '../../../../../../../../environments/environment';
import {SplfdVoucherParameters} from '../../../../interfaces/pmp-voucher.interface';

@Injectable({
  providedIn: 'root'
})
export class PmpldVoucherService {

  constructor(
    private adfFormatService: AdfFormatService  ) {}


  buildVoucherLayout(parameters: SplfdVoucherParameters): IDataReading {
    const { title, subtitle, credits, amount } = parameters;
    const groupList: IGroupAttributes[] = [];

    const groupGrid: IGroupAttributes = {
      view: 'v-grid',
      attributes: [],
    };

    const attributeAmount = new AttributeReadingBuilder()
      .label('total_amount')
      .values([`${environment.currency} ${ this.adfFormatService.formatAmount(amount ?? 0)}`])
      .build();

    const attributeCredits = new AttributeReadingBuilder()
      .label('payroll:total_accounts_accredit')
      .values([`${credits}`])
      .build();


    groupGrid.attributes.push(attributeAmount);
    groupGrid.attributes.push(attributeCredits);
    groupList.push(groupGrid);

    return new DataReadingBuilder()
      .title(title)
      .subtitle(subtitle)
      .groupList(groupList)
      .build();
  }
}
