import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {StorageService} from '@adf/security';
import {CUSTOM_ELEMENTS_SCHEMA, ElementRef} from '@angular/core';
import {Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {of} from 'rxjs';
import {EProfile} from 'src/app/enums/profile.enum';
import {StyleManagementService} from 'src/app/service/common/style-management.service';
import {UtilService} from 'src/app/service/common/util.service';
import {ParameterManagementService} from 'src/app/service/navegation-parameters/parameter-management.service';
import {MenuService} from 'src/app/service/shared/menu.service';
import {LocalStorageServiceMock} from 'src/assets/mocks/public/mockLocalStorageServiceMock';
import {environment} from 'src/environments/environment';
import {MenuComponent} from './menu.component';

class MenuServiceMock {
  closeMenuHandler(): any {
    return of();
  }
}

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;

  let router: Router;
  let parameterManagemen: jasmine.SpyObj<ParameterManagementService>;
  let modalService: jasmine.SpyObj<NgbModal>;
  let styleManagement: jasmine.SpyObj<StyleManagementService>;

  beforeEach(async () => {
    const eRefSpy = jasmine.createSpyObj('ElementRef', ['nativeElement']);
    const parameterManagemenSpy = jasmine.createSpyObj('ParameterManagementService', ['sendParameters']);
    const modalServiceSpy = jasmine.createSpyObj('NgbModal', ['dismissAll']);
    const styleManagementSpy = jasmine.createSpyObj('StyleManagementService', ['corporateImageApplication']);
    const utilSpy = jasmine.createSpyObj('UtilService', ['resetStorage']);

    await TestBed.configureTestingModule({
      declarations: [MenuComponent],
      providers: [
        { provide: ElementRef, useValue: eRefSpy },
        { provide: MenuService, useClass: MenuServiceMock },
        { provide: ParameterManagementService, useValue: parameterManagemenSpy },
        { provide: NgbModal, useValue: modalServiceSpy },
        { provide: StorageService, useClass: LocalStorageServiceMock },
        { provide: StyleManagementService, useValue: styleManagementSpy },
        { provide: UtilService, useValue: utilSpy },
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

    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;

    parameterManagemen = TestBed.inject(ParameterManagementService) as jasmine.SpyObj<ParameterManagementService>;
    modalService = TestBed.inject(NgbModal) as jasmine.SpyObj<NgbModal>;
    styleManagement = TestBed.inject(StyleManagementService) as jasmine.SpyObj<StyleManagementService>;
    router = TestBed.inject(Router);

    spyOnProperty(router, 'url', 'get').and.returnValue('http/test');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should build columns for an item with children', () => {
    const item = {
      child: [
        { id: 1, column: 1 },
        { id: 2, column: 2 },
        { id: 3, column: 3 },
        { id: 4, column: 4 },
      ],
    };

    component.buildColumnOrderForItem(item);
    expect(component.buildColumnOrderForItem).toBeDefined();
  });

  it('should change State First Step', () => {
    component.changeStateFirstStep('test');
    expect(component.firstStep).toEqual('test');
    expect(component.secondCollapsedMenu).toBeTruthy();
  });

  it('should set menu to an array', () => {
    environment.profile = EProfile.SALVADOR;
    const menu = [
      { label: 'Menu Item 1', service: 'ervice1' },
      { label: 'Menu Item 2', service: 'ervice2' },
    ];
    component.receiverMenu = menu;
    expect(component.menu.length).toEqual(3);
  });

  it('should back First Step', () => {
    component.backFirstStep();
    expect(component.firstStep).toBeUndefined();
    expect(component.firstStepSelect).toBeUndefined();
    expect(component.secondCollapsedMenu).toBeTruthy();
  });

  it('should change State Second Step', () => {
    component.changeStateSecondStep('test');
    expect(component.secondStep).toBe('test');
    expect(component.thirdCollapsedMenu).toBeTruthy();
  });

  it('should back Second Step', () => {
    component.backSecondStep();
    expect(component.secondStep).toBeUndefined();
    expect(component.thirdCollapsedMenu).toBeTruthy();
  });

  it('should change Stat Third Step', () => {
    component.changeStatThirdStep('test');
    expect(component.thirdStep).toEqual('test');
    expect(component.fourthCollapsedMenu).toBeTruthy();
  });

  it('should back Third Step', () => {
    component.backThirdStep();
    expect(component.thirdStep).toBeUndefined();
    expect(component.fourthCollapsedMenu).toBeTruthy();
  });

  it('should change State Fourth Step', () => {
    component.changeStateFourthStep('1');
    expect(component.fourthStep).toEqual('1');
    expect(component.secondCollapsedMenu).toBeTruthy();
  });

  it('should back fourth Step', () => {
    component.backfourthStep();
    expect(component.firstStep).toBeUndefined();
    expect(component.secondCollapsedMenu).toBeTruthy();
  });

  it('should change State First Step Lg with fistStep is equal', () => {
    component.firstStep = '1';
    component.changeStateFirstStepLg('1');
    expect(component.firstCollapsedMenu).toBeFalsy();
    expect(component.firstStep).toEqual('1');
    expect(component.firstStepSelect).toEqual('1');
  });

  it('should compare Navigate Mobile', fakeAsync(() => {
    spyOn(component, 'compareNavigate');
    component.compareNavigateMobile([]);
    tick(4000);
    expect(component.firstCollapsedMenu).toBeTruthy();
    expect(component.firstStep).toBeUndefined();
    expect(component.thirdStep).toBeUndefined();
    expect(component.secondStep).toBeUndefined();
    expect(component.secondCollapsedMenu).toBeFalsy();
    expect(component.fourthCollapsedMenu).toBeFalsy();
    expect(component.thirdCollapsedMenu).toBeFalsy();
  }));

  it('should compare Navigate Lg', () => {
    spyOn(component, 'compareNavigate');
    component.compareNavigateLg([]);
    expect(component.compareNavigate).toHaveBeenCalled();
  });

  it('shuld handle Menu Equivalence Parameters Has Items', () => {
    component.handleMenuEquivalenceParametersHasItems({
      url: 'http://test',
      parameters: {
        test: 'test',
      },
    } as any);
    expect(parameterManagemen.sendParameters).toHaveBeenCalled();
    expect(component.firstCollapsedMenu).toBeTruthy();
  });

  xit('should handle Reload Navigation', () => {
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
    const data = {
      url: 'http://test',
      parameters: {
        test: 'test',
      },
    };
    component.handleReloadNavigation(data as any, 'menu');
    expect(router.navigate).toHaveBeenCalledWith(['http://test']);
    expect(parameterManagemen.sendParameters).toHaveBeenCalled();
    expect(component.firstCollapsedMenu).toBeTruthy();
  });

  it('should logout', () => {
    spyOn(component.logoutEvent, 'emit');
    modalService.dismissAll.and.returnValue();
    component.logout();
    expect(modalService.dismissAll).toHaveBeenCalled();
    expect(component.logoutEvent.emit).toHaveBeenCalled();
  });

  it('should corporate Image Application', () => {
    styleManagement.corporateImageApplication.and.returnValue(true);
    component.corporateImageApplication();
    expect(styleManagement.corporateImageApplication).toHaveBeenCalled();
  });

  it('should close the menu when the click event target is outside the component', () => {
    spyOn(component, 'closeMenu');
    component.clickout(new Event('click'));
    expect(component.closeMenu).toHaveBeenCalled();
  });
});
