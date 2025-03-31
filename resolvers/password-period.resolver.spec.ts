import { TestBed } from '@angular/core/testing';

import { mockObservableError } from 'src/assets/testing';
import { SecurityOptionService } from '../service/private/security-option/security-option.service';
import { PasswordPeriodResolver } from './password-period.resolver';

describe('PasswordPeriodResolver', () => {
  let resolver: PasswordPeriodResolver;
  let securityOptionService: jasmine.SpyObj<SecurityOptionService>;

  beforeEach(() => {

    const securityOptionServiceSpy = jasmine.createSpyObj('SecurityOptionService', ['getPasswordPeriod'])

    TestBed.configureTestingModule({
      providers: [
        { provide: SecurityOptionService, useValue: securityOptionServiceSpy },
      ]
    });
    resolver = TestBed.inject(PasswordPeriodResolver);
    securityOptionService = TestBed.inject(SecurityOptionService) as jasmine.SpyObj<SecurityOptionService>;
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  it('should be resolve have error', () => {
    securityOptionService.getPasswordPeriod.and.returnValue(mockObservableError('error'))
    resolver.resolve().subscribe({
      next: (value) => {
        expect(value).toBe('error');
      },
      error: (error) => {
        expect(error).toBe('error');
      }
    })
  })

});
