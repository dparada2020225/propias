import {TestBed} from '@angular/core/testing';

import {HandleTokenRequestService} from './handle-token-request.service';
import {BankingAuthenticationService, StorageService} from "@adf/security";
import {FindServiceCodeService} from "./find-service-code.service";
import {ParameterManagementService} from "../navegation-parameters/parameter-management.service";
import {Router} from "@angular/router";

describe('HandleTokenRequestService', () => {
  let service: HandleTokenRequestService;

  let findServiceCode: jasmine.SpyObj<FindServiceCodeService>;
  let parameterManagement: jasmine.SpyObj<ParameterManagementService>;
  let router: jasmine.SpyObj<Router>;
  let bankingService: jasmine.SpyObj<BankingAuthenticationService>;
  let storage: jasmine.SpyObj<StorageService>;

  beforeEach(() => {

    const findServiceCodeSpy = jasmine.createSpyObj('FindServiceCodeService', ['getTokenRequestServiceCode', 'getTokenRequestSettings'])
    const parameterManagementSpy = jasmine.createSpyObj('ParameterManagementService', ['getParameter'])
    const routerSpy = jasmine.createSpyObj('Router', ['url'])
    const bankingServiceSpy = jasmine.createSpyObj('BankingAuthenticationService', ['encrypt'])
    const storageSpy = jasmine.createSpyObj('StorageService', ['getItem'])

    TestBed.configureTestingModule({
      providers: [
        { provide: FindServiceCodeService, useValue: findServiceCodeSpy },
        { provide: ParameterManagementService, useValue: parameterManagementSpy },
        { provide: Router, useValue: routerSpy },
        { provide: BankingAuthenticationService, useValue: bankingServiceSpy },
        { provide: StorageService, useValue: storageSpy },
      ]
    });

    findServiceCode = TestBed.inject(FindServiceCodeService) as jasmine.SpyObj<FindServiceCodeService>;
    parameterManagement = TestBed.inject(ParameterManagementService) as jasmine.SpyObj<ParameterManagementService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    bankingService = TestBed.inject(BankingAuthenticationService) as jasmine.SpyObj<BankingAuthenticationService>;
    storage = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
    service = TestBed.inject(HandleTokenRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
