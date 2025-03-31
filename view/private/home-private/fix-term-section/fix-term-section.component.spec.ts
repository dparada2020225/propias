import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { CustomNumberPipe } from 'src/app/pipes/custom-number.pipe';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { BusinessNameService } from 'src/app/service/shared/business-name.service';
import { TokenizerAccountsService } from 'src/app/service/token/tokenizer-accounts.service';
import { MockTranslatePipe } from 'src/assets/mocks/public/tranlatePipeMock';
import { FixTermSectionComponent } from './fix-term-section.component';

describe('FixTermSectionComponent', () => {
  let component: FixTermSectionComponent;
  let fixture: ComponentFixture<FixTermSectionComponent>;

  let router: Router;
  let parameterManagementService: jasmine.SpyObj<ParameterManagementService>;
  let businessName: jasmine.SpyObj<BusinessNameService>;

  beforeEach(async () => {


    const translateSpy = jasmine.createSpyObj('TranslateService', ['instant', 'get'])
    const parameterManagementServiceSpy = jasmine.createSpyObj('ParameterManagementService', ['sendParameters'])
    const tokenizerEncryptSpy = jasmine.createSpyObj('TokenizerAccountsService', ['tokenizer'])
    const businessNameSpy = jasmine.createSpyObj('BusinessNameService', ['accountNumber'])

    await TestBed.configureTestingModule({
      declarations: [FixTermSectionComponent, CustomNumberPipe, MockTranslatePipe],
      providers: [
        { provide: TranslateService, useValue: translateSpy },
        { provide: ParameterManagementService, useValue: parameterManagementServiceSpy },
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
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();

    fixture = TestBed.createComponent(FixTermSectionComponent);
    component = fixture.componentInstance;
    parameterManagementService = TestBed.inject(ParameterManagementService) as jasmine.SpyObj<ParameterManagementService>;
    businessName = TestBed.inject(BusinessNameService) as jasmine.SpyObj<BusinessNameService>;
    router = TestBed.inject(Router)
    spyOnProperty(router, 'url', 'get').and.returnValue('/fixed-term')
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true))
    component.product = {
      accounts: []
    }
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should go To Balance', () => {
    component.goToBalance({ account: '78521' })
    expect(parameterManagementService.sendParameters).toHaveBeenCalled()
    expect(router.navigate).toHaveBeenCalledWith(['/fixed-term-detail'])
  })

  it('should go To Statement', () => {
    component.goToStatement({ account: '78521' })
    expect(businessName.accountNumber).toEqual('78521')
    expect(parameterManagementService.sendParameters).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/statements'])
  })

  it('should go To Projection Interests', () => {
    component.goToProjectionInterests({ account: '123456' })
    expect(businessName.accountNumber).toEqual('123456')
    expect(router.navigate).toHaveBeenCalledWith(['/projections'])
  })

});
