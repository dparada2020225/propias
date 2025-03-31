import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Product } from 'src/app/enums/product.enum';
import { OnResize } from 'src/app/modules/shared/classes/on-risize';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { BusinessNameService } from 'src/app/service/shared/business-name.service';
import { TokenizerAccountsService } from 'src/app/service/token/tokenizer-accounts.service';

@Component({
  selector: 'byte-fix-term-section',
  templateUrl: './fix-term-section.component.html',
  styleUrls: ['./fix-term-section.component.scss'],
})
export class FixTermSectionComponent extends OnResize implements OnInit {
  @Input() product: any;
  @Input() singleProduct!: boolean;
  @Input() alert: boolean = true;
  @Input() profile!: string;
  url: string | undefined;

  ProductEnum = Product;
  emptyMessage!: string;

  constructor(
    private router: Router,
    public translate: TranslateService,
    private parameterManagementService: ParameterManagementService,
    private tokenizerEncrypt: TokenizerAccountsService,
    private businessName: BusinessNameService
  ) {
    super();
  }

  ngOnInit(): void {
    this.emptyMessage = 'no-accounts-in';
    this.productTypeMapping();
  }

  productTypeMapping(): void {
    const url = this.router.url.split('?')[0];

    if (url === '/fixed-term') {
      this.url = this.ProductEnum.FIX_TERM;
      return;
    }

    this.url = undefined;
  }

  goToBalance(account: any) {
    const parameters = {
      product: this.product.product,
      account: account.account,
      // 'account': this.tokenizerEncrypt.tokenizer(account.account)
    };

    this.parameterManagementService.sendParameters(parameters);
    this.router.navigate(['/fixed-term-detail']);
  }

  goToStatement(account: any) {
    this.businessName.accountNumber = account.account;

    const parameters = {
      product: this.product.product,
      // 'account': this.tokenizerEncrypt.tokenizer(account.account),
      account: account.account,
    };
    this.parameterManagementService.sendParameters(parameters);
    this.router.navigate(['/statements']);
  }

  goToProjectionInterests(account: any) {
    this.businessName.accountNumber = account.account;

    const parameters = {
      product: this.product.product,
      // 'account': this.tokenizerEncrypt.tokenizer(account.account)
      account: account.account,
    };
    this.parameterManagementService.sendParameters(parameters);
    this.router.navigate(['/projections']);
  }
}
