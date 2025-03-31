import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { OnResize } from 'src/app/modules/shared/classes/on-risize';
import { Product } from 'src/app/enums/product.enum';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { TokenizerAccountsService } from 'src/app/service/token/tokenizer-accounts.service';
import { UtilService } from 'src/app/service/common/util.service';
import { BusinessNameService } from 'src/app/service/shared/business-name.service';
import { StyleManagementService } from 'src/app/service/common/style-management.service';
import { EProfile } from 'src/app/enums/profile.enum';
import {
  ThirdTransferFormValuesBuilder
} from '../../../../modules/transfer/modules/transfer-third/interfaces/third-transfer.interface';
import { IAccountFromHome } from '../../../../models/account.inteface';
import {
  ACHFormValuesBuilder
} from '../../../../modules/transfer/modules/transfer-ach/interfaces/ach-transfer.interface';

/**
 * PRODUCTS: 01, 02, 03
 */
@Component({
  selector: 'default-product-section',
  templateUrl: './default-product-section.component.html',
  styleUrls: ['./default-product-section.component.scss'],
})
export class DefaultProductSectionComponent extends OnResize implements OnInit {
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
    private spinner: NgxSpinnerService,
    private parameterManagementService: ParameterManagementService,
    private tokenizerEncrypt: TokenizerAccountsService,
    private util: UtilService,
    private businessName: BusinessNameService,
    private styleManagement: StyleManagementService
  ) {
    super();
  }

  ngOnInit(): void {
    this.productTypeMapping();
    this.emptyMessage = 'no-accounts-in';
  }

  productTypeMapping(): void {
    const url = this.router.url.split('?')[0];
    switch (url) {
      case '/checks':
        this.url = this.ProductEnum.CHECK;
        break;
      case '/savings':
        this.url = this.ProductEnum.SAVINGS;
        break;
      default:
        this.url = undefined;
        break;
    }
  }

  validationEurosBanpais(): boolean {
    if (this.profile === EProfile.HONDURAS) {
      if (
        (this.product.currency !== 'EUR' && this.url === this.ProductEnum.CHECK) ||
        this.url === this.ProductEnum.SAVINGS ||
        this.product.accounts.length > 0
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

  corporateImageApplication(account: any): boolean {
    return account.status !== 'Activa' && this.styleManagement.corporateImageApplication();
  }

  corporateImageApplicationQuantity(quantity: number): boolean {
    return quantity < 0 && this.styleManagement.corporateImageApplication();
  }

  goToMyAccounts(account: any) {
    this.spinner.show('main-spinner');
    this.parameterManagementService.sendParameters({
      navigateStateParameters: {
        debitedAccount: account,
      }
    });

    this.router.navigate([this.util.getUrlTransferOwn()]).finally(() => {
      this.spinner.hide('main-spinner');
    });
  }

  goToThirdParties(account: IAccountFromHome) {
    const formValues = new ThirdTransferFormValuesBuilder()
      .accountDebited(account.account)
      .build();

    this.parameterManagementService.sendParameters({
      navigateStateParameters: {
        formValues,
      }
    });


    this.router.navigate([this.util.getUrlTransferThird()]).then(() => {});
  }

  goToOtherBanks(account: IAccountFromHome) {
    const formValues = new ACHFormValuesBuilder()
      .accountDebited(account.account)
      .build();

    this.parameterManagementService.sendParameters({
      navigateStateParameters: {
        formValues,
      }
    });

    this.router.navigate([this.util.getUrlTransferAch()]).then(() => {});
  }

  goToBalance(account: any) {
    this.businessName.accountNumber = account.account;
    if (this.product.product === Product.FIX_TERM) {
      let parameters = {};
      parameters['product'] = this.product.product;
      parameters['account'] = this.tokenizerEncrypt.tokenizer(account.account);
      this.parameterManagementService.sendParameters(parameters);
      this.router.navigate(['/fixed-term-detail']);
    } else {
      this.spinner.show('main-spinner');
      setTimeout(() => {
        let parameters = {};
        parameters['product'] = this.product.product;
        parameters['account'] = this.tokenizerEncrypt.tokenizer(account.account);
        this.parameterManagementService.sendParameters(parameters);
        this.router.navigate(['/account-balance']);
      }, 500);
    }
  }

  goToStatement(account: any) {
    this.showSpinner();
    this.businessName.accountNumber = account.account;

    let parameters = {};
    parameters['product'] = this.product.product;
    parameters['account'] = account.account;
    this.router.navigate(['/statements']).finally(() => {
      this.parameterManagementService.sendParameters(parameters);
      this.hideSpinner();
    });
  }

  goToProjectionInterests(account: any) {
    this.businessName.accountNumber = account.account;

    let parameters = {};
    parameters['product'] = this.product.product;
    parameters['account'] = account.account;
    this.parameterManagementService.sendParameters(parameters);
    this.router.navigate(['/projections']);
  }

  showSpinner() {
    this.spinner.show('main-spinner');
  }

  hideSpinner() {
    this.spinner.hide('main-spinner');
  }
}
