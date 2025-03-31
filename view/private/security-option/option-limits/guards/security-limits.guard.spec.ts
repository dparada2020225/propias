import { TestBed } from '@angular/core/testing';

import { StorageService } from '@adf/security';
import { Router } from '@angular/router';
import { ISettingData } from 'src/app/models/setting-interface';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { mockPromise } from 'src/assets/testing';
import { SecurityLimitsGuard } from './security-limits.guard';

describe('SecurityLimitsGuard', () => {
  let guard: SecurityLimitsGuard;

  let router: jasmine.SpyObj<Router>;
  let parameterManager: jasmine.SpyObj<ParameterManagementService>;
  let storage: jasmine.SpyObj<StorageService>;

  beforeEach(() => {

    const routerSpy = jasmine.createSpyObj('Router', ['navigate'])
    const parameterManagerSpy = jasmine.createSpyObj('ParameterManagementService', ['getParameter'])
    const storageSpy = jasmine.createSpyObj('StorageService', ['getItem'])

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: ParameterManagementService, useValue: parameterManagerSpy },
        { provide: StorageService, useValue: storageSpy },
      ]
    });
    guard = TestBed.inject(SecurityLimitsGuard);
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    parameterManager = TestBed.inject(ParameterManagementService) as jasmine.SpyObj<ParameterManagementService>;
    storage = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should canActivate', () => {
    router.navigate.and.returnValue(mockPromise(true))
    parameterManager.getParameter.and.returnValue({
      userInfo: {
        profile: 'bisv'
      },
      parameterStateNavigation: true,
      isTokenRequired: true,
    });

    const settings: ISettingData = {
      fullUsersByProfile: ['bisv', 'banpais']
    } as any;
    storage.getItem.and.returnValue(JSON.stringify(settings));

    const res = guard.canActivate(null as any, null as any);
    expect(router.navigate).toHaveBeenCalledWith(['home'])
    expect(res).toBeFalsy()

  });

});
