import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { OnResize } from 'src/app/modules/shared/classes/on-risize';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { BusinessNameService } from 'src/app/service/shared/business-name.service';
import { TokenizerAccountsService } from 'src/app/service/token/tokenizer-accounts.service';

/**
 * PRODUCTS: 04, 05
 */
@Component({
  selector: 'loan-section',
  templateUrl: './loan-section.component.html',
  styleUrls: ['./loan-section.component.scss', './../default-product-section/default-product-section.component.scss']
})
export class LoanSectionComponent extends OnResize implements OnInit {

  @Input() product: any;
  @Input() singleProduct!: boolean;
  @Input() profile!: string;
  url: string | undefined;


  emptyMessage!: string;

  constructor(
    private router: Router,
    public translate: TranslateService,
    private parameterManagementService: ParameterManagementService,
    private tokenizerEncrypt: TokenizerAccountsService,
    private businessName: BusinessNameService) {
    super();
    this.parameterManagementService.getSharedParameter().subscribe((data: any) => {
      if (data?.product) {
        this.url = data['product'];
      }
    });
  }

  ngOnInit(): void {
    this.emptyMessage = 'no-accounts-in';
  }

  goToPayment(account: any) {
    this.businessName.accountNumber = account.account;

    const parameters = {
      'service': 'pago-ptmos',
      'sourceAccount': this.tokenizerEncrypt.tokenizer(account.account)
    };

    this.router.navigate(['/loan-payment']).finally(() => {
      this.parameterManagementService.sendParameters(parameters);
    });
  }

  goToStatements(account: any) {
    this.businessName.accountNumber = account.account;

    const parameters = {
      'service': 'estado-cta',
      'sourceAccount': this.tokenizerEncrypt.tokenizer(account.account)
    };

    this.router.navigate(['/loan-account-statement']).finally(() => {
      this.parameterManagementService.sendParameters(parameters);
    });
  }

  goToBalance(account: any) {
    this.businessName.accountNumber = account.account;

    const parameters = {
      'service': 'con-sal',
      'sourceAccount': this.tokenizerEncrypt.tokenizer(account.account)
    };

    this.router.navigate(['/con-sal']).finally(() => {
      this.parameterManagementService.sendParameters(parameters);
    });
  }
}
