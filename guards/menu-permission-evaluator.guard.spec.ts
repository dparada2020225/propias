import { TestBed } from '@angular/core/testing';

import { StorageService } from '@adf/security';
import { Router, RouterStateSnapshot } from '@angular/router';
import { MockRouterStateSnapshot } from 'src/assets/mocks/modules/transfer/service/own-transfer/build.route-snapshot.mock';
import { mockPromise } from 'src/assets/testing';
import { FindServiceCodeService } from '../service/common/find-service-code.service';
import { MenuPermissionEvaluatorGuard } from './menu-permission-evaluator.guard';

describe('MenuPermissionEvaluatorGuard', () => {
  let guard: MenuPermissionEvaluatorGuard;
  let storage: jasmine.SpyObj<StorageService>;
  let findServiceCode: jasmine.SpyObj<FindServiceCodeService>;
  let router: jasmine.SpyObj<Router>;
  let routerStateSnapshot: RouterStateSnapshot;

  beforeEach(() => {
    const storageSpy = jasmine.createSpyObj('StorageService', ['getItem']);
    const findServiceCodeSpy = jasmine.createSpyObj('FindServiceCodeService', ['getServiceCode', 'searchMenuEquivalence']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: StorageService, useValue: storageSpy },
        { provide: FindServiceCodeService, useValue: findServiceCodeSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });
    guard = TestBed.inject(MenuPermissionEvaluatorGuard);
    storage = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
    findServiceCode = TestBed.inject(FindServiceCodeService) as jasmine.SpyObj<FindServiceCodeService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    routerStateSnapshot = new MockRouterStateSnapshot('/own-transfer/credit');
    router.navigate.and.returnValue(mockPromise(true));
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should Menu Permission Evaluator Guard navigate to home and return false', () => {
    findServiceCode.getServiceCode.and.returnValue('ptr-lisptm');
    storage.getItem.and.returnValue(JSON.stringify('test'));
    findServiceCode.searchMenuEquivalence.and.returnValue(false);
    const res = guard.canActivate(null as any, routerStateSnapshot);
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
    expect(res).toBeFalsy();
  });

  it('should Menu Permission Evaluator Guard return true', () => {
    findServiceCode.getServiceCode.and.returnValue('ptr-lisptm');
    storage.getItem.and.returnValue(JSON.stringify('test'));
    findServiceCode.searchMenuEquivalence.and.returnValue(true);
    const res = guard.canActivate(null as any, routerStateSnapshot);
    expect(router.navigate).not.toHaveBeenCalledWith(['/home']);
    expect(res).toBeTruthy();
  });

  it('should Menu Permission Evaluator Guard not found serviceCode', () => {
    findServiceCode.getServiceCode.and.returnValue(null as any);
    const res = guard.canActivate(null as any, routerStateSnapshot);
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
    expect(res).toBeFalsy();
  });
});
