import { StorageService } from '@adf/security';
import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { forkJoin, Observable, of, Subscription } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { HttpStatusCode } from '../../../enums/http-status-code.enum';
import { ISettingData } from '../../../models/setting-interface';
import { OnResize } from 'src/app/modules/shared/classes/on-risize';
import { Product } from 'src/app/enums/product.enum';
import { UtilService } from 'src/app/service/common/util.service';
import { StyleManagementService } from 'src/app/service/common/style-management.service';
import { RestarIldeService } from 'src/app/service/private/restar-ilde.service';
import { SecurityService } from 'src/app/service/private/security.service';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { LoginActiveService } from 'src/app/service/public/login-active.service';
import { HomePrivateService } from 'src/app/service/private/home-private.service';
import { OnboardingModalService } from '../../../service/private/onboarding/onboarding-modal.service';
import { EProfile } from '../../../enums/profile.enum';
import { StknBisvInvitationService } from '../soft-token/modules/stoken-bisv/services/stkn-bisv-invitation.service';

const ENABLED_CREDIT_CARD = false;
const IMAGES = [
  {
    img: './assets/images/private/fondo-carousel.jpg',
  },
  {
    img: './assets/images/private/fondo-carousel.jpg',
  },
  {
    img: './assets/images/private/fondo-carousel.jpg',
  },
];

@Component({
  selector: 'byte-home-private',
  templateUrl: './home-private.component.html',
  styleUrls: ['./home-private.component.scss'],
})
export class HomePrivateComponent extends OnResize implements OnDestroy {
  private isFirstCalled: boolean = true;

  imagenes!: any[];

  activeProduct!: string;
  isSummary: boolean;
  products: any[] = [];
  ProductEnum = Product;
  showAccounts: boolean = true;
  summary: any;
  summaries: any[] = [];
  user: any = this.parameterManagement.getParameter('userInfo');
  url: string;
  private settingStorage: ISettingData;

  profile = environment['profile'];

  currencies = environment.currencies;
  productTypes = environment.productTypes;

  currencyProductTypes: any[] = [];
  private serviceSubscription!: Subscription;



  constructor(
    private util: UtilService,
    private activatedRoute: ActivatedRoute,
    private config: NgbCarouselConfig,
    private homePrivateService: HomePrivateService,
    private securityService: SecurityService,
    private spinner: NgxSpinnerService,
    private loginActiveService: LoginActiveService,
    private restarIlde: RestarIldeService,
    private router: Router,
    private parameterManagement: ParameterManagementService,
    private storage: StorageService,
    private styleManagement: StyleManagementService,
    private onBoardingModal: OnboardingModalService,
    private stknBisvInvitationSevice: StknBisvInvitationService
  ) {
    super();
    this.util.resetStorage();
    this.settingStorage = JSON.parse(this.storage.getItem('securityParameters'));
    this.getBanners();

    this.url = this.activatedRoute.snapshot.data['product'];
    this.parameterManagement.sendParameters(this.url);
    this.isSummary = this.activatedRoute.snapshot.data['summary'];
    this.initCallServiceToBuildScreen();

    this.config.interval = 3000;
    this.config.pauseOnHover = true;
  }

  initCallServiceToBuildScreen() {
    this.serviceSubscription = this.activatedRoute.data.subscribe((result) => {
      const products = result['products'];
      this.activeProduct = this.url;

      // Limpiar array
      this.products = [];
      this.currencyProductTypes = [];

      if (products) {
        // Solo mostrar el producto si el código viene en la url como parámetro

        products
          .filter(product => this.filterProductToShow(product))
          .forEach((product: any) => {
            product.visible = false;
            product.mixed = false;

            this.buildGroupOfProductByAccounts(product);
          });

        if (this.activeProduct) {
          this.handleGroupOfProductByActiveProduct();
        } else {
          this.handleGroupOfProductByDisabledProduct();
        }

        // ordenando productos por código de producto
        this.products.sort(this.sortProducts.bind(this));
        this.handleManagerToShowAccounts();
      }
    });
  }

  filterProductToShow(product: any) {
    const currencyAllowed = this.currencies.find((currency) => currency === product.currency);

    if (!currencyAllowed) { return false; }

    if (this.activeProduct) {
      return this.activeProduct === product.product;
    }

    return product.product !== this.ProductEnum.CREDIT_CARD ? true : ENABLED_CREDIT_CARD;
  }

