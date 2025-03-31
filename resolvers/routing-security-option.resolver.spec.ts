import { TestBed } from '@angular/core/testing';

import { StorageService } from '@adf/security';
import { mockObservableError } from 'src/assets/testing';
import { CheckProfileService } from '../service/general/check-profile.service';
import { RoutingSecurityOptionResolver } from './routing-security-option.resolver';

describe('RoutingSecurityOptionResolver', () => {
  let resolver: RoutingSecurityOptionResolver;
  let checkProfileService: jasmine.SpyObj<CheckProfileService>;
  let storageService: jasmine.SpyObj<StorageService>;

  beforeEach(() => {

    const checkProfileServiceSpy = jasmine.createSpyObj('CheckProfileService', ['getProfile'])
    const storageServiceSpy = jasmine.createSpyObj('StorageService', ['getItem'])

    TestBed.configureTestingModule({
      providers: [
        { provide: CheckProfileService, useValue: checkProfileServiceSpy },
        { provide: StorageService, useValue: storageServiceSpy },
      ]
    });
    resolver = TestBed.inject(RoutingSecurityOptionResolver);
    checkProfileService = TestBed.inject(CheckProfileService) as jasmine.SpyObj<CheckProfileService>;
    storageService = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  it('should Routing Security Option Resolver but return error', () => {
    checkProfileService.getProfile.and.returnValue(mockObservableError(500));
    storageService.getItem.and.returnValue(JSON.stringify({ customerCode: '789' }))
    resolver.resolve().subscribe({
      next: (value) => {
        expect(resolver.info).toEqual({ customerCode: '789' } as any)
        expect(value).toEqual(500)
      },
      error: (err) => {
        expect(err).toEqual(500);
      },
    })
  })

});
