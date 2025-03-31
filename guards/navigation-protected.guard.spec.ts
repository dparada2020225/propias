import { TestBed } from '@angular/core/testing';

import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import {
  MockActivatedRouteSnapshot,
  MockRouterStateSnapshot,
} from 'src/assets/mocks/modules/transfer/service/own-transfer/build.route-snapshot.mock';
import { mockPromise } from 'src/assets/testing';
import { ParameterManagementService } from '../service/navegation-parameters/parameter-management.service';
import { NavigationProtectedGuard } from './navigation-protected.guard';

describe('NavigationProtectedGuard', () => {
  let guard: NavigationProtectedGuard;
  let routerStateSnapshot: RouterStateSnapshot;
  let router: jasmine.SpyObj<Router>;
  let activatedSnapshot;

  beforeEach(() => {
    const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', ['']);
    const parameterManagerSpy = jasmine.createSpyObj('ParameterManagementService', ['getParameter', 'sendParameters']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: ParameterManagementService, useValue: parameterManagerSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });
    guard = TestBed.inject(NavigationProtectedGuard);
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    routerStateSnapshot = new MockRouterStateSnapshot('own-transfer');
    activatedSnapshot = new MockActivatedRouteSnapshot();

    router.navigate.and.returnValue(mockPromise(true));
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should return false', () => {
    const res = guard.canActivate(activatedSnapshot, routerStateSnapshot);
    expect(res).toBeFalsy();
  });
});