  buildGroupOfProductByAccounts(product: any) {
    let productType = product.product;

    // Juntar préstamos en un solo producto (LOAN + LOAN_ADMINISTRATED = LOANS)
    if (product.product === Product.LOAN || product.product === Product.LOAN_ADMINISTRATED) {
      productType = Product.LOANS;
    }

    const addedProduct = this.products.find((addedProducts) => addedProducts.product === productType && addedProducts.currency === product.currency);

    if (!addedProduct) {
      this.products.push({
        name: this.getProductEquivalencesForTranslate(productType),
        product: productType,
        currency: product.currency,
        visible: true,
        mixed: true,
        accounts: [],
        totalAmount: 0,
        totalAvailable: 0,
        subproduct: product?.subProduct,
      });
    }

    this.products.push(product);

    // Array de Product Types x Currency devueltos - Identificar los ProductType X Currency
    const addedCurrencyXProductType = this.currencyProductTypes.find((currencyProductType) => currencyProductType === productType + '|' + product.currency);

    if (!addedCurrencyXProductType) {
      this.currencyProductTypes.push(productType + '|' + product.currency);
    }
  }

  handleGroupOfProductByActiveProduct() {
    if (this.activeProduct === Product.LOAN || this.activeProduct === Product.LOAN_ADMINISTRATED) {
      this.activeProduct = Product.LOANS;
    }

    this.productTypes
      .filter((localProductType: any) => this.activeProduct === localProductType)
      .forEach((localProductType: any) => {
        this.currencies.forEach((localCurrency: any) => {
          const alreadyIncluded = this.currencyProductTypes.find((currencyProductType) => currencyProductType === localProductType + '|' + localCurrency);

          if (!alreadyIncluded) {
            this.products.push({
              name: this.getProductEquivalencesForTranslate(localProductType),
              product: localProductType,
              currency: localCurrency,
              visible: true,
              mixed: true,
              accounts: [],
              totalAmount: 0,
              totalAvailable: 0,
            });
          }
        });
      });
  }

  handleGroupOfProductByDisabledProduct() {
    this.productTypes.forEach((localProductType: any) => {
      this.currencies.forEach((localCurrency: any) => {
        const alreadyIncluded = this.currencyProductTypes.find((currencyProductType) => currencyProductType === localProductType + '|' + localCurrency);

        if (!alreadyIncluded) {
          this.products.push({
            name: this.getProductEquivalencesForTranslate(localProductType),
            product: localProductType,
            currency: localCurrency,
            visible: true,
            mixed: true,
            accounts: [],
            totalAmount: 0,
            totalAvailable: 0,
          });
        }
      });
    });
  }

  sortProducts(a: any, b: any) {
    let productA: string = a.product;
    let productB: string = b.product;

    if (productA.length > 2) {
      productA = productA.substring(1);
    }

    if (productB.length > 2) {
      productB = productB.substring(1);
    }

    if (productA === productB) {
      return this.currencies.indexOf(a.currency) - this.currencies.indexOf(b.currency);
    }

    return productA > productB ? 1 : -1;
  }

  handleManagerToShowAccounts() {
    // Mostrar/ocultar las cuentas
    if (this.activeProduct) {
      this.showAccounts = true;
      this.getAccounts();
    } else {
      this.spinner.show('main-spinner');
      // Si el flag está deshabilitado, no llamar automáticamente a las cuentas
      this.homePrivateService.getLoadAccountsParameter()
        .subscribe({
          next: (data) => {
            this.showAccounts = data;

            if (this.showAccounts) {
              this.getAccounts();
            } else {
              this.spinner.hide('main-spinner');
            }
          },
          error: (error: any) => {
            if (error.code == HttpStatusCode.INTERNAL_SERVER_ERROR) {
              console.log(error.message);
            }
          }
        });
    }
  }

  carouselNavigation(url: string): void {
    if (url) {
      let win = window.open(url, '_blank');
      win?.focus();
    }
  }

  getBanners() {
    if (this.settingStorage.banners) {
      const imagenList = this.settingStorage.banners;
      let arrayImg: any[] = new Array<any>();

      for (const key in imagenList) {
        let img = {};
        img['img'] = imagenList[key];
        arrayImg.push(img);
      }

      this.imagenes = arrayImg;
    } else {
      this.imagenes = IMAGES;
    }
  }

