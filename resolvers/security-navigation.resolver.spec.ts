import { TestBed } from '@angular/core/testing';

import { MockRouterStateSnapshot } from 'src/assets/mocks/modules/transfer/service/own-transfer/build.route-snapshot.mock';
import { UtilWorkFlowService } from '../service/common/util-work-flow.service';
import { SecurityNavigationResolver } from './security-navigation.resolver';

describe('SecurityNavigationResolver', () => {
  let resolver: SecurityNavigationResolver;
  let utilWorkFlowService: jasmine.SpyObj<UtilWorkFlowService>;

  beforeEach(() => {
    const utilWorkFlowServiceSpy = jasmine.createSpyObj('UtilWorkFlowService', ['handleMarkSecureNavigation'])
    TestBed.configureTestingModule({
      providers: [
        SecurityNavigationResolver,
        { provide: UtilWorkFlowService, useValue: utilWorkFlowServiceSpy },
      ]
    });
    resolver = TestBed.inject(SecurityNavigationResolver);
    utilWorkFlowService = TestBed.inject(UtilWorkFlowService) as jasmine.SpyObj<UtilWorkFlowService>;
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  it('should Security Navigation Resolver response ok', () => {
    const rou = new MockRouterStateSnapshot('/home')
    const response = resolver.resolve(null as any, rou);
    expect(utilWorkFlowService.handleMarkSecureNavigation).toHaveBeenCalledWith('/home');
    expect(response).toEqual('ok')
  })

});
