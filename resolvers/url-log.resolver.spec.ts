import { TestBed } from '@angular/core/testing';

import { MockRouterStateSnapshot } from 'src/assets/mocks/modules/transfer/service/own-transfer/build.route-snapshot.mock';
import { ParameterManagementService } from '../service/navegation-parameters/parameter-management.service';
import { UrlLogResolver } from './url-log.resolver';

describe('UrlLogResolver', () => {
  let resolver: UrlLogResolver;
  let parameterManagerService: jasmine.SpyObj<ParameterManagementService>;

  beforeEach(() => {
    const parameterManagerServiceSpy = jasmine.createSpyObj('ParameterManagementService', ['getParameter', 'sendParameters'])
    TestBed.configureTestingModule({
      providers: [
        { provide: ParameterManagementService, useValue: parameterManagerServiceSpy },
      ]
    });
    resolver = TestBed.inject(UrlLogResolver);
    parameterManagerService = TestBed.inject(ParameterManagementService) as jasmine.SpyObj<ParameterManagementService>;
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  it('should response url Log', () => {
    const state = new MockRouterStateSnapshot('/login')
    const urlLog: string[] = ['/home'];
    parameterManagerService.getParameter.and.returnValue(urlLog)
    resolver.resolve(null, state).subscribe({
      next: (res) => {
        expect(res).toEqual(['/home', '/login'])
      }
    })
  })

});
