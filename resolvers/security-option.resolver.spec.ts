import { TestBed } from '@angular/core/testing';

import { StorageService } from '@adf/security';
import { CheckProfileService } from '../service/general/check-profile.service';
import { SecurityOptionService } from '../service/private/security-option/security-option.service';
import { SecurityOptionResolver } from './security-option.resolver';

describe('SecurityOptionResolver', () => {
  let resolver: SecurityOptionResolver;
  let checkProfileService: jasmine.SpyObj<CheckProfileService>;
  let securityOptionService: jasmine.SpyObj<SecurityOptionService>;
  let storageService: jasmine.SpyObj<StorageService>;

  beforeEach(() => {

    const checkProfileServiceSpy = jasmine.createSpyObj('CheckProfileService', ['getProfile', 'setProfile'])
    const securityOptionServiceSpy = jasmine.createSpyObj('SecurityOptionService', ['getProfile'])
    const storageServiceSpy = jasmine.createSpyObj('StorageService', ['getItem'])

    TestBed.configureTestingModule({
      providers: [
        { provide: CheckProfileService, useValue: checkProfileServiceSpy },
        { provide: SecurityOptionService, useValue: securityOptionServiceSpy },
        { provide: StorageService, useValue: storageServiceSpy },
      ]
    });
    resolver = TestBed.inject(SecurityOptionResolver);
    checkProfileService = TestBed.inject(CheckProfileService) as jasmine.SpyObj<CheckProfileService>;
    securityOptionService = TestBed.inject(SecurityOptionService) as jasmine.SpyObj<SecurityOptionService>;
    storageService = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  it('should resolve with error message if profile is not empty', () => {
    resolver.profile = null as any;
    resolver.resolve().subscribe({
      next: (value) => {
        expect(value).toEqual('Error SecurityOptionResolver ')
      },
    })
  });

});
