import { TestBed } from '@angular/core/testing';

import { NgxSpinnerService } from 'ngx-spinner';
import { mockObservable, mockObservableError } from 'src/assets/testing';
import { HomePrivateService } from '../service/private/home-private.service';
import { ProductsResolver } from './products.resolver';

describe('ProductsResolver', () => {
  let resolver: ProductsResolver;
  let spinner: jasmine.SpyObj<NgxSpinnerService>;
  let homePrivateService: jasmine.SpyObj<HomePrivateService>;

  beforeEach(() => {
    const spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['show'])
    const homePrivateServiceSpy = jasmine.createSpyObj('HomePrivateService', ['getAvailableProducts'])

    TestBed.configureTestingModule({
      providers: [
        { provide: NgxSpinnerService, useValue: spinnerSpy },
        { provide: HomePrivateService, useValue: homePrivateServiceSpy },
      ]
    });

    resolver = TestBed.inject(ProductsResolver);
    spinner = TestBed.inject(NgxSpinnerService) as jasmine.SpyObj<NgxSpinnerService>;
    homePrivateService = TestBed.inject(HomePrivateService) as jasmine.SpyObj<HomePrivateService>;
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  it('should Products Resolver response sucefully', () => {
    homePrivateService.getAvailableProducts.and.returnValue(mockObservable(200))
    resolver.resolve(null as any, null as any).subscribe({
      next: (response) => {
        expect(response).toEqual(200);
        expect(spinner.show).toHaveBeenCalled();
      },
      error: (error) => {
        expect(error).toBeUndefined();
      }
    })
  })

  it('should Products Resolver but response have error', () => {
    homePrivateService.getAvailableProducts.and.returnValue(mockObservableError(500))
    resolver.resolve(null as any, null as any).subscribe({
      next: (response) => {
        expect(response).toEqual([]);
        expect(spinner.show).toHaveBeenCalled();
      },
      error: (error) => {
        expect(error).toEqual(500);
      }
    })
  })

});
