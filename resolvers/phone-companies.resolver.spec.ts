import { TestBed } from '@angular/core/testing';

import { mockObservableError } from 'src/assets/testing';
import { SecurityOptionService } from '../service/private/security-option/security-option.service';
import { PhoneCompaniesResolver } from './phone-companies.resolver';

describe('PhoneCompaniesResolver', () => {
  let resolver: PhoneCompaniesResolver;
  let securityOptionService: jasmine.SpyObj<SecurityOptionService>;

  beforeEach(() => {
    const securityOptionServiceSpy = jasmine.createSpyObj('SecurityOptionService', ['getPhoneCompanies'])
    TestBed.configureTestingModule({
      providers: [
        { provide: SecurityOptionService, useValue: securityOptionServiceSpy },
      ]
    });
    resolver = TestBed.inject(PhoneCompaniesResolver);
    securityOptionService = TestBed.inject(SecurityOptionService) as jasmine.SpyObj<SecurityOptionService>;
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  it('should Phone Companies Resolver have error', () => {
    securityOptionService.getPhoneCompanies.and.returnValue(mockObservableError('error'));
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
