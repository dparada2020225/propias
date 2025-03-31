import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PmplVoucherComponent} from './pmpl-voucher.component';
import {UtilService} from "../../../../../../service/common/util.service";
import {PmpldVoucherService} from "../../../services/definition/load/upload-file/pmpld-voucher.service";
import {ParameterManagementService} from "../../../../../../service/navegation-parameters/parameter-management.service";
import {ActivatedRoute, Router} from "@angular/router";
import {PmpldTableService} from "../../../services/definition/load/upload-file/pmpld-table.service";
import {MockTranslatePipe} from "../../../../../../../assets/mocks/public/tranlatePipeMock";
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {SPPView} from "../../../enums/pmp-view.enum";
import {
  iPmpLoadFileStateMock,
  iPmpManualHomeStateMock
} from "../../../../../../../assets/mocks/modules/payroll/payroll.mock";
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from "@angular/core";
import {clickElement, mockPromise} from "../../../../../../../assets/testing";
import {SPPMRoutes} from "../../../enums/pmp-routes.enum";

describe('SpplVoucherComponent', () => {
  let component: PmplVoucherComponent;
  let fixture: ComponentFixture<PmplVoucherComponent>;

  let voucherDefinition: jasmine.SpyObj<PmpldVoucherService>;
  let parameterManagerService: jasmine.SpyObj<ParameterManagementService>;
  let utils: jasmine.SpyObj<UtilService>;
  let router: jasmine.SpyObj<Router>;
  let sppTableDefinition: jasmine.SpyObj<PmpldTableService>;

  beforeEach(async () => {

    const voucherDefinitionSpy = jasmine.createSpyObj('PmpldVoucherService', ['buildVoucherLayout'])
    const parameterManagerServiceSpy = jasmine.createSpyObj('ParameterManagementService', ['sendParameters', 'getParameter'])
    const utilsSpy = jasmine.createSpyObj('UtilService', ['showLoader', 'hideLoader'])
    const routerSpy = jasmine.createSpyObj('Router', ['navigate'])
    const sppTableDefinitionSpy = jasmine.createSpyObj('PmpldTableService', ['tableLoadManuallyHeaders'])

    await TestBed.configureTestingModule({
      declarations: [ PmplVoucherComponent, MockTranslatePipe ],
      providers: [
        { provide: PmpldVoucherService, useValue: voucherDefinitionSpy },
        { provide: ParameterManagementService, useValue: parameterManagerServiceSpy },
        { provide: UtilService, useValue: utilsSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: {
            snapshot: {
              data: {
                view: SPPView.LOAD_FILE
              }
            }
          } },
        { provide: PmpldTableService, useValue: sppTableDefinitionSpy },
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

    fixture = TestBed.createComponent(PmplVoucherComponent);
    component = fixture.componentInstance;
    voucherDefinition = TestBed.inject(PmpldVoucherService) as jasmine.SpyObj<PmpldVoucherService>;
    parameterManagerService = TestBed.inject(ParameterManagementService) as jasmine.SpyObj<ParameterManagementService>;
    utils = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    sppTableDefinition = TestBed.inject(PmpldTableService) as jasmine.SpyObj<PmpldTableService>;

    parameterManagerService.getParameter.withArgs('navigateStateParameters').and.returnValue(iPmpLoadFileStateMock)

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should go back', () => {
    router.navigate.and.returnValue(mockPromise(true));
    clickElement(fixture, 'adf-button');
    fixture.detectChanges();
    expect(router.navigate).toHaveBeenCalledWith([SPPMRoutes.HOME])
  })

  it('should build Manual Voucher Layout', () => {

    parameterManagerService.getParameter.withArgs('navigateStateParameters').and.returnValue(iPmpManualHomeStateMock);
    fixture.detectChanges();

    component.buildManualVoucherLayout();

    expect(sppTableDefinition.tableLoadManuallyHeaders).toHaveBeenCalled();
    expect(voucherDefinition.buildVoucherLayout).toHaveBeenCalled();
  })

});
