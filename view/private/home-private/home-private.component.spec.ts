import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StorageService } from '@adf/security';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { of, throwError } from 'rxjs';
import { Product } from 'src/app/enums/product.enum';
import { StyleManagementService } from 'src/app/service/common/style-management.service';
import { UtilService } from 'src/app/service/common/util.service';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { HomePrivateService } from 'src/app/service/private/home-private.service';
import { OnboardingModalService } from 'src/app/service/private/onboarding/onboarding-modal.service';
import { RestarIldeService } from 'src/app/service/private/restar-ilde.service';
import { SecurityService } from 'src/app/service/private/security.service';
import { LoginActiveService } from 'src/app/service/public/login-active.service';
import { LocalStorageServiceMock } from 'src/assets/mocks/public/mockLocalStorageServiceMock';
import { HttpStatusCode } from '../../../enums/http-status-code.enum';
import { HomePrivateComponent } from './home-private.component';

describe('HomePrivateComponent', () => {
  let component: HomePrivateComponent;
  let fixture: ComponentFixture<HomePrivateComponent>;

  let homePrivateService: jasmine.SpyObj<HomePrivateService>;
  let spinner: jasmine.SpyObj<NgxSpinnerService>;
  let styleManagement: jasmine.SpyObj<StyleManagementService>;
  let onBoardingModal: jasmine.SpyObj<OnboardingModalService>;

  beforeEach(async () => {
    const utilSpy = jasmine.createSpyObj('UtilService', ['resetStorage']);
    const configSpy = jasmine.createSpyObj('NgbCarouselConfig', ['interval', 'pauseOnHover']);
    const homePrivateServiceSpy = jasmine.createSpyObj('HomePrivateService', [
      'getLoadAccountsParameter',
      'getAccountsByProduct',
      'getOnBoardingDetail',
    ]);
    const securityServiceSpy = jasmine.createSpyObj('SecurityService', ['']);
    const spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);
    const loginActiveServiceSpy = jasmine.createSpyObj('LoginActiveService', ['send']);
    const restarIldeSpy = jasmine.createSpyObj('RestarIldeService', ['restar']);
    const parameterManagementSpy = jasmine.createSpyObj('ParameterManagementService', ['sendParameters', 'getParameter']);
    const styleManagementSpy = jasmine.createSpyObj('StyleManagementService', ['corporateImageApplication']);
    const onBoardingModalSpy = jasmine.createSpyObj('OnboardingModalService', ['validateOnBoarding']);

    await TestBed.configureTestingModule({
      declarations: [HomePrivateComponent],
      providers: [
        HomePrivateComponent,
        LocalStorageServiceMock,
        { provide: UtilService, useValue: utilSpy },
        { provide: NgbCarouselConfig, useValue: configSpy },
        { provide: HomePrivateService, useValue: homePrivateServiceSpy },
        { provide: SecurityService, useValue: securityServiceSpy },
        { provide: NgxSpinnerService, useValue: spinnerSpy },
        { provide: LoginActiveService, useValue: loginActiveServiceSpy },
        { provide: RestarIldeService, useValue: restarIldeSpy },
        {
          provide: Router,
          useValue: {
            browserUrlTree: {
              queryParams: {
                key1: 'value1',
                key2: 'value2',
              },
            },
          },
        },
        { provide: ParameterManagementService, useValue: parameterManagementSpy },
        { provide: StyleManagementService, useValue: styleManagementSpy },
        { provide: StorageService, useClass: LocalStorageServiceMock },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                product: 'https/product',
                summary: true,
              },
            },
            data: of({ result: { products: [] } }),
          },
        },
        { provide: OnboardingModalService, useValue: onBoardingModalSpy },
      ],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(HomePrivateComponent);
    component = fixture.componentInstance;

    homePrivateService = TestBed.inject(HomePrivateService) as jasmine.SpyObj<HomePrivateService>;
    spinner = TestBed.inject(NgxSpinnerService) as jasmine.SpyObj<NgxSpinnerService>;
    styleManagement = TestBed.inject(StyleManagementService) as jasmine.SpyObj<StyleManagementService>;
    onBoardingModal = TestBed.inject(OnboardingModalService) as jasmine.SpyObj<OnboardingModalService>;

    onBoardingModal.validateOnBoarding.and.callFake(() => {});

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return true if currency is allowed and product is not credit card', () => {
    const product1 = { currency: 'USD', product: 'product1' };
    component.activeProduct = null as any;
    const result = component.filterProductToShow(product1);
    expect(result).toBe(true);
  });

  it('should return false if currency is not allowed', () => {
    const product1 = { currency: 'GBP', product: 'product1' };
    component.activeProduct = null as any;
    const result = component.filterProductToShow(product1);
    expect(result).toBe(false);
  });

  it('should return false if active product is not null and does not match product', () => {
    const currencies = { currency: 'USD', product: 'product1' };
    component.activeProduct = 'product2';
    const result = component.filterProductToShow(currencies);
    expect(result).toBe(false);
  });

  it('should build Group Of Product By Accounts', () => {
    const product = {
      product: 'LOAN',
      currency: 'USD',
      subProduct: 'Subproduct 1',
    };
    component.buildGroupOfProductByAccounts(product);
    expect(component.products.length).toBe(2);
  });

  it('should handle Group Of Product By Active Product', () => {
    component.activeProduct = Product.LOAN;
    component.handleGroupOfProductByActiveProduct();
    expect(component.activeProduct).toEqual(Product.LOANS);
    expect(component.productTypes.length).toBe(4);
  });

  it('should handle Group Of Product By Disabled Product', () => {
    component.handleGroupOfProductByDisabledProduct();
    expect(component.productTypes.length).toBe(4);
    expect(component.currencies.length).toBe(4);
    expect(component.products.length).toBe(16);
  });

  it('should sort products by length of product name', () => {
    const a = {
      product: [],
    };
    const b = {
      product: [],
    };
    const res = component.sortProducts(a, b);
    expect(res).toBe(-1);
  });

  it('should handle Manager To Show Accounts when activeProduct exist', () => {
    spyOn(component, 'getAccounts');
    component.handleManagerToShowAccounts();
    expect(component.getAccounts).toHaveBeenCalled();
    expect(component.showAccounts).toBeTruthy();
  });

  it('should handle Manager To Show Accounts', () => {
    spyOn(component, 'getAccounts');
    component.activeProduct = null as any;
    homePrivateService.getLoadAccountsParameter.and.returnValue(of(true));
    component.handleManagerToShowAccounts();
    expect(spinner.show).toHaveBeenCalledWith('main-spinner');
    expect(component.showAccounts).toBeTruthy();
    expect(component.getAccounts).toHaveBeenCalled();
  });

  it('should handle Manager To Show Accounts false', () => {
    spyOn(component, 'getAccounts');
    component.activeProduct = null as any;
    homePrivateService.getLoadAccountsParameter.and.returnValue(of(false));
    component.handleManagerToShowAccounts();
    expect(spinner.show).toHaveBeenCalledWith('main-spinner');
    expect(component.showAccounts).toBeFalsy();
    expect(component.getAccounts).not.toHaveBeenCalled();
    expect(spinner.hide).toHaveBeenCalledWith('main-spinner');
  });

  it('should handle Manager To Show Accounts http error', () => {
    spyOn(component, 'getAccounts');
    component.activeProduct = null as any;
    homePrivateService.getLoadAccountsParameter.and.returnValue(throwError(() => ({ code: HttpStatusCode.INTERNAL_SERVER_ERROR })));
    component.handleManagerToShowAccounts();
    expect(spinner.show).toHaveBeenCalledWith('main-spinner');
    expect(component.getAccounts).not.toHaveBeenCalled();
  });

  it('should focus the new window if it was opened', function () {
    const mockWindow = { focus: function () {} };
    spyOn(window, 'open').and.returnValue(mockWindow as any);
    component.carouselNavigation('https://example.com');
    expect(window.open).toHaveBeenCalled();
  });

  it('should get banners', () => {
    component.getBanners();
    expect(component.imagenes).toEqual([
      {
        img: './assets/images/private/fondo-carousel.jpg',
      },
      {
        img: './assets/images/private/fondo-carousel.jpg',
      },
      {
        img: './assets/images/private/fondo-carousel.jpg',
      },
    ]);
  });

  it('should first_letter_uppercase_word', () => {
    const res = component.first_letter_uppercase_word('hola mundo');
    expect(res).toEqual('Hola Mundo');
  });

  it('should set the url property to the query params from the router', () => {
    component.ngOnChanges();
    expect(component.url).toEqual({ key1: 'value1', key2: 'value2' } as any);
  });

  it('should get Accounts', () => {
    spyOn(component, 'handleBuildGroupOfObservablesToGetAccounts').and.returnValue(of([]) as any);
    component.getAccounts();
    expect(component.handleBuildGroupOfObservablesToGetAccounts).toHaveBeenCalled();
    expect(spinner.show).toHaveBeenCalled();
    expect(spinner.hide).toHaveBeenCalled();
  });

  it('should handle Mixed Products', () => {
    const result = [
      { account: 'account1', amount: 100 },
      { account: 'account2', amount: 200 },
    ];
    const product = { product: Product.LOAN };
    const index = 0;
    spyOn(component, 'findCurrency').and.returnValue([]);
    spyOn(component, 'calculateTotalAmounts');
    component.handleMixedProducts(result, product, index);
    expect(component.findCurrency).toHaveBeenCalled();
    expect(component.calculateTotalAmounts).toHaveBeenCalled();
  });

  it('should return the correct item when given a valid product and currency', () => {
    const products = [
      { product: 'hoes', currency: 'USD', mixed: true },
      { product: 'hoes', currency: 'EUR', mixed: true },
      { product: 'hoes', currency: 'GBP', mixed: true },
      { product: 'hoes', currency: 'JPY', mixed: true },
      { product: 'hoes', currency: 'CAD', mixed: true },
    ];

    const productToFind = 'hoes';
    const product = { currency: 'USD' };
    const expectedItem = { product: 'hoes', currency: 'USD', mixed: true };
    const result = component.findCurrency(productToFind, product, products);
    expect(result).toEqual(expectedItem);
  });

  it('should return an array of observables', () => {
    const products = [
      { product: 'product1', subProduct: 'ubProduct1', currency: 'USD', mixed: false },
      { product: 'product2', subProduct: 'ubProduct2', currency: 'EUR', mixed: true },
    ];
    component.products = products;
    homePrivateService.getAccountsByProduct.and.returnValue(of());
    const result = component.handleBuildGroupOfObservablesToGetAccounts();

    expect(result).toEqual(jasmine.any(Array));
    expect(result.length).toBe(2);
  });

  it('should refresh', () => {
    spyOn(component, 'getAccounts');
    component.refresh();
    expect(component.getAccounts).toHaveBeenCalled();
  });

  it('should set showAccounts to true', () => {
    component.onShowAccount({ checked: true });
    expect(component.showAccounts).toBe(true);
  });

  it('should calculate summary for each currency', () => {
    component.currencies = ['USD'];
    component.products = [
      { product: Product.CHECK, currency: 'USD', totalAmount: 100 },
      { product: Product.SAVINGS, currency: 'USD', totalAmount: 200 },
    ];
    component.calculateSummary();
    expect(component.summary['USD'].deposits).toBe(0);
    expect(component.summary['USD'].loans).toBe(0);
  });

  it('should add up the total amounts and available amounts for each account', () => {
    const product = { totalAmount: 0, totalAvailable: 0 };
    const accounts = [
      { totalAmount: 100, availableAmount: 50 },
      { totalAmount: 200, availableAmount: 100 },
      { totalAmount: 300, availableAmount: 150 },
    ];

    component.calculateTotalAmounts(product, accounts);

    expect(product.totalAmount).toEqual(600);
    expect(product.totalAvailable).toEqual(300);
  });

  it('should get Product Equivalences For Translate', () => {
    const res = component.getProductEquivalencesForTranslate(Product.CHECK);
    expect(res).toEqual('label.home.checks');
    fixture.detectChanges();

    const res2 = component.getProductEquivalencesForTranslate(Product.SAVINGS);
    expect(res2).toEqual('label.home.savings');
    fixture.detectChanges();

    const res3 = component.getProductEquivalencesForTranslate(Product.FIX_TERM);
    expect(res3).toEqual('label.home.fix-term');
    fixture.detectChanges();

    const res4 = component.getProductEquivalencesForTranslate(Product.LOAN_ADMINISTRATED);
    expect(res4).toEqual('label.home.loan');
    fixture.detectChanges();

    const res5 = component.getProductEquivalencesForTranslate(Product.CREDIT_CARD);
    expect(res5).toEqual('label.home.credit-card');
    fixture.detectChanges();

    const res6 = component.getProductEquivalencesForTranslate(null as any);
    expect(res6).toEqual('');
  });

  it('should corporate Image Application', () => {
    styleManagement.corporateImageApplication.and.returnValue(true);
    const res = component.corporateImageApplication();
    expect(res).toBeTruthy();
  });
});
