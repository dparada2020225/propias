import { SnackBarComponent } from '@adf/components';
import { StorageService } from '@adf/security';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';
import menuEquivalencyService from '../../../../assets/data/menu-equivalency.service.json';
import menuJson from '../../../../assets/data/menu.json';
import { EVersionHandler } from '../../../enums/version-handler.enum';
import { environment } from 'src/environments/environment';
import { MenuService } from 'src/app/service/shared/menu.service';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { StyleManagementService } from 'src/app/service/common/style-management.service';
import { UtilService } from 'src/app/service/common/util.service';
import { UserInformation } from 'src/app/models/security-option-modal';
import { IMenuEquivalencyElement } from '../../../models/service-menu.model';
import { FindServiceCodeService } from '../../../service/common/find-service-code.service';

@Component({
  selector: 'byte-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements AfterViewInit {

  assetsVersion = EVersionHandler.ASSETS;

  @ViewChild(SnackBarComponent)
  private snackBarComponent!: SnackBarComponent;

  @Input()
  set receiverMenu(menu: Array<any>) {
    const menuTemp: Array<any> = new Array<any>();

    let cnsMenu = menuJson[environment.profile];

    try {
      this.userInfo = JSON.parse(this.storageService.getItem('userInformation'))
    } catch (e) {
      console.error(e);
    }

    if (environment.profile === 'bipa' && this.userInfo.profile === 'FID') {
      let fidMenu = menuJson[environment.profile];
      let blackListMenu = ['cm-tarjeta-credito', 'cm-prestamos']

      fidMenu.child = menuJson[environment.profile].child.filter(element => !blackListMenu.includes(element.service))
      cnsMenu = fidMenu
    } else if (environment.profile === 'bisv') {
      let fidMenu = menuJson[environment.profile];
      let blackListMenu = ['cm-tarjeta-credito'];

      fidMenu.child = menuJson[environment.profile].child.filter(element => !blackListMenu.includes(element.service));
      cnsMenu = fidMenu;
    }


    // Tomar en cuenta que al construir el menu, si el arbol llega a crecer en niveles
    // también se debe realizar los cambios necesarios para que se ajuste el menú.
    this.buildColumnOrderForItem(cnsMenu);
    menuTemp.push(cnsMenu);

    if (menu) {
      for (const item of menu) {
        this.buildColumnOrderForItem(item);
        menuTemp.push(item);
      }
    }

    this.menu = menuTemp;
  }

  @Output()
  logoutEvent = new EventEmitter<any>();

  profile = environment.profile;

  menu!: Array<any>;
  userInfo!: UserInformation;
  firstCollapsedMenu = true;
  secondCollapsedMenu = false;
  thirdCollapsedMenu = false;
  fourthCollapsedMenu = false;
  fifthCollapsedMenu = false;
  menuEquivalencyService = menuEquivalencyService[this.profile];

  optionsList = [];
  arrowThirdStep: string | undefined = undefined;
  arrowFourthStep: string | undefined = undefined;
  arrowFifthStep: string | undefined = undefined;
  firstStepSelect: {} | undefined = {};

  firstStep;
  secondStep;
  thirdStep;
  fourthStep;

  home: string;
  logo: string | undefined;

  navbarSticky!: boolean;

  constructor(
    private router: Router,
    private eRef: ElementRef,
    private menuService: MenuService,
    private parameterManagemen: ParameterManagementService,
    private modalService: NgbModal,
    private storageService: StorageService,
    private styleManagement: StyleManagementService,
    private util: UtilService,
    private findServiceCode: FindServiceCodeService,
  ) {

    this.menuService.closeMenuHandler().subscribe(() => {
      this.closeMenu();
    });

    this.home = environment.home || 'home';
    this.logo = environment['profile'] || 'byte-theme';
  }

  ngAfterViewInit() {
    fromEvent(window, 'scroll')
      .pipe(
        map(() => window.scrollY),
        map((offset) => offset >= 154))
      .subscribe(result => {
        this.navbarSticky = result;
      });
  }

  buildColumnOrderForItem(item: any) {
    if (item.child) {

      // Contruir columnas

      item.childrenInColumns = [];

      Array.from(Array(item.child.length === 3 ? 3 : 4).keys())
        .forEach(() => {
          item.childrenInColumns.push({
            children: []
          });
        });

      // Asignar elemento a columna respectiva

      let columnIndex = 1;

      item.child.forEach((obj: any) => {
        if (!obj.column) {
          obj.column = columnIndex++;
        }

        if (columnIndex > 4) {
          columnIndex = 1;
        }

        item.childrenInColumns[obj.column - 1].children.push(obj);
      })
    }
  }

  changeStateFirstStep(firstStep) {
    this.firstStep = firstStep;
    this.secondCollapsedMenu = !this.secondCollapsedMenu;
  }

  backFirstStep() {
    this.firstStep = undefined;
    this.firstStepSelect = undefined;
    this.secondCollapsedMenu = !this.secondCollapsedMenu;
  }

  changeStateSecondStep(secondStep) {
    this.secondStep = secondStep;
    this.thirdCollapsedMenu = !this.thirdCollapsedMenu;
  }

  backSecondStep() {
    this.secondStep = undefined;
    this.thirdCollapsedMenu = !this.thirdCollapsedMenu;
  }

  changeStatThirdStep(thirdStep) {
    this.thirdStep = thirdStep;
    this.fourthCollapsedMenu = !this.fourthCollapsedMenu;
  }

  backThirdStep() {
    this.thirdStep = undefined;
    this.fourthCollapsedMenu = !this.fourthCollapsedMenu;
  }

  changeStateFourthStep(firstStep) {
    this.fourthStep = firstStep;
    this.secondCollapsedMenu = !this.secondCollapsedMenu;
  }

  backfourthStep() {
    this.firstStep = undefined;
    this.secondCollapsedMenu = !this.secondCollapsedMenu;
  }

  changeStateFirstStepLg(firstStep) {
    if (this.firstStep === firstStep || this.firstCollapsedMenu) {
      this.firstCollapsedMenu = !this.firstCollapsedMenu;
    }

    this.firstStep = firstStep;
    this.firstStepSelect = firstStep;
  }

  compareNavigateMobile(step) {
    if (!step.child || step.child.length === 0) {
      this.firstCollapsedMenu = true;
      this.cleaningFirstStepSelect();
      this.closeMobileMode();

      this.compareNavigate(step.service);
    }
  }

  closeMobileMode() {
    setTimeout(() => {
      this.firstStep = undefined;
      this.thirdStep = undefined;
      this.secondStep = undefined;
      this.secondCollapsedMenu = false;
      this.fourthCollapsedMenu = false;
      this.thirdCollapsedMenu = false;
    }, 500);
  }

  compareNavigateLg(step) {
    if (!step.child || step.child.length === 0) {
      this.compareNavigate(step.service);
    }
  }

  compareNavigate(service: string) {
    const componentListTemp = this.menuEquivalencyService;
    if (!componentListTemp) {
      this.snackBarComponent.openSnackBar('error', `perfil ${environment.profile} no configurado en menu-service-equivalence`);
    }

    const menuEquivalencyList: IMenuEquivalencyElement[] = this.menuEquivalencyService[service];

    if (menuEquivalencyList) {
      const menuEquivalency = menuEquivalencyList[0];
      const url = this.findServiceCode.validateUrlEquivalence(service, menuEquivalency);

      if (url.indexOf('http') === -1) {
        this.handleReloadNavigation(url, service);

        if (menuEquivalency.parameters && Object.values(menuEquivalency.parameters).length > 0) {
          this.handleMenuEquivalenceParametersHasItems(menuEquivalency);
        }

      } else {
        window.location.href = url;
      }
    } else {
      this.snackBarComponent.openSnackBar('error', `opción ${service} no configurada en menu-service-equivalence`);
    }
  }

  handleMenuEquivalenceParametersHasItems(menuEquivalency: IMenuEquivalencyElement) {
    let parameters = {};
    for (const key in menuEquivalency.parameters) {
      parameters[key] = menuEquivalency.parameters[key];
    }

    this.parameterManagemen.sendParameters(parameters);
    // Cerrar el menú
    this.firstCollapsedMenu = true;
    this.cleaningFirstStepSelect();
  }

  handleReloadNavigation(url: string, service: string) {
    const serviceEmbedded = { serviceEmbedded: service };
    this.parameterManagemen.sendParameters(serviceEmbedded);
    this.resetStorageProtectedParameterNavigate();

    const isReloaded =  this.restUrl(url);

    this.router.navigate([url]).finally(() => {
      this.closeMenu();
      this.resetStorageFromSignatureTrackingToEmbbeded();
      this.util.resetStorage();

      if (isReloaded) {
        this.util.resetStorage();
        window.location.reload();
      }
    });
  }

  resetStorageFromSignatureTrackingToEmbbeded() {
    this.parameterManagemen.sendParameters({
      signatoryParams: null,
      serviceEmbedded: null,
    });
  }

  resetStorageProtectedParameterNavigate() {
    this.parameterManagemen.sendParameters({
      navigationProtectedParameter: null,
    });
  }


  restUrl(urlParam: string): boolean {
    const url = this.router.url.split('?')[0];

    return url === `/${urlParam}`;
  }

  logout() {
    this.modalService.dismissAll();
    this.logoutEvent.emit();
  }

  @HostListener('document:click', ['$event']) clickout(event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.closeMenu();
    }
  }

  closeMenu() {
    this.firstCollapsedMenu = true;
    this.cleaningFirstStepSelect();
  }

  cleaningFirstStepSelect() {
    setTimeout(() => {
      this.firstStepSelect = {};
    }, 500);
  }


  corporateImageApplication(): boolean {
    return this.styleManagement.corporateImageApplication();
  }
}
