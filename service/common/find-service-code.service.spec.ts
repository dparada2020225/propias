import {TestBed} from '@angular/core/testing';

import {StorageService} from '@adf/security';
import {IMenuOption} from 'src/app/models/menu.interface';
import {ECustomFeatureValue} from 'src/app/models/service-menu.model';
import {FindServiceCodeService} from './find-service-code.service';

describe('FindServiceCodeService', () => {
  let service: FindServiceCodeService;
  let storage: jasmine.SpyObj<StorageService>;

  beforeEach(() => {
    const storageSpy = jasmine.createSpyObj('StorageService', ['getItem']);
    TestBed.configureTestingModule({
      providers: [{ provide: StorageService, useValue: storageSpy }],
    });
    service = TestBed.inject(FindServiceCodeService);
    storage = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get Service Code', () => {
    storage.getItem.and.returnValue(JSON.stringify({ customFeatures: 'true' }));
    expect(service.getServiceCode('own')).toBeUndefined();
  });

  it('should search Menu Equivalence', () => {
    const serviceCode: string = 'transfer2';
    const list: IMenuOption[] = [
      {
        name: 'Transfer Own',
        service: 'transfer2',
        show: true,
      },
    ];

    expect(service.searchMenuEquivalence(serviceCode, list)).toBeTruthy();
  });

  it('should search Menu Equivalence but not exist', () => {
    const serviceCode: string = 'transfer2';
    const list: IMenuOption[] = [
      {
        name: 'no exist',
        service: 'test',
        show: false,
      },
    ];

    expect(service.searchMenuEquivalence(serviceCode, list)).toBeFalsy();
  });

  xit('should validate Custom Feature', () => {
    const serviceCode = 'someServiceCode';
    const onlineCoreServices = {
      customFeatures: ECustomFeatureValue.ENABLED,
    };
    storage.getItem.and.returnValue(JSON.stringify(onlineCoreServices));

    const result = service.validateCustomFeature(serviceCode);
    expect(result).toBeTruthy();
  });

  it('test_happy_path_returns_home_if_url_is_falsy', () => {
    storage.getItem.and.returnValue(JSON.stringify({ customFeatures: 'true' }));

    const result = service.getUrl(null as any);
    expect(result).toEqual('home');
  });

  xit('test_happy_path_returns_new_url_if_it_exists_in_menuServiceEquivalenceFeatureFlags', () => {
    storage.getItem.and.returnValue(JSON.stringify({ customFeatures: 'true' }));

    const result = service.getUrl('home');
    expect(result).toEqual('loan/third-party-loans/all');
  });
});
