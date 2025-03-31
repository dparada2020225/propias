import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdfButtonComponent } from '@adf/components';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { MockTranslatePipe } from 'src/assets/mocks/public/tranlatePipeMock';
import { clickElement } from 'src/assets/testing';
import { NoteStatementPrintService } from '../../services/note-statement-print.service';
import { CheckStatementDetailNotesModalComponent } from './check-statement-detail-notes-modal.component';

describe('CheckStatementDetailNotesModalComponent', () => {
  let component: CheckStatementDetailNotesModalComponent;
  let fixture: ComponentFixture<CheckStatementDetailNotesModalComponent>;

  let ngbActiveModal: jasmine.SpyObj<NgbActiveModal>;
  let pdf: jasmine.SpyObj<NoteStatementPrintService>;
  let parameterManagementService: jasmine.SpyObj<ParameterManagementService>;

  beforeEach(async () => {
    const ngbActiveModalSpy = jasmine.createSpyObj('NgbActiveModal', ['close']);
    const pdfSpy = jasmine.createSpyObj('NoteStatementPrintService', ['pdfGenerate']);
    const translateServiceSpy = jasmine.createSpyObj('TranslateService', ['currentLang']);
    const parameterManagementServiceSpy = jasmine.createSpyObj('ParameterManagementService', ['getParameter']);

    await TestBed.configureTestingModule({
      declarations: [CheckStatementDetailNotesModalComponent, MockTranslatePipe, AdfButtonComponent],
      providers: [
        { provide: NgbActiveModal, useValue: ngbActiveModalSpy },
        { provide: NoteStatementPrintService, useValue: pdfSpy },
        { provide: TranslateService, useValue: translateServiceSpy },
        { provide: ParameterManagementService, useValue: parameterManagementServiceSpy },
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

    fixture = TestBed.createComponent(CheckStatementDetailNotesModalComponent);
    component = fixture.componentInstance;

    ngbActiveModal = TestBed.inject(NgbActiveModal) as jasmine.SpyObj<NgbActiveModal>;
    pdf = TestBed.inject(NoteStatementPrintService) as jasmine.SpyObj<NoteStatementPrintService>;
    parameterManagementService = TestBed.inject(ParameterManagementService) as jasmine.SpyObj<ParameterManagementService>;

    parameterManagementService.getParameter.and.returnValue({
      firstName: 'John',
      firstLastname: 'Smith',
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

  it('should download pdf', () => {
    component.download();
    expect(pdf.pdfGenerate).toHaveBeenCalled();
  });
});
