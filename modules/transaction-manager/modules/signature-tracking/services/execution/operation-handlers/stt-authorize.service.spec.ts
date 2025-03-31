import { TestBed } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { UtilService } from 'src/app/service/common/util.service';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { SignatureTrackingService } from '../../transaction/signature-tracking.service';
import { StCommonTransactionService } from '../st-common-transaction.service';
import { SttAuthorizeService } from './stt-authorize.service';

describe('SttAuthorizeService', () => {
  let service: SttAuthorizeService;

  let transactionService: jasmine.SpyObj<SignatureTrackingService>;
  let stCommonTransaction: jasmine.SpyObj<StCommonTransactionService>;
  let parameterManagement: jasmine.SpyObj<ParameterManagementService>;
  let router: jasmine.SpyObj<Router>;
  let utils: jasmine.SpyObj<UtilService>;

  beforeEach(() => {
    const transactionServiceSpy = jasmine.createSpyObj('SignatureTrackingService', ['authorize']);
    const stCommonTransactionSpy = jasmine.createSpyObj('StCommonTransactionService', ['buildBodyRequestToAllOperations']);
    const parameterManagementSpy = jasmine.createSpyObj('ParameterManagementService', ['sendParameters']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const utilsSpy = jasmine.createSpyObj('UtilService', ['hideLoader']);

    TestBed.configureTestingModule({
      providers: [
        { provide: SignatureTrackingService, useValue: transactionServiceSpy },
        { provide: StCommonTransactionService, useValue: stCommonTransactionSpy },
        { provide: ParameterManagementService, useValue: parameterManagementSpy },
        { provide: Router, useValue: routerSpy },
        { provide: UtilService, useValue: utilsSpy },
      ],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
    });

    service = TestBed.inject(SttAuthorizeService);
    transactionService = TestBed.inject(SignatureTrackingService) as jasmine.SpyObj<SignatureTrackingService>;
    stCommonTransaction = TestBed.inject(StCommonTransactionService) as jasmine.SpyObj<StCommonTransactionService>;
    parameterManagement = TestBed.inject(ParameterManagementService) as jasmine.SpyObj<ParameterManagementService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    utils = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
