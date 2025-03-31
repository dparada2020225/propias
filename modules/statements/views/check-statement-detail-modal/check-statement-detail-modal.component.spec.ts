import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdfButtonComponent } from '@adf/components';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { CustomNumberPipe } from 'src/app/pipes/custom-number.pipe';
import { UtilService } from 'src/app/service/common/util.service';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { MockTranslatePipe } from 'src/assets/mocks/public/tranlatePipeMock';
import { clickElement } from 'src/assets/testing';
import { DepositStatementPrintService } from '../../services/deposit-statement-print.service';
import { CheckStatementDetailModalComponent } from './check-statement-detail-modal.component';

describe('CheckStatementDetailModalComponent', () => {
  let component: CheckStatementDetailModalComponent;
  let fixture: ComponentFixture<CheckStatementDetailModalComponent>;

  let ngbActiveModal: jasmine.SpyObj<NgbActiveModal>;
  let pdf: jasmine.SpyObj<DepositStatementPrintService>;
  let parameterManagementService: jasmine.SpyObj<ParameterManagementService>;
  let utils: jasmine.SpyObj<UtilService>;

  beforeEach(async () => {
    const ngbActiveModalSpy = jasmine.createSpyObj('NgbActiveModal', ['close']);
    const pdfSpy = jasmine.createSpyObj('DepositStatementPrintService', ['pdfGenerate']);
    const parameterManagementServiceSpy = jasmine.createSpyObj('ParameterManagementService', ['getParameter']);
    const utilsSpy = jasmine.createSpyObj('UtilService', ['removeLeftPadZeros']);

    await TestBed.configureTestingModule({
      declarations: [CheckStatementDetailModalComponent, MockTranslatePipe, CustomNumberPipe, AdfButtonComponent],
      providers: [
        { provide: NgbActiveModal, useValue: ngbActiveModalSpy },
        { provide: DepositStatementPrintService, useValue: pdfSpy },
        { provide: ParameterManagementService, useValue: parameterManagementServiceSpy },
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
    }).compileComponents();

    fixture = TestBed.createComponent(CheckStatementDetailModalComponent);
    component = fixture.componentInstance;

    ngbActiveModal = TestBed.inject(NgbActiveModal) as jasmine.SpyObj<NgbActiveModal>;
    pdf = TestBed.inject(DepositStatementPrintService) as jasmine.SpyObj<DepositStatementPrintService>;
    parameterManagementService = TestBed.inject(ParameterManagementService) as jasmine.SpyObj<ParameterManagementService>;
    utils = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;

    parameterManagementService.getParameter.and.returnValue({
      firstName: 'John',
      firstLastname: 'Doe',
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close modal', () => {
    clickElement(fixture, 'a');
    fixture.detectChanges();
    expect(ngbActiveModal.close).toHaveBeenCalled();
  });

  it('should dowload pdf', () => {
    component.download();
    expect(pdf.pdfGenerate).toHaveBeenCalled();
  });

  it('should get document Number', () => {
    component.information = { documentNumber: '058' };

    utils.removeLeftPadZeros.and.returnValue('58');

    const res = component.documentNumber;
    expect(utils.removeLeftPadZeros).toHaveBeenCalledWith(component.information?.documentNumber);
    expect(res).toEqual('58');
  });
});
