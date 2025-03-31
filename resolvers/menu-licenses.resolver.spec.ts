import {TestBed} from '@angular/core/testing';

import {NgxSpinnerService} from 'ngx-spinner';
import {mockObservable, mockObservableError} from 'src/assets/testing';
import {MenuOptionLicensesService} from '../service/common/menu-option-licenses.service';
import {ParameterManagementService} from '../service/navegation-parameters/parameter-management.service';
import {MenuLicensesResolver} from './menu-licenses.resolver';

describe('MenuLicensesResolver', () => {
  let resolver: MenuLicensesResolver;
  let spinner: jasmine.SpyObj<NgxSpinnerService>;
  let menuOptionsLicenses: jasmine.SpyObj<MenuOptionLicensesService>;
  let parameterManagementService: jasmine.SpyObj<ParameterManagementService>;

  beforeEach(() => {
    const spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['show']);
    const menuOptionsLicensesSpy = jasmine.createSpyObj('MenuOptionLicensesService', ['getMenuLicenses']);
    const parameterManagementServiceSpy = jasmine.createSpyObj('ParameterManagementService', ['getParameter']);

    TestBed.configureTestingModule({
      providers: [
        { provide: NgxSpinnerService, useValue: spinnerSpy },
        { provide: MenuOptionLicensesService, useValue: menuOptionsLicensesSpy },
        { provide: ParameterManagementService, useValue: parameterManagementServiceSpy },
      ],
    });
    resolver = TestBed.inject(MenuLicensesResolver);
    spinner = TestBed.inject(NgxSpinnerService) as jasmine.SpyObj<NgxSpinnerService>;
    menuOptionsLicenses = TestBed.inject(MenuOptionLicensesService) as jasmine.SpyObj<MenuOptionLicensesService>;
    parameterManagementService = TestBed.inject(ParameterManagementService) as jasmine.SpyObj<ParameterManagementService>;
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  xit('should Menu Licenses Resolver response sucefully', () => {
    menuOptionsLicenses.getMenuLicenses.and.returnValue(
      mockObservable({
        ['license']: true,
      }) as any
    );

    resolver.resolve({ data: { service: 'transfer' } } as any, null as any).subscribe({
      next: (value) => {
        expect(value).toEqual({ license: true } as any);
        expect(parameterManagementService.getParameter).toHaveBeenCalled();
        expect(spinner.show).toHaveBeenCalled();
      },
      error: (err) => {
        expect(err).toBeUndefined();
      },
    });
  });

  xit('should Menu Licenses Resolver but response have error', () => {
    menuOptionsLicenses.getMenuLicenses.and.returnValue(
      mockObservableError({
        status: 500,
        error: 'test',
      })
    );

    resolver.resolve({ data: { service: 'transfer' } } as any, null as any).subscribe({
      next: (value) => {
        expect(value).toEqual({
          status: 500,
          message: 'internal_server_error',
          error: 'test',
        });
      },
      error: (err) => {
        expect(err).toEqual({
          status: 500,
          message: 'internal_server_error',
          error: 'test',
        });
      },
    });
  });
});
