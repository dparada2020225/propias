import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {Router} from '@angular/router';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TransfersPrintService} from 'src/app/modules/transfer/prints/transfers-print.service';
import {UtilService} from 'src/app/service/common/util.service';
import {ParameterManagementService} from 'src/app/service/navegation-parameters/parameter-management.service';
import {mockModal} from 'src/assets/mocks/modules/transfer/service/own-transfer/otd-transfer-modal.mock';
import {iParamsHomeToDetailMock} from 'src/assets/mocks/modules/transfer/service/transfer-ach/ach.data.mock';
import {MockTranslatePipe} from 'src/assets/mocks/public/tranlatePipeMock';
import {clickElement, mockPromise} from 'src/assets/testing';
import {IConsultingACHState} from '../../interfaces/navigate-parameters.interface';
import {CadManagerService} from '../../services/definition/cad-manager.service';
import {ConsultAchDetailExcelService} from '../../services/print/consult-ach-detail-excel.service';
import {ConsultAchDetailTransactionComponent} from './consult-ach-detail-transaction.component';

describe('ConsultAchDetailTransactionComponent', () => {
  let component: ConsultAchDetailTransactionComponent;
  let fixture: ComponentFixture<ConsultAchDetailTransactionComponent>;

  let parameterManagement: jasmine.SpyObj<ParameterManagementService>;
  let consultAchDefinitionManager: jasmine.SpyObj<CadManagerService>;
  let modalService: jasmine.SpyObj<NgbModal>;
  let router: jasmine.SpyObj<Router>;
  let pdfService: jasmine.SpyObj<TransfersPrintService>;
  let xlsService: jasmine.SpyObj<ConsultAchDetailExcelService>;
  let utils: jasmine.SpyObj<UtilService>;

  beforeEach(async () => {
    const parameterManagementSpy = jasmine.createSpyObj('ParameterManagementService', ['getParameter', 'sendParameters']);
    const consultAchDefinitionManagerSpy = jasmine.createSpyObj('CadManagerService', [
      'buildTableLayout',
      'buildPdfVoucherLayout',
      'buildDetailTransactionLayout',
      'buildModalLayout',
    ]);
    const modalServiceSpy = jasmine.createSpyObj('NgbModal', ['open']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const pdfServiceSpy = jasmine.createSpyObj('TransfersPrintService', ['pdfGenerate']);
    const xlsServiceSpy = jasmine.createSpyObj('ConsultAchDetailExcelService', ['generate']);
    const utilsSpy = jasmine.createSpyObj('UtilService', ['hideLoader', 'showLoader']);

    await TestBed.configureTestingModule({
      declarations: [ConsultAchDetailTransactionComponent, MockTranslatePipe],
      providers: [
        ConsultAchDetailTransactionComponent,
        { provide: ParameterManagementService, useValue: parameterManagementSpy },
        { provide: CadManagerService, useValue: consultAchDefinitionManagerSpy },
        { provide: NgbModal, useValue: modalServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: TransfersPrintService, useValue: pdfServiceSpy },
        { provide: ConsultAchDetailExcelService, useValue: xlsServiceSpy },
        { provide: UtilService, useValue: utilsSpy },
      ],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ConsultAchDetailTransactionComponent);
    component = fixture.componentInstance;

    parameterManagement = TestBed.inject(ParameterManagementService) as jasmine.SpyObj<ParameterManagementService>;
    consultAchDefinitionManager = TestBed.inject(CadManagerService) as jasmine.SpyObj<CadManagerService>;
    modalService = TestBed.inject(NgbModal) as jasmine.SpyObj<NgbModal>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    pdfService = TestBed.inject(TransfersPrintService) as jasmine.SpyObj<TransfersPrintService>;
    xlsService = TestBed.inject(ConsultAchDetailExcelService) as jasmine.SpyObj<ConsultAchDetailExcelService>;
    utils = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;

    parameterManagement.getParameter.and.returnValue(iParamsHomeToDetailMock);

    fixture.detectChanges();
  });

  it('should create ConsultAchDetailTransactionComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should hideLoader, build TableLayout, DetailTransactionLayout, PdfVoucherLayout and ModalLayout', () => {
    expect(utils.hideLoader).toHaveBeenCalled();
    expect(consultAchDefinitionManager.buildTableLayout).toHaveBeenCalled();
    expect(consultAchDefinitionManager.buildDetailTransactionLayout).toHaveBeenCalled();
    expect(consultAchDefinitionManager.buildPdfVoucherLayout).toHaveBeenCalled();
    expect(consultAchDefinitionManager.buildModalLayout).toHaveBeenCalled();
  });

  xit('should go to the back Step', () => {
    router.navigate.and.returnValue(mockPromise(true));
    clickElement(fixture, 'adf-button.secondary');

    fixture.detectChanges();

    expect(router.navigate).toHaveBeenCalledWith(['/transfer/consult-ach']);
    expect(utils.hideLoader).toHaveBeenCalled();
    expect(parameterManagement.sendParameters).toHaveBeenCalledWith({
      consultingACHState: null,
    } as IConsultingACHState);
  });

  it('should get table actions', () => {
    spyOn(component, 'openModal');
    component.getTableActions(null);
    expect(component.openModal).toHaveBeenCalled();
  });

  xit('should open modal and print pdf', fakeAsync(() => {
    modalService.open.and.returnValue(mockModal as NgbModalRef);
    component.pdfLayout = {
      account: {},
      reference: '',
      title: '',
      fileName: '',
      items: [],
    };

    clickElement(fixture, 'i.banca-regional-printer');
    fixture.detectChanges();
    tick();

    expect(modalService.open).toHaveBeenCalled();
    expect(pdfService.pdfGenerate).toHaveBeenCalled();
  }));

  xit('should generateCsvFile', () => {
    clickElement(fixture, 'i.banca-regional-csv');
    fixture.detectChanges();
    expect(xlsService.generate).toHaveBeenCalledWith(component.tableInfo, 'Consulta de operaciones', 'csv');
  });

  xit('should generateXlsFile', () => {
    clickElement(fixture, 'i.banca-regional-xls');
    fixture.detectChanges();
    expect(xlsService.generate).toHaveBeenCalledWith(component.tableInfo, 'Consulta de operaciones');
  });
});
