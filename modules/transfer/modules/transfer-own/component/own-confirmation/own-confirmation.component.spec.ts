import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {CommonModule, Location} from '@angular/common';
import {OtdTransferConfirmManagerService} from '../../services/definition/manager/otd-transfer-confirm-manager.service';
import {OtdTransferVoucherManagerService} from '../../services/definition/manager/otd-transfer-voucher-manager.service';
import {OwnConfirmationComponent} from './own-confirmation.component';
import {OwnTransferService} from '../../services/transaction/own-transfer.service';
import {ParameterManagementService} from 'src/app/service/navegation-parameters/parameter-management.service';
import {
  StBuildUpdateBodyRequestService
} from 'src/app/modules/transaction-manager/modules/signature-tracking/services/definition/st-build-update-body-request.service';
import {
  SignatureTrackingService
} from 'src/app/modules/transaction-manager/modules/signature-tracking/services/transaction/signature-tracking.service';
import {UtilService} from 'src/app/service/common/util.service';
import {RouterTestingModule} from '@angular/router/testing';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AdfComponentsModule} from '@adf/components';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {EOwnTransferViewMode} from '../../enum/own-transfer.enum';
import {of, Subscription, throwError} from 'rxjs';
import {
  iOTDFormMock,
  iOwnTransferStateMockDefault,
  iResponseOwnTransfersMock
} from 'src/assets/mocks/modules/transfer/service/own-transfer/own.data.mock';
import {HttpStatusCode} from '../../../../../../enums/http-status-code.enum';
import {IOTDConfirm} from '../../interfaces/own-transfer-definition.interface';
import {iMultipleRequestResponseMock} from 'src/assets/mocks/modules/signature-tracking/mocksDetailTransaction';
import {OteExecuteTransactionService} from "../../services/execution/ote-execute-transaction.service";
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from "@angular/core";


