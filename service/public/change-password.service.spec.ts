import {TestBed} from '@angular/core/testing';

import {BankingAuthenticationService, SmartcoreCheckpointService, StorageService} from '@adf/security';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {SmartCoreService} from '../common/smart-core.service';
import {ChangePasswordService} from './change-password.service';
import {ParameterManagementService} from "../navegation-parameters/parameter-management.service";
import {UtilTransactionService} from "../common/util-transaction.service";
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from "@ngx-translate/core";

describe('ChangePasswordService', () => {
  let service: ChangePasswordService;

  let smartCore: jasmine.SpyObj<SmartCoreService>;
  let storageService: jasmine.SpyObj<StorageService>;
  let bankingService: jasmine.SpyObj<BankingAuthenticationService>;
  let utilTransaction: jasmine.SpyObj<UtilTransactionService>;
  let smartcoreCheckpointService: jasmine.SpyObj<SmartcoreCheckpointService>;
  let parameterManagement: jasmine.SpyObj<ParameterManagementService>;
  let httpController: HttpTestingController;

  beforeEach(() => {

    const smartCoreSpy = jasmine.createSpyObj('SmartCoreService', ['personalizationOperation'])
    const storageServiceSpy = jasmine.createSpyObj('StorageService', ['getItem'])
    const bankingServiceSpy = jasmine.createSpyObj('BankingAuthenticationService', ['encrypt'])
    const utilTransactionSpy = jasmine.createSpyObj('UtilTransactionService', ['addHeaderToken'])
    const smartcoreCheckpointServiceSpy = jasmine.createSpyObj('SmartcoreCheckpointService', ['setCheckpointHeaderEncryted', 'useSmartidV5'])
    const parameterManagementSpy = jasmine.createSpyObj('ParameterManagementService', ['getParameter'])

    TestBed.configureTestingModule({
      providers: [
        { provide: SmartCoreService, useValue: smartCoreSpy },
        { provide: StorageService, useValue: storageServiceSpy },
        { provide: BankingAuthenticationService, useValue: bankingServiceSpy },
        { provide: UtilTransactionService, useValue: utilTransactionSpy },
        { provide: SmartcoreCheckpointService, useValue: smartcoreCheckpointServiceSpy },
        { provide: ParameterManagementService, useValue: parameterManagementSpy },
      ],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ]
    });
    service = TestBed.inject(ChangePasswordService);
    smartCore = TestBed.inject(SmartCoreService) as jasmine.SpyObj<SmartCoreService>;
    storageService = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
    bankingService = TestBed.inject(BankingAuthenticationService) as jasmine.SpyObj<BankingAuthenticationService>;
    utilTransaction = TestBed.inject(UtilTransactionService) as jasmine.SpyObj<UtilTransactionService>;
    smartcoreCheckpointService = TestBed.inject(SmartcoreCheckpointService) as jasmine.SpyObj<SmartcoreCheckpointService>;
    parameterManagement = TestBed.inject(ParameterManagementService) as jasmine.SpyObj<ParameterManagementService>;
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  xit('should send New Password', () => {
    bankingService.encrypt.and.returnValue('1')

    const dto = { username: 'VCONTRERAS2', lastPasswordTemp: '1', newPasswordTemp: '1', tokenValue: 'XDFRDE4' }
    const dataMock = 'Hola'

    service.sendNewPassword(dto.username, dto.lastPasswordTemp, dto.newPasswordTemp, dto.tokenValue).subscribe((data) => {
      expect(data).toEqual(dataMock)
      expect(smartCore.personalizationOperation).toHaveBeenCalled();
    })

    const url = `/v1/reset-password/exposed/${dto.username}`
    const req = httpController.expectOne(url)
    req.flush(dataMock)
    expect(req.request.body).toEqual({
      lastPassword: dto.lastPasswordTemp,
      newPassword: dto.newPasswordTemp,
    })
    expect(req.request.method).toEqual('PUT')
  })

  xit('should send New Password 2', () => {
    storageService.getItem.and.returnValue(JSON.stringify({ userLoggedIn: 'true', currentToken: {
      app_id: 'app'
    } }))
    bankingService.encrypt.and.returnValue('1')

    const dto = { username: 'VCONTRERAS2', lastPasswordTemp: '1', newPasswordTemp: '1', tokenValue: 'XDFRDE4' }
    const dataMock = 'Hola'

    service.sendNewPassword(dto.username, dto.lastPasswordTemp, dto.newPasswordTemp, dto.tokenValue).subscribe((data) => {
      expect(data).toEqual(dataMock)
      expect(smartCore.personalizationOperation).toHaveBeenCalled();
    })

    const url = `/v1/reset-password/logged/${dto.username}`
    const req = httpController.expectOne(url)
    req.flush(dataMock)
    expect(req.request.body).toEqual({
      lastPassword: dto.lastPasswordTemp,
      newPassword: dto.newPasswordTemp,
      sessionId: '1'
    })
    expect(req.request.method).toEqual('PUT')
  })

  it('should get and set User Name', () => {
    service.sendUserName('VCONTRERAS')
    expect(service.getUserName()).toEqual('VCONTRERAS')
  })

});
