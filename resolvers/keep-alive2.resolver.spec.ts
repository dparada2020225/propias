import { TestBed } from '@angular/core/testing';

import { KeepAliveService, SmartidNavigationService, StorageService } from '@adf/security';
import { RouterStateSnapshot } from '@angular/router';
import { MockRouterStateSnapshot } from 'src/assets/mocks/modules/transfer/service/own-transfer/build.route-snapshot.mock';
import { mockObservable, mockObservableError } from 'src/assets/testing';
import { UtilWorkFlowService } from '../service/common/util-work-flow.service';
import { HomePrivateService } from '../service/private/home-private.service';
import { KeepAlive2Resolver } from './keep-alive2.resolver';

describe('KeepAlive2Resolver', () => {
  let resolver: KeepAlive2Resolver;
  let keepAliveService: jasmine.SpyObj<KeepAliveService>;
  let utilWorkFlowService: jasmine.SpyObj<UtilWorkFlowService>;
  let routerSMock: RouterStateSnapshot;

  beforeEach(() => {

    const homePrivateServiceSpy = jasmine.createSpyObj('HomePrivateService', [''])
    const keepAliveServiceSpy = jasmine.createSpyObj('KeepAliveService', ['keepAlive'])
    const storageSpy = jasmine.createSpyObj('StorageService', [''])
    const smartIdNavigationServiceSpy = jasmine.createSpyObj('SmartidNavigationService', [''])
    const utilWorkFlowServiceSpy = jasmine.createSpyObj('UtilWorkFlowService', ['handleMarkSecureNavigation'])

    TestBed.configureTestingModule({
      providers: [
        { provide: HomePrivateService, useValue: homePrivateServiceSpy },
        { provide: KeepAliveService, useValue: keepAliveServiceSpy },
        { provide: StorageService, useValue: storageSpy },
        { provide: SmartidNavigationService, useValue: smartIdNavigationServiceSpy },
        { provide: UtilWorkFlowService, useValue: utilWorkFlowServiceSpy },
      ]
    });
    resolver = TestBed.inject(KeepAlive2Resolver);
    keepAliveService = TestBed.inject(KeepAliveService) as jasmine.SpyObj<KeepAliveService>;
    utilWorkFlowService = TestBed.inject(UtilWorkFlowService) as jasmine.SpyObj<UtilWorkFlowService>;
    routerSMock = new MockRouterStateSnapshot('/keepAlive');
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  it('resolver KeepAlive2Resolver response sucefully', () => {
    keepAliveService.keepAlive.and.returnValue(mockObservable('200'));
    resolver.resolve(null as any, routerSMock).subscribe({
      next: (value) => {
        expect(value).toEqual('200');
        expect(utilWorkFlowService.handleMarkSecureNavigation).toHaveBeenCalledWith('/keepAlive')
      },
      error: (error) => {
        expect(error).toBeUndefined();
      }
    })
  })

  it('resolver KeepAlive2Resolver but response have error', () => {
    keepAliveService.keepAlive.and.returnValue(mockObservableError('500'));
    resolver.resolve(null as any, routerSMock).subscribe({
      next: (value) => {
        expect(value).toEqual([])
      },
      error: (error) => {
        expect(error).toEqual('500');
      }
    })
  })

});
