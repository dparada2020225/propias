import { TestBed } from '@angular/core/testing';

import { StorageService } from '@adf/security';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ParameterManagementService } from './parameter-management.service';
import {FindServiceCodeService} from "../common/find-service-code.service";

describe('ParameterManagementService', () => {
  let service: ParameterManagementService;
  let storage: jasmine.SpyObj<StorageService>;
  let router: Router;
  let findServiceCodeService: jasmine.SpyObj<FindServiceCodeService>;

  beforeEach(() => {

    const storageSpy = jasmine.createSpyObj('StorageService', ['getItem', 'addItem'])
    const findServiceCodeServiceSpy = jasmine.createSpyObj('FindServiceCodeService', ['getServiceCode'])

    TestBed.configureTestingModule({
      providers: [
        { provide: StorageService, useValue: storageSpy },
        { provide: FindServiceCodeService, useValue: findServiceCodeServiceSpy },
      ],
      imports: [RouterTestingModule]
    });
    service = TestBed.inject(ParameterManagementService);
    storage = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
    router = TestBed.inject(Router);
    findServiceCodeService = TestBed.inject(FindServiceCodeService) as jasmine.SpyObj<FindServiceCodeService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return an Observable of the shared parameter', () => {
    service.getSharedParameter().subscribe((data) => {
      expect(data).toEqual(service.parameterList$);
    });
  })

  it('should update the parameter list in storage', () => {
    const newParameters = { test: 'value' };
    const parameterListStorage = { oldTest: 'oldValue' };
    storage.getItem.and.returnValue(JSON.stringify(parameterListStorage));

    service.sendParameters(newParameters);

    expect(storage.getItem).toHaveBeenCalledWith('parameterList');
    expect(storage.addItem).toHaveBeenCalledWith(
      'parameterList',
      JSON.stringify({ ...parameterListStorage, ...newParameters })
    );
  });

  it('should return the value of the specified parameter from storage', () => {
    const parameterListStorage = { test: 'value' };
    storage.getItem.and.returnValue(JSON.stringify(parameterListStorage));

    const result = service.getParameter('test');

    expect(storage.getItem).toHaveBeenCalledWith('parameterList');
    expect(result).toEqual('value');
  });

  it('should return undefined if the specified parameter is not in storage', () => {
    const parameterListStorage = { test: 'value' };
    storage.getItem.and.returnValue(JSON.stringify(parameterListStorage));

    const result = service.getParameter('nonexistent');

    expect(storage.getItem).toHaveBeenCalledWith('parameterList');
    expect(result).toBeUndefined();
  });

  it('should return undefined if the parameter list is not in storage', () => {
    storage.getItem.and.returnValue(null);

    const result = service.getParameter('test');

    expect(storage.getItem).toHaveBeenCalledWith('parameterList');
    expect(result).toBeUndefined();
  });

  it('should return the menu equivalence code for the current route', () => {
    const url = 'account-balance';
    spyOn(router, 'parseUrl').and.returnValue(router.createUrlTree([url]));
    findServiceCodeService.getServiceCode.and.returnValue('con-sal')
    const result = service.getMenuEquivalence(router);

    expect(router.parseUrl).toHaveBeenCalledWith(router.url);
    expect(result).toBe('con-sal')
  });

  it('should return undefined if there is no menu equivalence for the current route', () => {
    const url = '/nonexistent';
    spyOn(router, 'parseUrl').and.returnValue(router.createUrlTree([url]));
    findServiceCodeService.getServiceCode.and.returnValue(undefined as any)

    const result = service.getMenuEquivalence(router);

    expect(router.parseUrl).toHaveBeenCalledWith(router.url);
    expect(result).toBeUndefined();
  });

});
