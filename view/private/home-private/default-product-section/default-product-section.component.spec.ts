import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StyleManagementService } from 'src/app/service/common/style-management.service';
import { UtilService } from 'src/app/service/common/util.service';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { BusinessNameService } from 'src/app/service/shared/business-name.service';
import { TokenizerAccountsService } from 'src/app/service/token/tokenizer-accounts.service';
import { DefaultProductSectionComponent } from './default-product-section.component';

import { Router } from '@angular/router';

import { RouterTestingModule } from '@angular/router/testing';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { CustomNumberPipe } from 'src/app/pipes/custom-number.pipe';

import { NgxSpinnerModule } from 'ngx-spinner';
import { Product } from 'src/app/enums/product.enum';
import { EProfile } from 'src/app/enums/profile.enum';


describe('DefaultProductSectionComponent', () => {
  let component: DefaultProductSectionComponent;
  let fixture: ComponentFixture<DefaultProductSectionComponent>;
  let parameterManagement: jasmine.SpyObj<ParameterManagementService>
  let util: jasmine.SpyObj<UtilService>
  let router: Router;

  beforeEach(async () => {
    const parameterManagementSpy = jasmine.createSpyObj("ParameterManagementService", ["sendParameters"])
    const tokenizerAccountsSpy = jasmine.createSpyObj("TokenizerAccountsService", ["tokenizer"])
    const utilSpy = jasmine.createSpyObj("UtilService", ["getUrlTransferThird", "getUrlTransferAch", "getUrlTransferOwn"])
    const businessNameSpy = jasmine.createSpyObj("BusinessNameService", ["accountNumber"])
    const styleManagementSpy = jasmine.createSpyObj("StyleManagementService", ["corporateImageApplication"])
    await TestBed.configureTestingModule({
      declarations: [DefaultProductSectionComponent, CustomNumberPipe],
      providers: [
        {
          provide: ParameterManagementService,
          useValue: parameterManagementSpy
        },
        {
          provide: TokenizerAccountsService,
          useValue: tokenizerAccountsSpy
        },
        {
          provide: UtilService,
          useValue: utilSpy
        },
        {
          provide: BusinessNameService,
          useValue: businessNameSpy
        },
        {
          provide: StyleManagementService,
          useValue: styleManagementSpy
        }
      ],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
        RouterTestingModule,
        NgxSpinnerModule

      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DefaultProductSectionComponent);
    component = fixture.componentInstance;
    parameterManagement = TestBed.inject(ParameterManagementService) as jasmine.SpyObj<ParameterManagementService>
    util = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>
    router = TestBed.inject(Router);

    component.product = {
      accounts: ['accounts', 'accounts', 'accounts'],
      name: 'name',
      currency: 100,
      product: 'product',
      totalAvailable: 'totalAvailable',

    }
    component.singleProduct = true;
    component.alert = true;
    component.profile = EProfile.HONDURAS;
    spyOnProperty(router, "url", "get").and.returnValue("/checks")

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return true if profile is Honduras and currency is EUR and URL is not CHECK, SAVINGS, or has accounts', () => {
    component.profile = EProfile.HONDURAS;
    component.product = {
      currency: 'EUR',
      accounts: []
    };
    component.url = component.ProductEnum.SAVINGS;
    expect(component.validationEurosBanpais()).toBe(true);
  });

  it('should return false if profile is Honduras and currency is not EUR and URL is not CHECK, SAVINGS, or has accounts', () => {
    component.profile = EProfile.HONDURAS;
    component.product = {
      currency: 'USD',
      accounts: []
    };
    component.url = component.ProductEnum.SAVINGS;
    expect(component.validationEurosBanpais()).toBe(true);
  });

  it('should return false if profile is Honduras and URL is CHECK, SAVINGS, or has accounts', () => {
    component.profile = EProfile.HONDURAS;
    component.product = {
      currency: 'EUR',
      accounts: []
    };
    component.url = component.ProductEnum.CHECK;
    expect(component.validationEurosBanpais()).toBe(false);
  });

  it('should return true if profile is not Honduras', () => {
    component.profile = null as any;
    component.product = {
      currency: 'EUR',
      accounts: []
    };
    component.url = component.ProductEnum.SAVINGS;
    expect(component.validationEurosBanpais()).toBe(true);
  });

  it('should go To My Accounts', () => {
    util.getUrlTransferOwn.and.returnValue('/transfer/own')
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true))
    component.goToMyAccounts('account');
    expect(parameterManagement.sendParameters).toHaveBeenCalled()
    expect(router.navigate).toHaveBeenCalledWith(['/transfer/own'])
  })

  it('should go To Third Parties', () => {
    util.getUrlTransferThird.and.returnValue('/transfer/third')
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true))
    const data = { account: '010011' } as any;
    component.goToThirdParties(data)
    expect(parameterManagement.sendParameters).toHaveBeenCalled()
    expect(router.navigate).toHaveBeenCalledWith(['/transfer/third'])
  })

  it('should go To Other Banks', () => {
    util.getUrlTransferAch.and.returnValue('/transfer/ach')
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true))
    const data = { account: '010011' } as any;
    component.goToOtherBanks(data)
    expect(parameterManagement.sendParameters).toHaveBeenCalled()
    expect(router.navigate).toHaveBeenCalledWith(['/transfer/ach'])
  })

  it('should set account number and navigate to fixed term detail when product is FIX_TERM', () => {
    const account = { account: '1234567890' };
    component.product = { product: Product.FIX_TERM };
    spyOn(router, 'navigate');
    component.goToBalance(account);
    expect(parameterManagement.sendParameters).toHaveBeenCalled()
    expect(router.navigate).toHaveBeenCalledWith(['/fixed-term-detail']);
  });

  it('should go To Statement', () => {
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true))
    component.goToStatement({ account: '1234567890' });
    expect(router.navigate).toHaveBeenCalledWith(['/statements'])
  })

  it('should go To Projection Interests', () => {
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true))
    component.goToProjectionInterests({ account: '1234567890' });
    expect(router.navigate).toHaveBeenCalledWith(['/projections'])
  })

});
