import {TestBed} from '@angular/core/testing';

import {StorageService} from '@adf/security';
import {Router, RouterStateSnapshot} from '@angular/router';
import {
  MockRouterStateSnapshot
} from 'src/assets/mocks/modules/transfer/service/own-transfer/build.route-snapshot.mock';
import {mockPromise} from 'src/assets/testing';
import {FindServiceCodeService} from '../service/common/find-service-code.service';
import {PermissionsService} from '../service/private-main/permissions.service';
import {PermissionsGuard} from './permissions.guard';

describe('PermissionsGuard', () => {
  let guard: PermissionsGuard;
  let router: jasmine.SpyObj<Router>;
  let permissionsService: jasmine.SpyObj<PermissionsService>;
  let storage: jasmine.SpyObj<StorageService>;
  let findServiceCode: jasmine.SpyObj<FindServiceCodeService>;
  let routerStateSnapshot: RouterStateSnapshot;

  beforeEach(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const permissionsServiceSpy = jasmine.createSpyObj('PermissionsService', ['permission']);
    const storageSpy = jasmine.createSpyObj('StorageService', ['getItem', 'addItem']);
    const findServiceCodeSpy = jasmine.createSpyObj('FindServiceCodeService', ['getServiceCode']);

    TestBed.configureTestingModule({
      providers: [
        {provide: Router, useValue: routerSpy},
        {provide: PermissionsService, useValue: permissionsServiceSpy},
        {provide: StorageService, useValue: storageSpy},
        {provide: FindServiceCodeService, useValue: findServiceCodeSpy},
      ],
    });
    guard = TestBed.inject(PermissionsGuard);
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    permissionsService = TestBed.inject(PermissionsService) as jasmine.SpyObj<PermissionsService>;
    storage = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
    findServiceCode = TestBed.inject(FindServiceCodeService) as jasmine.SpyObj<FindServiceCodeService>;
    routerStateSnapshot = new MockRouterStateSnapshot('/own-transfer/credit');
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });


  it('should navidate to login if user not exist', () => {
    router.navigate.and.returnValue(mockPromise(true));
    const res = guard.canActivate(null as any, routerStateSnapshot);
    expect(res).toBeFalsy();
    expect(router.navigate).toHaveBeenCalledWith(['login']);
  });


});
