import {TestBed} from '@angular/core/testing';

import {ILoadItem} from '@adf/components';
import {Router} from '@angular/router';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {UtilService} from 'src/app/service/common/util.service';
import {ParameterManagementService} from 'src/app/service/navegation-parameters/parameter-management.service';
import {
  iConsultDetailTPLMock,
  iThirdPartyLoanAssociateMock,
  iTPLAccountsBodyRequestMock
} from 'src/assets/mocks/modules/loan/loan.data.mock';
import {mockModal} from 'src/assets/mocks/modules/transfer/service/own-transfer/otd-transfer-modal.mock';
import {mockObservable, mockPromise} from 'src/assets/testing';
import {ENavigateProtectionParameter, EPaymentLoansFlowView} from '../../../enum/navigate-protection-parameter.enum';
import {IThirdPartyLoanAssociate} from '../../../interfaces/crud/crud-third-party-loans-interface';
import {TpldTableManagerService} from '../../definition/table/tpld-table-manager.service';
import {ThirdPartyLoansService} from '../../transaction/third-party-loans.service';
import {TpleThirdPartyLoansService} from './tple-third-party-loans.service';

describe('TpleThirdPartyLoansService', () => {
  let service: TpleThirdPartyLoansService;
  let utils: jasmine.SpyObj<UtilService>;
  let tplThirdPartyService: jasmine.SpyObj<ThirdPartyLoansService>;
  let parameterManagementService: jasmine.SpyObj<ParameterManagementService>;
  let router: jasmine.SpyObj<Router>;
  let tableManagerService: jasmine.SpyObj<TpldTableManagerService>;
  let modalService: jasmine.SpyObj<NgbModal>;

  beforeEach(() => {

    const utilsSpy = jasmine.createSpyObj('UtilService', ['getCurrencySymbolToIso', 'showLoader', '', 'hideLoader'])
    const tplThirdPartyServiceSpy = jasmine.createSpyObj('ThirdPartyLoansService', ['getThirdPartyLoansAccount', 'consultDetail', 'deleteLoan'])
    const parameterManagementServiceSpy = jasmine.createSpyObj('ParameterManagementService', ['sendParameters'])
    const routerSpy = jasmine.createSpyObj('Router', ['navigate'])
    const tableManagerServiceSpy = jasmine.createSpyObj('TpldTableManagerService', ['buildDeleteAlert'])
    const modalServiceSpy = jasmine.createSpyObj('NgbModal', ['open'])

    TestBed.configureTestingModule({
      providers: [
        { provide: UtilService, useValue: utilsSpy },
        { provide: ThirdPartyLoansService, useValue: tplThirdPartyServiceSpy },
        { provide: ParameterManagementService, useValue: parameterManagementServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: TpldTableManagerService, useValue: tableManagerServiceSpy },
        { provide: NgbModal, useValue: modalServiceSpy },
      ]
    });
    service = TestBed.inject(TpleThirdPartyLoansService);
    utils = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
    tplThirdPartyService = TestBed.inject(ThirdPartyLoansService) as jasmine.SpyObj<ThirdPartyLoansService>;
    parameterManagementService = TestBed.inject(ParameterManagementService) as jasmine.SpyObj<ParameterManagementService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    tableManagerService = TestBed.inject(TpldTableManagerService) as jasmine.SpyObj<TpldTableManagerService>;
    modalService = TestBed.inject(NgbModal) as jasmine.SpyObj<NgbModal>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should parse Third Party Loans', () => {
    utils.getCurrencySymbolToIso.and.returnValue(`currency_iso_usd`)
    const res = service.parseThirdPartyLoans([iThirdPartyLoanAssociateMock])
    expect(res.length).toEqual(1)
  })

  xit('should get Third Party Loans', () => {
    tplThirdPartyService.getThirdPartyLoansAccount.and.returnValue(mockObservable([iThirdPartyLoanAssociateMock]))
    const res = service.getThirdPartyLoans(iTPLAccountsBodyRequestMock);
    res.subscribe({
      next: (value) => {
        expect(value).toEqual([iThirdPartyLoanAssociateMock])
      },
      complete() {
        expect(utils.showLoader).toHaveBeenCalled()
      }
    })
  })

  it('should go To Payment', () => {
    const view = EPaymentLoansFlowView.THIRD_PARTY_LOANS
    router.navigate.and.returnValue(mockPromise(true));
    service.gotToPayment(iThirdPartyLoanAssociateMock, view);
    expect(parameterManagementService.sendParameters).toHaveBeenCalledWith({
      navigateStateParameters: {
        loanToPayment: iThirdPartyLoanAssociateMock,
        view
      },
      navigationProtectedParameter: ENavigateProtectionParameter.PAYMENT,
    })
    expect(router.navigate).toHaveBeenCalledWith(['/loan/third-party-loans/payment'])
  })

  it('should handle Update Third Party Loan', () => {
    const view = EPaymentLoansFlowView.THIRD_PARTY_LOANS
    const selectAccount = iThirdPartyLoanAssociateMock

    router.navigate.and.returnValue(mockPromise(true));
    service.handleUpdateThirdPartyLoan(selectAccount, view)
    expect(parameterManagementService.sendParameters).toHaveBeenCalledWith({
      navigateStateParameters: {
        ...selectAccount,
        view
      },
      navigationProtectedParameter: ENavigateProtectionParameter.UPDATE,
    })
    expect(router.navigate).toHaveBeenCalledWith(['/loan/third-party-loans/update'])
  })

  it('should open Delete Modal', () => {
    router.navigate.and.returnValue(mockPromise(true));
    tplThirdPartyService.consultDetail.and.returnValue(mockObservable(iConsultDetailTPLMock))
    const mock: ILoadItem<IThirdPartyLoanAssociate> = {
      action: 'delete',
      item: iThirdPartyLoanAssociateMock
    }
    modalService.open.and.returnValue(mockModal as NgbModalRef);

    service.openDeleteModal(mock, EPaymentLoansFlowView.THIRD_PARTY_LOANS)

    expect(tableManagerService.buildDeleteAlert).toHaveBeenCalled();
  })

  it('should message Alert ', () => {
    expect(service.messageAlert).toBeDefined();
  })

});