describe('OwnConfirmationComponent', () => {
  let component: OwnConfirmationComponent;
  let fixture: ComponentFixture<OwnConfirmationComponent>;

  let location: jasmine.SpyObj<Location>;
  let router: Router
  let parameterManagement: jasmine.SpyObj<ParameterManagementService>;
  let definitionServiceManager: jasmine.SpyObj<OtdTransferConfirmManagerService>
  let ownTransferService: jasmine.SpyObj<OwnTransferService>;
  let signatureTransactionService: jasmine.SpyObj<SignatureTrackingService>;
  let util: jasmine.SpyObj<UtilService>;
  let OtdTransferVoucherManager: jasmine.SpyObj<OtdTransferVoucherManagerService>;
  let ownTransaction: jasmine.SpyObj<OteExecuteTransactionService>;


  beforeEach(async () => {

    const locationSpy = jasmine.createSpyObj('Location', ['back']);
    const parameterManagementSpy = jasmine.createSpyObj('ParameterManagementService', ['sendParameters', 'getParameter']);
    const definitionServiceManagerSpy = jasmine.createSpyObj('OtdTransferConfirmManagerService', ['builderLayoutConfirmationStep2']);
    const ownTransferServiceSpy = jasmine.createSpyObj('OwnTransferService', ['ownTransfer']);
    const signatureTransactionServiceSpy = jasmine.createSpyObj('SignatureTrackingService', ['update']);
    const signatureTrackingCommonDefinitionSpy = jasmine.createSpyObj('StBuildUpdateBodyRequestService', ['buildBodyToUpdateTransaction']);
    const utilSpy = jasmine.createSpyObj('UtilService', ['scrollToTop', 'fillStrings', 'showLoader', 'hideLoader']);
    const OtdTransferVoucherManagerSpy = jasmine.createSpyObj('OtdTransferVoucherManagerService', ['buildAccountToExecuteTransferStep3']);
    const ownTransactionSpy = jasmine.createSpyObj('OteExecuteTransactionService', ['message', 'resetMessage', 'execute'])

    await TestBed.configureTestingModule({
      declarations: [OwnConfirmationComponent],
      providers: [
        {provide: Location, useValue: locationSpy},
        {provide: ParameterManagementService, useValue: parameterManagementSpy},
        {provide: OtdTransferConfirmManagerService, useValue: definitionServiceManagerSpy},
        {provide: OwnTransferService, useValue: ownTransferServiceSpy},
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                view: EOwnTransferViewMode.DEFAULT
              }
            }
          }
        },
        {provide: SignatureTrackingService, useValue: signatureTransactionServiceSpy},
        {provide: StBuildUpdateBodyRequestService, useValue: signatureTrackingCommonDefinitionSpy},
        {provide: UtilService, useValue: utilSpy},
        {provide: OtdTransferVoucherManagerService, useValue: OtdTransferVoucherManagerSpy},
        { provide: OteExecuteTransactionService, useValue: ownTransactionSpy },

      ],
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        AdfComponentsModule,
        NgbModule,
        RouterTestingModule.withRoutes([]),
        RouterModule,
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

    fixture = TestBed.createComponent(OwnConfirmationComponent);
    component = fixture.componentInstance;

    location = TestBed.inject(Location) as jasmine.SpyObj<Location>;
    router = TestBed.inject(Router);
    parameterManagement = TestBed.inject(ParameterManagementService) as jasmine.SpyObj<ParameterManagementService>;
    definitionServiceManager = TestBed.inject(OtdTransferConfirmManagerService) as jasmine.SpyObj<OtdTransferConfirmManagerService>;
    ownTransferService = TestBed.inject(OwnTransferService) as jasmine.SpyObj<OwnTransferService>;
    signatureTransactionService = TestBed.inject(SignatureTrackingService) as jasmine.SpyObj<SignatureTrackingService>;
    util = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
    OtdTransferVoucherManager = TestBed.inject(OtdTransferVoucherManagerService) as jasmine.SpyObj<OtdTransferVoucherManagerService>;
    ownTransaction = TestBed.inject(OteExecuteTransactionService) as jasmine.SpyObj<OteExecuteTransactionService>;

    spyOn(router.events, 'subscribe').and.callFake((observer: any) => {
      observer.next({navigationTrigger: 'popstate'} as any);
      return new Subscription();
    });
    parameterManagement.getParameter.and.returnValue(iOwnTransferStateMockDefault);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show alert', () => {
    component.showAlert('succes', 'Next step');

    expect(component.typeAlert).toEqual('succes');
    expect(component.messageAlert).toEqual('Next step');
  });

  it('should hidden alert', () => {
    component.hiddenAlert();

    expect(component.typeAlert).toEqual(null);
    expect(component.messageAlert).toEqual(null);
  });

  it('should reset storage', () => {
    const navParameters = 'router';

    const msgMock = {
      navigationProtectedParameter: navParameters,
    };

    component.resetStorage(navParameters);

    expect(parameterManagement.sendParameters).toHaveBeenCalled();
    expect(parameterManagement.sendParameters).toHaveBeenCalledWith(msgMock);
  });

  it('should scroll to top', () => {

    component.scrollToTop();
    expect(util.scrollToTop).toHaveBeenCalled();

  })

  it('should handle Response Transaction and navigate to "/transfer/own/stm-voucher"', fakeAsync(() => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.callFake(() => Promise.resolve(true));
    component.gotToVoucherModifySignatureTracking(iResponseOwnTransfersMock);
    tick(4000);
    expect(parameterManagement.sendParameters).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/transfer/own/stm-voucher']);
    expect(util.hideLoader).toHaveBeenCalled();
  }));


  it('builderVoucherLayout', () => {
    component.builderVoucherLayout(iOTDFormMock);

    const confirm: IOTDConfirm = {
      title: iOTDFormMock.title,
      subtitle: iOTDFormMock.subtitle,
      accountDebited: component.debitedAccountSelected as any,
      accountCredit: component.accreditAccountSelected as any,
      amount: component.formValues?.amount as any,
      comment: component.formValues?.comment as any,
    };

    expect(definitionServiceManager.builderLayoutConfirmationStep2).toHaveBeenCalled();
    expect(component.voucherLayout).toEqual(definitionServiceManager.builderLayoutConfirmationStep2(confirm));
  });

  it('handleExecuteModifyTransaction', fakeAsync(() => {
    spyOn(component, 'gotToVoucherModifySignatureTracking');
    spyOn(component, 'getBodyToUpdateTransaction');

    signatureTransactionService.update.and.returnValue(of(iMultipleRequestResponseMock));
    component.handleExecuteModifyTransaction();
    tick(4000);
    expect(signatureTransactionService.update).toHaveBeenCalled();
    expect(component.gotToVoucherModifySignatureTracking).toHaveBeenCalled();
    expect(util.showLoader).toHaveBeenCalled();
  }));

  it('lastStep', () => {
    spyOn(component, 'resetStorage');
    component.lastStep();
    expect(location.back).toHaveBeenCalled();
    expect(component.resetStorage).toHaveBeenCalled();
  });


  it('nextStep EOwnTransferViewMode.SIGNATURE_TRACKING', () => {
    spyOn(component, 'handleExecuteModifyTransaction');
    component.viewMode = EOwnTransferViewMode.SIGNATURE_TRACKING;
    fixture.detectChanges();
    component.nextStep();
    expect(component.handleExecuteModifyTransaction).toHaveBeenCalled();
  });

  it('initVoucherLayout', () => {
    spyOn(component, 'builderVoucherLayout').and.callThrough();
    component.initVoucherLayout();
    expect(component.initVoucherLayout).toBeDefined();
    expect(component.builderVoucherLayout).toHaveBeenCalled();
  });

  it('should call init Voucher Layout with SIGNATURE-TRAKING', () => {
    spyOn(component, 'builderVoucherLayout');
    component.viewMode = EOwnTransferViewMode.SIGNATURE_TRACKING;
    component.initVoucherLayout();
    expect(component.builderVoucherLayout).toHaveBeenCalled();
  });


  it('should handleExecuteModifyTransaction with error', () => {
    signatureTransactionService.update.and.returnValue(throwError(() => new Error({error: 'Error inesperado'} as any)));

    component.handleExecuteModifyTransaction();
    expect(component.typeAlert).toEqual('error');
    expect(component.messageAlert).toEqual('signature_tracking:error:modify_transaction');
    expect(util.scrollToTop).toHaveBeenCalled();
  });

  it('should handleExecuteModifyTransaction with Signature Traking error', () => {
    signatureTransactionService.update.and.returnValue(throwError(() => ({error: {code: HttpStatusCode.SIGNATURE_TRACKING_MODIFY_SUCCESS}})));

    spyOn(component, 'gotToVoucherModifySignatureTracking');

    component.handleExecuteModifyTransaction();
    expect(component.gotToVoucherModifySignatureTracking).toHaveBeenCalled();
  });

});
