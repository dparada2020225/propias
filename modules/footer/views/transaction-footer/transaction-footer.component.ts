import { Component, Input } from '@angular/core';
import { BusinessNameService } from 'src/app/service/shared/business-name.service';
import { environment } from '../../../../../environments/environment'

@Component({
  selector: 'byte-transaction-footer',
  templateUrl: './transaction-footer.component.html',
  styleUrls: ['./transaction-footer.component.scss'],
})
export class TransactionFooterComponent {

  @Input() id!: string;

  businessName = '';
  language!: string;
  today = new Date();
  month = this.today.getMonth() + 1;
  year = this.today.getFullYear();
  day: string;
  constructor(
    private businessNameService: BusinessNameService,
  ) {
    if (this.today.getDate() < 10) {
      this.day = '0' + this.today.getDate();
    } else {
      this.day = this.today.getDate().toString();
    }
    this.businessName = this.businessNameService.getBusiness(environment.profile);
  }
}
