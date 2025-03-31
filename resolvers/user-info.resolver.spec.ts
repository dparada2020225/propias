import { TestBed } from '@angular/core/testing';

import { mockObservableError } from 'src/assets/testing';
import { SecurityService } from '../service/private/security.service';
import { UserInfoResolver } from './user-info.resolver';

describe('UserInfoResolver', () => {
  let resolver: UserInfoResolver;
  let securityService: jasmine.SpyObj<SecurityService>;

  beforeEach(() => {
    const securityServiceSpy = jasmine.createSpyObj('SecurityService', ['getUserInfo'])
    TestBed.configureTestingModule({
      providers: [
        { provide: SecurityService, useValue: securityServiceSpy },
      ]
    });
    resolver = TestBed.inject(UserInfoResolver);
    securityService = TestBed.inject(SecurityService) as jasmine.SpyObj<SecurityService>;
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  it('should resolve return error', () => {
    securityService.getUserInfo.and.returnValue(mockObservableError({ error: 'error test' }));
    resolver.resolve().subscribe({
      next() {
        expect(securityService.getUserInfo).toHaveBeenCalled();
      },
      error: (err) => {
        expect(err).toEqual({ error: 'error test' });
      },
    })
  })

});
