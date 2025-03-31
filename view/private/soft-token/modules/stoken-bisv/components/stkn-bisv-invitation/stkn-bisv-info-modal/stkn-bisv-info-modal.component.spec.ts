import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdfComponentsModule } from '@adf/components';
import { StorageService } from '@adf/security';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { NgxSpinnerModule } from 'ngx-spinner';
import { UtilService } from 'src/app/service/common/util.service';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { StknBisvDevelService } from '../../../services/transaction/DEVEL/stkn-bisv-devel.service';
import { StknBisvCodeQrComponent } from '../../stkn-bisv-code-qr/stkn-bisv-code-qr.component';
import { StknBisvStepVerticalComponent } from '../../stkn-bisv-steps-indicator/stkn-bisv-step-vertical/stkn-bisv-step-vertical.component';
import { StknBisvQrModalComponent } from '../stkn-bisv-qr-modal/stkn-bisv-qr-modal.component';
import { StknBisvInfoModalComponent } from './stkn-bisv-info-modal.component';

fdescribe('StknBisvInfoModalComponent', () => {
  let component: StknBisvInfoModalComponent;
  let fixture: ComponentFixture<StknBisvInfoModalComponent>;

  let activeModal: jasmine.SpyObj<NgbActiveModal>;
  let storage: jasmine.SpyObj<StorageService>;
  let parameterManager: jasmine.SpyObj<ParameterManagementService>;
  let router: jasmine.SpyObj<Router>;
  let util: jasmine.SpyObj<UtilService>;
  let stokenBisvDevelServices: jasmine.SpyObj<StknBisvDevelService>;
  let modalService: jasmine.SpyObj<NgbModal>;




  beforeEach(async () => {

    const activeModalSpy = jasmine.createSpyObj('NgbActiveModal', ['close']);
    const modalServiceSpy = jasmine.createSpyObj('NgbModal', ['open']);
    const storageSpy = jasmine.createSpyObj('StorageService', ['getItem']);
    const parameterManagerSpy = jasmine.createSpyObj('ParameterManagementService', ['getParameter', 'sendParameters']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const utilSpy = jasmine.createSpyObj('UtilService', ['getProfile']);
    const stokenBisvDevelServicesSpy = jasmine.createSpyObj('StknBisvDevelService', ['consultGracePeriod'])

    await TestBed.configureTestingModule({
      providers: [
        { provide: NgbActiveModal, useValue: activeModalSpy },
        { provide: StorageService, useValue: storageSpy },
        { provide: ParameterManagementService, useValue: parameterManagerSpy },
        { provide: Router, useValue: routerSpy },
        { provide: UtilService, useValue: utilSpy },
        { provide: StknBisvDevelService, useValue: stokenBisvDevelServicesSpy },
        { provide: NgbModal, useValue: modalServiceSpy },
      ],
      imports: [
        BrowserAnimationsModule,
        NgxSpinnerModule,
        HttpClientTestingModule,
        NgbModalModule,
        AdfComponentsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
      declarations: [StknBisvInfoModalComponent, StknBisvQrModalComponent, StknBisvStepVerticalComponent, StknBisvCodeQrComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(StknBisvInfoModalComponent);
    component = fixture.componentInstance;

    activeModal = TestBed.inject(NgbActiveModal) as jasmine.SpyObj<NgbActiveModal>;
    parameterManager = TestBed.inject(ParameterManagementService) as jasmine.
      SpyObj<ParameterManagementService>;
    modalService = TestBed.inject(NgbModal) as jasmine.SpyObj<NgbModal>;

    TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
    TestBed.inject(Router) as jasmine.SpyObj<Router>;
    TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
    TestBed.inject(StknBisvDevelService) as jasmine.SpyObj<StknBisvDevelService>;

    fixture.detectChanges();
  });

  it('should create StknBisvInfoModalComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should close the modal when the user click the return button if the user is in grace period', () => {

    const returnBtn = fixture.debugElement.query(By.css('#backBtn-info-stoken'));
    returnBtn.triggerEventHandler('click', null);

    expect(activeModal.close).toHaveBeenCalled();

  });

  const modalRefMockResultClose = {
    componentInstance: {
      allowCloseModal: true,
    },
    result: Promise.resolve('close'),
  };


  it('should close the modal and open the QR modal if the user click the Continue button', () => {

    parameterManager.getParameter.withArgs('userIsInGracePeriodStokenBisv').and.returnValue(true);
    modalService.open.and.returnValue(modalRefMockResultClose as any);

    const nextBtn = fixture.debugElement.query(By.css('#information-stoken-btn'));
    nextBtn.triggerEventHandler('click', null);

    expect(activeModal.close).toHaveBeenCalled();

    modalRefMockResultClose.result.then((result) => {
      if (result === 'close') {
        expect(parameterManager.sendParameters).toHaveBeenCalled();
      }
    }).finally(() => { });

  });

  it('should close the modal if the user clicks the X button', () => {
    const xBtnt = fixture.debugElement.query(By.css('#btn-X-method-stoken-bisv'));
    xBtnt.triggerEventHandler('click', null);

    expect(activeModal.close).toHaveBeenCalled();
  });


  it('should not close the modal if is not allowed close the modal', () => {
    component.allowCloseModal = false;

    const xBtnt = fixture.debugElement.query(By.css('#btn-X-method-stoken-bisv'));
    xBtnt.triggerEventHandler('click', null);

    expect(activeModal.close).not.toHaveBeenCalled();

  });

  it('should not show the return button if is not in grace period', () => {
    component.showRememberLaterBtn = false;

    fixture.autoDetectChanges();
    const backBtn = fixture.debugElement.query(By.css('#backBtn-info-stoken'));
    expect(backBtn).toBeNull();

  });
});