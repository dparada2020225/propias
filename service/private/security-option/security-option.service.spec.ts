import {TestBed} from '@angular/core/testing';

import {SmartcoreCheckpointService, StorageService} from '@adf/security';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {EProfile} from 'src/app/enums/profile.enum';
import {SmartCoreService} from '../../common/smart-core.service';
import {TokenizerAccountsService} from '../../token/tokenizer-accounts.service';
import {SecurityOptionService} from './security-option.service';

describe('SecurityOptionService', () => {
  let service: SecurityOptionService;
  let smartCore: jasmine.SpyObj<SmartCoreService>;
  let storageService: jasmine.SpyObj<StorageService>;
  let tokenizerEncrypt: jasmine.SpyObj<TokenizerAccountsService>;
  let smartcoreCheckpointService: jasmine.SpyObj<SmartcoreCheckpointService>;
  let httpController: HttpTestingController;

  beforeEach(() => {

    const smartCoreSpy = jasmine.createSpyObj('SmartCoreService', ['personalizationOperation'])
    const storageServiceSpy = jasmine.createSpyObj('StorageService', ['getItem'])
    const tokenizerEncryptSpy = jasmine.createSpyObj('TokenizerAccountsService', ['tokenizer'])
    const smartcoreCheckpointServiceSpy = jasmine.createSpyObj('SmartcoreCheckpointService', ['useSmartidV5', 'setCheckpointHeaderEncryted'])

    TestBed.configureTestingModule({
      providers: [
        { provide: SmartCoreService, useValue: smartCoreSpy },
        { provide: StorageService, useValue: storageServiceSpy },
        { provide: TokenizerAccountsService, useValue: tokenizerEncryptSpy },
        { provide: SmartcoreCheckpointService, useValue: smartcoreCheckpointServiceSpy },
      ],
      imports: [
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(SecurityOptionService);
    httpController = TestBed.inject(HttpTestingController);
    smartCore = TestBed.inject(SmartCoreService) as jasmine.SpyObj<SmartCoreService>;
    storageService = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
    tokenizerEncrypt = TestBed.inject(TokenizerAccountsService) as jasmine.SpyObj<TokenizerAccountsService>;
    smartcoreCheckpointService = TestBed.inject(SmartcoreCheckpointService) as jasmine.SpyObj<SmartcoreCheckpointService>;
  });

  afterEach(() => {
    httpController.verify();
  });


  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set and get profile', () => {
    service.setProfile({ profile: EProfile.SALVADOR });
    expect(service.getProfile).toEqual({ profile: EProfile.SALVADOR } as any)
  })

  it('should set ang get phone', () => {
    service.setPhone('85692145')
    expect(service.getPhone).toEqual('85692145')
  })

  it('should set and get is simple navbar', () => {
    service.setSimpleNavbar(true);
    expect(service.getSimpleNavbar).toBeTruthy();
  })

  it('should get Password Period', () => {
    const dataMock = { period: '5000' }

    service.getPasswordPeriod().subscribe((data) => {
      expect(data).toEqual(dataMock)
    })

    const url = '/v1/sec-profile/new-security-profile/password-periods';
    const req = httpController.expectOne(url);
    req.flush(dataMock);

    expect(req.request.method).toEqual('GET');
  })

  it('should get Phone Companies', () => {
    const dataMock = { phoneCompanies: 3 }

    service.getPhoneCompanies().subscribe((data) => {
      expect(data).toEqual(dataMock)
    })

    const url = '/v1/sec-profile/new-security-profile/phone-companies';
    const req = httpController.expectOne(url);
    req.flush(dataMock);
    expect(req.request.method).toEqual('GET');
  })

  it('should update Contact', () => {
    const dataMock = { code: 200, response: 'sucessfully' }
    const dto = { phone: '58965214', codeOperator: '1', email: 'test@example.com', sendSms: true, areaCode: '1' }
    tokenizerEncrypt.tokenizer.and.returnValue(dto);

    //service.updateContact(dto.phone, dto.codeOperator, dto.email, dto.sendSms, dto.areaCode).subscribe({
    //  next: (value) => {
    //    expect(value).toEqual(dataMock);
    //  },
    //})

    const url = '/v1/sec-profile/new-security-profile/update-contact';
    const req = httpController.expectOne(url);
    req.flush(dataMock);
    expect(req.request.body).toEqual({ data: dto })
    expect(req.request.method).toEqual('POST')
  })

  it('should update Passwor Period', () => {
    storageService.getItem.and.returnValue(JSON.stringify({ customerCode: '2' }));
    const dataMock = { reponse: 'success' };
    const dto = '3';

    service.updatePassworPeriod(dto).subscribe({
      next: (value) => {
        expect(value).toEqual(dataMock)
      },
    })

    const url: string = '/v1/sec-profile/new-security-profile/update-password-period';
    const req = httpController.expectOne(url)
    req.flush(dataMock)
    expect(req.request.method).toEqual('PUT');
    expect(req.request.body).toEqual({
      type: 'COMMON',
      codePeriod: dto,
      customer: '2'
    })
  })

  it('should validate Affiliation', () => {
    const dto: string = '148';
    const dataMock = { code: 200 };

   // service.validateAffiliation(dto).subscribe({
    //  next: (value) => {
   //     expect(value).toEqual(dataMock)
   //   },
   // })

    const url: string = '/v1/sec-profile/new-security-profile/validate-affiliation';
    const req = httpController.expectOne(url);
    req.flush(dataMock);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({
      codeAffiliation: dto
    })
  })

  it('should send Affiliation Code', () => {
    const dto = { phone: '8596347', codeOperator: '3' }
    const dataMock = { response: 200, responseType: 'success' }

   // service.sendAffiliationCode(dto.phone, dto.codeOperator).subscribe({
     // next: (value) => {
      //  expect(value).toEqual(dataMock)
      //},
    //})

    const url: string = '/v1/sec-profile/new-security-profile/send-affiliation-code';
    const req = httpController.expectOne(url);
    req.flush(dataMock);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(dto)
  })

});
