import {Injectable} from '@angular/core';
import {
  AdfFormatService,
  AttributeReadingBuilder,
  DataReadingBuilder,
  IDataReading,
  IGroupAttributes
} from '@adf/components';
import { environment } from 'src/environments/environment';
import { PSVoucherParameters } from 'src/app/modules/modules/payment-suppliers/managment-payments/components/interfaces/ps-voucher.interface';

@Injectable({
  providedIn: 'root'
})
export class PsVoucherService {

  constructor(
    private adfFormatService: AdfFormatService  ) {}


  buildVoucherLayout(parameters: PSVoucherParameters){
    const { title, credits, amount } = parameters;
    const groupList: IGroupAttributes[] = [];

    const groupGrid: IGroupAttributes = {
      view: 'v-grid',
      attributes: [],
    };

    const attributeAmount = new AttributeReadingBuilder()
      .label('ps:total_amount_label')
/*       ${environment.currency} */      
      .values([`${ this.adfFormatService.formatAmount(amount ?? 0)}`])
      .build();

    const attributeCredits = new AttributeReadingBuilder()
      .label('ps:total_accounts_accredit_file')
      .values([`${credits}`])
      .build();


    groupGrid.attributes.push(attributeAmount);
    groupGrid.attributes.push(attributeCredits);
    groupList.push(groupGrid);

    return new DataReadingBuilder()
      .class('border-0')
      .groupList(groupList)
      .build();
  }

  buildVoucherLayoutManual(parameters: PSVoucherParameters){
    const { title, credits, amount } = parameters;
    const groupList: IGroupAttributes[] = [];

    const groupGrid: IGroupAttributes = {
      view: 'v-grid',
      attributes: [],
    };

    const attributeAmount = new AttributeReadingBuilder()
      .label('ps:total_amount_label')
/*       ${environment.currency} */      
      .values([`${ this.adfFormatService.formatAmount(amount ?? 0)}`])
      .build();

    const attributeCredits = new AttributeReadingBuilder()
      .label('ps:total_accounts_accredit_manual')
      .values([`${credits}`])
      .build();


    groupGrid.attributes.push(attributeAmount);
    groupGrid.attributes.push(attributeCredits);
    groupList.push(groupGrid);

    return new DataReadingBuilder()
      .class('border-0')
      .groupList(groupList)
      .build();
  }
}
