import { TestBed } from '@angular/core/testing';

import { StorageService } from '@adf/security';
import { FindServiceCodeService } from '../common/find-service-code.service';
import { PermissionsService } from './permissions.service';

describe('PermissionsService', () => {
  let service: PermissionsService;
  let storageService: jasmine.SpyObj<StorageService>;
  let findService: jasmine.SpyObj<FindServiceCodeService>;

  beforeEach(() => {

    const storageServiceSpy = jasmine.createSpyObj('StorageService', ['getItem'])
    const findServiceSpy = jasmine.createSpyObj('FindServiceCodeService', ['searchMenuEquivalence'])

    TestBed.configureTestingModule({
      providers: [
        { provide: StorageService, useValue: storageServiceSpy },
        { provide: FindServiceCodeService, useValue: findServiceSpy },
      ]
    });
    service = TestBed.inject(PermissionsService);
    storageService = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
    findService = TestBed.inject(FindServiceCodeService) as jasmine.SpyObj<FindServiceCodeService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return true if equivalence program is found in menu list', () => {
    storageService.getItem.and.returnValue(JSON.stringify([{ equivalenceProgram: 'test' }]));
    findService.searchMenuEquivalence.and.returnValue(true);
    const result = service.permission('test', null as any);
    expect(result).toBe(true);
  });

  it('should return false if equivalence program is not found in menu list', () => {
    storageService.getItem.and.returnValue(JSON.stringify([{ equivalenceProgram: 'test' }]));
    findService.searchMenuEquivalence.and.returnValue(false);
    const result = service.permission('test', null as any);
    expect(result).toBe(false);
  });

  it('should return the value of _isValid as an observable', () => {
    (service as any)._isValid.next(true);
    service.isValid.subscribe(value => {
      expect(value).toBe(true);
    });
  });

});