  first_letter_uppercase_word(str) {
    return str
      ?.toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  ngOnInit(): void {
    this.loginActiveService.send(true);
    this.restarIlde.restar(true);
    if (this.profile === EProfile.HONDURAS) {
      this.onBoardingModal.validateOnBoarding();
    }
    this.stknBisvInvitationSevice.showInvitationModal();
  }

  ngOnChanges() {
    this.url = this.router['browserUrlTree']['queryParams'];
  }

  getAccounts() {
    // para que el full screen funcione en false, el contenedor debe estar en position:relative.
    // Luego, arreglar los margenes para que no se vea la pantalla de manera incorrecta
    this.spinner.show('main-spinner');

    this.isFirstCalled = false;

    const arrayObservables: Observable<any>[] = this.handleBuildGroupOfObservablesToGetAccounts();

    // Segundo loop: Asignar las cuentas a los productos (con atributo mixed: true)
    forkJoin(arrayObservables)
      .pipe(finalize(() => this.spinner.hide('main-spinner')))
      .subscribe({
        next: (result) => {
          this.products.forEach((product, index) => {
            if (!product.mixed) {
              this.handleMixedProducts(result, product, index);
            }
          });

          if (this.isSummary) {
            this.calculateSummary();
          }
        }
      })
  }

  handleMixedProducts(result: any, product: any, index: any) {
    let mixedProduct: any = undefined;

    if (product.product === Product.LOAN || product.product === Product.LOAN_ADMINISTRATED) {
      mixedProduct = this.findCurrency(Product.LOANS, product, this.products);
    } else {
      mixedProduct = this.findCurrency(product.product, product, this.products);

    }

    if (mixedProduct) {
      if (!mixedProduct.reloaded) {
        mixedProduct.accounts = [];
        mixedProduct.totalAmount = 0;
        mixedProduct.totalAvailable = 0;
      }

      mixedProduct.accounts = mixedProduct.accounts.concat(result[index] || []);
      mixedProduct.reloaded = true;

      this.calculateTotalAmounts(mixedProduct, result[index] || []);
    }
  }

  findCurrency(productToFind: string, product: any, products: any[]) {
    return products.find((item) => item.product === productToFind && item.currency === product.currency  && item.mixed);
  }

  handleBuildGroupOfObservablesToGetAccounts() {
    const groupOfObservables: any[] = [];
    // Primer Loop: Juntar los observables (llamadas al servicio) para formar solo una respuesta

    this.products.forEach((product) => {
      let objectObservable = of([]);
      if (!product.mixed) {
        objectObservable = this.homePrivateService.getAccountsByProduct(product.product, product.subProduct, product.currency)
          .pipe(
            catchError((error) => {
              console.error(error);
              return of([]);
            })
          );
      } else {
        // Se borrarán las cuentas cuando el servicio haya respondido
        // product.accounts = [];
        product.reloaded = false;
      }

      groupOfObservables.push(objectObservable);
    });

    return groupOfObservables;
  }

  refresh() {
    this.getAccounts();
  }

  onShowAccount($event) {
    this.showAccounts = $event.checked;

    if (this.showAccounts && this.isFirstCalled) {
      this.getAccounts();
    }
  }

  calculateSummary() {
    this.summary = {};
    for (let i = 0; i < this.currencies.length; i++) {
      this.summary[this.currencies[i]] = { position: i, deposits: 0, loans: 0, netPosition: 0, currency: this.currencies[i] };
    }

    this.products
      .filter((p) => p.mixed)
      .forEach((product) => {
        switch (product.product) {
          case Product.CHECK:
          case Product.SAVINGS:
          case Product.FIX_TERM:
            this.summary[product.currency].deposits += product.totalAmount;
            break;
          case Product.LOAN_ADMINISTRATED:
          case Product.LOAN:
          case Product.LOANS:
            this.summary[product.currency].loans += product.totalAmount;
            break;
        }
      });

    //this.summaries = Object.values(this.summary)
    this.summaries = Object.keys(this.summary)
      .map((item) => this.summary[item])
      .sort((a: any, b: any) => (a.position < b.position ? -1 : 1));

    this.summaries.forEach((summary) => {
      summary.netPosition = summary.deposits - summary.loans;
    });
  }

  calculateTotalAmounts(product: any, accounts: Array<any>) {
    let totalAmount = 0;
    let totalAvailable = 0;

    if (accounts) {
      accounts.forEach((account) => {
        totalAmount += account.totalAmount;
        totalAvailable += account.availableAmount;
      });
    }

    product.totalAmount += totalAmount;
    product.totalAvailable += totalAvailable;
  }

  getProductEquivalencesForTranslate(product: Product | string) {
    switch (product) {
      case Product.CHECK:
        return 'label.home.checks';
      case Product.SAVINGS:
        return 'label.home.savings';
      case Product.FIX_TERM:
        return 'label.home.fix-term';
      case Product.LOAN:
      case Product.LOAN_ADMINISTRATED:
      case Product.LOANS:
        return 'label.home.loan';
      case Product.CREDIT_CARD:
        return 'label.home.credit-card';
      default:
        return '';
    }
  }

  href(link: string) {
    if (link) {
      window.location.href = link;
    }
  }

  public ngOnDestroy(): void {
    if (this.serviceSubscription) {
      this.serviceSubscription.unsubscribe();
    }
  }

  corporateImageApplication(): boolean {
    return this.styleManagement.corporateImageApplication();
  }
}
