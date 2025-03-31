import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PmpHomeComponent} from './pmp-home.component';
import {UtilService} from "../../../../../service/common/util.service";
import {Router} from "@angular/router";
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {MockTranslatePipe} from "../../../../../../assets/mocks/public/tranlatePipeMock";
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from "@angular/core";
import {clickElement, mockPromise} from "../../../../../../assets/testing";
import {SPPMRoutes} from "../../enums/pmp-routes.enum";

describe('SppHomeComponent', () => {
  let component: PmpHomeComponent;
  let fixture: ComponentFixture<PmpHomeComponent>;
  let utils: jasmine.SpyObj<UtilService>;
  let router: jasmine.SpyObj<Router>;


  beforeEach(async () => {

    const utilsSpy = jasmine.createSpyObj('UtilService', ['hideLoader', 'showLoader'])
    const routerSpy = jasmine.createSpyObj('Router', ['navigate'])

    await TestBed.configureTestingModule({
      declarations: [ PmpHomeComponent, MockTranslatePipe ],
      providers: [
        { provide: UtilService, useValue: utilsSpy },
        { provide: Router, useValue: routerSpy },
      ],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PmpHomeComponent);
    component = fixture.componentInstance;
    utils = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    router.navigate.and.returnValue(mockPromise(true));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load payroll', () => {
    clickElement(fixture, 'secondary', true);
    fixture.detectChanges();

    expect(router.navigate).toHaveBeenCalledWith([SPPMRoutes.HOME_LOAD])
  })

  it('should payment Payroll', () => {
    clickElement(fixture, 'next', true);
    fixture.detectChanges();

    expect(router.navigate).toHaveBeenCalledWith([SPPMRoutes.HOME_PAYMENT])
  })

});
