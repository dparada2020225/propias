import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Router } from '@angular/router';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { CustomNumberPipe } from 'src/app/pipes/custom-number.pipe';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { BusinessNameService } from 'src/app/service/shared/business-name.service';
import { TokenizerAccountsService } from 'src/app/service/token/tokenizer-accounts.service';
import { MockTranslatePipe } from 'src/assets/mocks/public/tranlatePipeMock';
import { LoanSectionComponent } from './loan-section.component';
class ParameterManagementServiceMock {

  getSharedParameter(): any {
    return of({ product: 'foo' })
  }

  sendParameters(): any {
    return {}
  }

}

describe('LoanSectionComponent', () => {
  let component: LoanSectionComponent;
  let fixture: ComponentFixture<LoanSectionComponent>;

  let router: jasmine.SpyObj<Router>;
  let tokenizerEncrypt: jasmine.SpyObj<TokenizerAccountsService>;
  let businessName: jasmine.SpyObj<BusinessNameService>;

  const account = { account: '123456' }

  beforeEach(async () => {

    const routerSpy = jasmine.createSpyObj('Router', ['navigate'])
    const tokenizerEncryptSpy = jasmine.createSpyObj('TokenizerAccountsService', ['tokenizer'])
    const businessNameSpy = jasmine.createSpyObj('BusinessNameService', ['accountNumber'])

    await TestBed.configureTestingModule({
      declarations: [LoanSectionComponent, CustomNumberPipe, MockTranslatePipe],
      providers: [
        ParameterManagementServiceMock,
        { provide: Router, useValue: routerSpy },
        { provide: ParameterManagementService, useClass: ParameterManagementServiceMock },
        { provide: TokenizerAccountsService, useValue: tokenizerEncryptSpy },
        { provide: BusinessNameService, useValue: businessNameSpy },
      ],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(LoanSectionComponent);
    component = fixture.componentInstance;

    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    tokenizerEncrypt = TestBed.inject(TokenizerAccountsService) as jasmine.SpyObj<TokenizerAccountsService>;
    businessName = TestBed.inject(BusinessNameService) as jasmine.SpyObj<BusinessNameService>;

    component.product = { accounts: [] }
    router.navigate.and.returnValue(Promise.resolve(true))
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should go To Payment', () => {
    component.goToPayment(account)
    expect(tokenizerEncrypt.tokenizer).toHaveBeenCalledWith(account.account)
    expect(businessName.accountNumber).toEqual(account.account);
    expect(router.navigate).toHaveBeenCalledWith(['/loan-payment'])
  })

  it('should go to statements', () => {
    component.goToStatements(account)
    expect(tokenizerEncrypt.tokenizer).toHaveBeenCalledWith(account.account)
    expect(businessName.accountNumber).toEqual(account.account);
    expect(router.navigate).toHaveBeenCalledWith(['/loan-account-statement'])
  })

  it('should go To Balance', () => {
    component.goToBalance(account)
    expect(tokenizerEncrypt.tokenizer).toHaveBeenCalledWith(account.account)
    expect(businessName.accountNumber).toEqual(account.account);
    expect(router.navigate).toHaveBeenCalledWith(['/con-sal'])
  })

});
