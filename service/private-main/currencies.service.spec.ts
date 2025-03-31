import { TestBed } from '@angular/core/testing';

import { StorageService } from '@adf/security';
import { CurrenciesService } from './currencies.service';

describe('CurrenciesService', () => {
  let service: CurrenciesService;
  let storage: jasmine.SpyObj<StorageService>;

  beforeEach(() => {

    const storageSpy = jasmine.createSpyObj('StorageService', ['getItem'])

    TestBed.configureTestingModule({
      providers: [
        { provide: StorageService, useValue: storageSpy },
      ]
    });
    service = TestBed.inject(CurrenciesService);
    storage = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return the currency from storage', () => {
    storage.getItem.and.returnValue(JSON.stringify({ currency: 'USD' }));
    service.getCurrency().subscribe(currency => {
      expect(currency).toEqual('US$');
    });
  });

});
