import { TestBed } from '@angular/core/testing';
import { OteTransferVoucherService } from './ote-transfer-voucher.service';
import { AdfFormatService } from '@adf/components';
import { OteTransferManagerService } from './ote-transfer-manager.service';
import { OteTransferFormService } from './ote-transfer-form.service';
import { iOTEInitStep1RequestMock, iOTEVoucherLayoutRequestMock } from 'src/assets/mocks/modules/transfer/service/own-transfer/own.data.mock';

describe('OteTransferManagerService', () => {
  let service: OteTransferManagerService;

  //Spy
  let transferForm: jasmine.SpyObj<OteTransferFormService>
  let transferVoucher: jasmine.SpyObj<OteTransferVoucherService>

  beforeEach(() => {

    const transferFormSpy = jasmine.createSpyObj('OteTransferFormService', ['formScreenBuilder', 'changeAccountDebited', 'changeAccountAccredit'])
    const transferVoucherSpy = jasmine.createSpyObj('OteTransferVoucherService', ['voucherLayoutsMainBuilder'])

    TestBed.configureTestingModule({
      providers: [OteTransferManagerService, AdfFormatService,
        { provide: OteTransferFormService, useValue: transferFormSpy },
        { provide: OteTransferVoucherService, useValue: transferVoucherSpy },
      ]
    })
    service = TestBed.inject(OteTransferManagerService)
    transferForm = TestBed.inject(OteTransferFormService) as jasmine.SpyObj<OteTransferFormService>
    transferVoucher = TestBed.inject(OteTransferVoucherService) as jasmine.SpyObj<OteTransferVoucherService>
  });

  it('should be create OteTransferManagerService', () => {
    expect(service).toBeTruthy();
  })

  it('should be create OteTransferManagerService', () => {
    service.formScreenBuilderStep1(iOTEInitStep1RequestMock)
    expect(transferForm.formScreenBuilder).toHaveBeenCalled()

    expect(service.formScreenBuilderStep1).toBeDefined();
  })

  it('should be create changeAccountDebitedStep1', () => {
    const dataMock = '12121212'
    service.changeAccountDebitedStep1(dataMock)
    expect(transferForm.changeAccountDebited).toHaveBeenCalled()
    expect(service.changeAccountDebitedStep1).toBeDefined();
  })

  it('should be create changeAccountAccreditStep1', () => {
    const dataMock = '12121212'
    service.changeAccountAccreditStep1(dataMock)
    expect(transferForm.changeAccountAccredit).toHaveBeenCalled()
    expect(service.changeAccountAccreditStep1).toBeDefined();
  })

  it('should be create voucherLayoutsMainBuilderStep3', () => {
    service.voucherLayoutsMainBuilderStep3(iOTEVoucherLayoutRequestMock)
    expect(transferVoucher.voucherLayoutsMainBuilder).toHaveBeenCalled()
    expect(service.voucherLayoutsMainBuilderStep3).toBeDefined();
  })
})
