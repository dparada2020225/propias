import {TestBed} from '@angular/core/testing';

import {BankingAuthenticationService} from '@adf/security';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {FeatureManagerService} from '../common/feature-manager.service';
import {SmartCoreService} from '../common/smart-core.service';
import {PasswordRecoveryService} from './password-recovery.service';
import {UtilTransactionService} from "../common/util-transaction.service";

describe('PasswordRecoveryService', () => {
  let service: PasswordRecoveryService;

  let smartCore: jasmine.SpyObj<SmartCoreService>;
  let bankingService: jasmine.SpyObj<BankingAuthenticationService>;
  let managementMethod: jasmine.SpyObj<FeatureManagerService>;
  let utilTransaction: jasmine.SpyObj<UtilTransactionService>;
  let httpController: HttpTestingController;

  beforeEach(() => {

    const smartCoreSpy = jasmine.createSpyObj('SmartCoreService', ['personalizationOperation'])
    const bankingServiceSpy = jasmine.createSpyObj('BankingAuthenticationService', ['encrypt'])
    const managementMethodSpy = jasmine.createSpyObj('FeatureManagerService', ['implementMethod'])
    const utilTransactionSpy = jasmine.createSpyObj('UtilTransactionService', ['addHeaderToken'])

    TestBed.configureTestingModule({
      providers: [
        {provide: SmartCoreService, useValue: smartCoreSpy},
        {provide: BankingAuthenticationService, useValue: bankingServiceSpy},
        {provide: FeatureManagerService, useValue: managementMethodSpy},
        {provide: UtilTransactionService, useValue: utilTransactionSpy},
      ],
      imports: [
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(PasswordRecoveryService);
    smartCore = TestBed.inject(SmartCoreService) as jasmine.SpyObj<SmartCoreService>;
    bankingService = TestBed.inject(BankingAuthenticationService) as jasmine.SpyObj<BankingAuthenticationService>;
    managementMethod = TestBed.inject(FeatureManagerService) as jasmine.SpyObj<FeatureManagerService>;
    utilTransaction = TestBed.inject(UtilTransactionService) as jasmine.SpyObj<UtilTransactionService>;
    httpController = TestBed.inject(HttpTestingController);

    utilTransaction.addHeaderToken.and.returnValue({} as any)
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get Password', () => {
    managementMethod.implementMethod.and.returnValue(true)
    const dto = {userName: 'RECINOS', isEmailOption: true, isTokenRequired: 'DFLNDJ', tokenValue: 'MBLOOP'}
    const dataMock = {status: 200, statusText: 'Succefully'}

    service.getPassword(dto.userName, dto.isEmailOption, dto.isTokenRequired, dto.tokenValue).subscribe((data) => {
      expect(data).toEqual(dataMock)
      expect(smartCore.personalizationOperation).toHaveBeenCalled();
    })

    const url = `/v1/reset-password/${dto.userName}/sendemail`;
    const req = httpController.expectOne(url)
    req.flush(dataMock)
    expect(req.request.method).toEqual('POST');
  })

  it('should get Info Token User', () => {
    const dto: string = 'CARLOS';
    bankingService.encrypt.and.returnValue(dto);
    const dataMock = {status: 200, statusText: 'Succefully'}

    service.getInfoTokenUser(dto).subscribe((data) => {
      expect(data).toEqual(dataMock);
      expect(bankingService.encrypt).toHaveBeenCalled();
    })

    const url = '/v1/exposed/agreement/user';
    const req = httpController.expectOne(url)
    req.flush(dataMock)
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({username: dto})
  })

});
