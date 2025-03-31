import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { BusinessNameService } from 'src/app/service/shared/business-name.service';
import { TokenizerAccountsService } from 'src/app/service/token/tokenizer-accounts.service';

@Injectable({
  providedIn: 'root'
})
export class GoToBalanceService {

  constructor(
    private businessName: BusinessNameService,
    private tokenizerEncrypt: TokenizerAccountsService,
    private router: Router,
    private parameterManagementService: ParameterManagementService,


  ) { }

  goToBalance(account: string) {
    this.businessName.accountNumber = account;


    const parameters = {
      'service': 'con-sal',
      'sourceAccount': this.tokenizerEncrypt.tokenizer(account)
    };


    this.router.navigate(['/con-sal']).finally(() => {
      this.parameterManagementService.sendParameters(parameters);
    });
  }

}
