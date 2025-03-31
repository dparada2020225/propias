import { TestBed } from '@angular/core/testing';

import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { StorageService } from '@adf/security';
import { StokenPreloginGuard } from './stoken-prelogin.guard';

fdescribe('StokenPreloginGuard', () => {
  let guard: StokenPreloginGuard;

  let parameterManager: ParameterManagementService;
  let storageService: jasmine.SpyObj<StorageService>;

  beforeEach(() => {

    const storageServiceSpy = jasmine.createSpyObj('StorageService', ['getItem']);

    TestBed.configureTestingModule({
      providers: [
        { provide: StorageService, useValue: storageServiceSpy }
      ]
    });
    guard = TestBed.inject(StokenPreloginGuard);
    parameterManager = TestBed.inject(ParameterManagementService);
    storageService = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;

  });

  it('should be created StokenPreloginGuard', () => {
    expect(guard).toBeTruthy();
  });

  it('should return true CanActivate() when stokenPrelogin and prelogedIn it´s true', () => {
    storageService.getItem.and.returnValue(true);
    spyOn(parameterManager, 'getParameter').and.returnValue({ stokenPreLog: true });
    const canActive = guard.canActivate();
    expect(canActive).toBeTrue();
  });

  it('should return false CanActivate() when stokenPrelogin and prelogedIn it´s undefined', () => {
    storageService.getItem.and.returnValue(undefined);
    spyOn(parameterManager, 'getParameter').and.returnValue({ stokenPreLog: undefined });
    const canActive = guard.canActivate();
    expect(canActive).toBeFalse();
  });

  it('should return false CanActivate() when stokenPrelogin and prelogedIn it´s undefined', () => {
    storageService.getItem.and.returnValue(undefined);
    spyOn(parameterManager, 'getParameter').and.returnValue(undefined);
    const canActive = guard.canActivate();
    expect(canActive).toBeFalse();
  });

  it('should return false CanActivate() when stokenPrelogin and prelogedIn it´s false', () => {
    storageService.getItem.and.returnValue(false);
    spyOn(parameterManager, 'getParameter').and.returnValue({ stokenPreLog: false });
    const canActive = guard.canActivate();
    expect(canActive).toBeFalse();
  });

});