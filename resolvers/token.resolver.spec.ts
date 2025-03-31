import { TestBed } from '@angular/core/testing';

import { StorageService } from '@adf/security';
import { TokenService } from '../service/private/token/token.service';
import { TokenResolver } from './token.resolver';

describe('TokenResolver', () => {
  let resolver: TokenResolver;
  let storageService: jasmine.SpyObj<StorageService>;

  beforeEach(() => {

    const tokenServiceSpy = jasmine.createSpyObj('TokenService', [''])
    const storageServiceSpy = jasmine.createSpyObj('StorageService', ['getItem'])

    TestBed.configureTestingModule({
      providers: [
        { provide: TokenService, useValue: tokenServiceSpy },
        { provide: StorageService, useValue: storageServiceSpy },
      ]
    });
    resolver = TestBed.inject(TokenResolver);
    storageService = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  it('should get current token', () => {
    storageService.getItem.and.returnValue(JSON.stringify({ typeToken: 'A' }));
    expect(resolver.resolve()).toEqual('A' as any);
  })

  it('should dont get current token', () => {
    storageService.getItem.and.returnValue(null);
    resolver.resolve().subscribe({
      next: (token) => {
        expect(token).toEqual('Error token resolver')
      },
      error: (err) => {
        expect(err).toEqual('Error token resolver')
      },
    })
  })

});
