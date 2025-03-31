// import { TestBed } from '@angular/core/testing';
// import { OteTransferVoucherService } from './ote-transfer-voucher.service';
// import { AdfFormatService, AdfFormBuilderService, IObjectFormat } from '@adf/components';
// import { UtilWorkFlowService } from '../../../../../../services/common/util-work-flow.service';
// import { TranslateService } from '@ngx-translate/core';
// import creditAccounts from '../../../../../../../assets/mocks/modules/transfer/service/own-transfer/credit-accounts.json'
// import { IAccount } from 'projects/online-banking/src/app/models/account.inteface';
// import { ILayoutVoucherSimple } from '../../interfaces/own-transfer.interface';
// import { IOTEVoucherLayoutRequest } from '../../interfaces/own-transfer-execution.interface';
// import { OtdTransferVoucherModalService } from '../definition/otd-transfer-voucher-modal.service';
// import { IUserDataTransaction } from 'projects/online-banking/src/app/models/util-work-flow.interface';
// import { UtilService } from 'projects/online-banking/src/app/services/common/util.service';
// import { OtdTransferVoucherService } from '../definition/otd-transfer-voucher.service';
// import { OtdTransferVoucherPfdService } from '../definition/otd-transfer-voucher-pfd.service';
// import { builderLayoutVoucherMock } from '../../../../../../../assets/mocks/modules/transfer/service/own-transfer/otd-transfer-voucher-mock-service';


// xdescribe('OTE-TRANSFER-VOUCHER', () => {
//   let service: OteTransferVoucherService;

//   //Spy
//   let formatService: jasmine.SpyObj<AdfFormatService>
//   let utilWorkFlow: jasmine.SpyObj<UtilWorkFlowService>
//   let translateService: jasmine.SpyObj<TranslateService>
//   let otdTransferVoucherModalService: jasmine.SpyObj<OtdTransferVoucherModalService>


//   beforeEach(() => {

//     const formatServiceSpy = jasmine.createSpyObj('AdfFormatService', ['getFormatDateTime'])
//     const utilWorkFlowSpy = jasmine.createSpyObj('UtilWorkFlowService', ['getHeadBandLayoutConfirm'])
//     const translateServiceSpy = jasmine.createSpyObj('TranslateService', ['instant'])
//     const otdTransferVoucherModalServiceSpy = jasmine.createSpyObj('OtdTransferVoucherModalService', ['builderLayoutVoucherModal'])


//     TestBed.configureTestingModule({
//       providers: [OteTransferVoucherService, AdfFormatService,
//         { provide: AdfFormatService, useValue: formatServiceSpy },
//         { provide: UtilWorkFlowService, useValue: utilWorkFlowSpy },
//         { provide: TranslateService, useValue: translateServiceSpy },
//         { provide: OtdTransferVoucherModalService, useValue: otdTransferVoucherModalServiceSpy },
//       ]
//     })
//     service = TestBed.inject(OteTransferVoucherService)
//     formatService = TestBed.inject(AdfFormatService) as jasmine.SpyObj<AdfFormatService>
//     utilWorkFlow = TestBed.inject(UtilWorkFlowService) as jasmine.SpyObj<UtilWorkFlowService>
//     translateService = TestBed.inject(TranslateService) as jasmine.SpyObj<TranslateService>
//     otdTransferVoucherModalService = TestBed.inject(OtdTransferVoucherModalService) as jasmine.SpyObj<OtdTransferVoucherModalService>
//   });

//   it('should be create OTE-TRANSFER-VOUCHER.SERVICE', () => {
//     expect(service).toBeTruthy();
//   })

//   const account: IAccount = {
//     account: "010010010820",
//     alias: "nomina",
//     currency: "L",
//     product: 2,
//     subproduct: 1,
//     enabled: true,
//     cif: "1651457",
//     consortium: "",
//     agency: 900,
//     mask: "01-001-001082-0",
//     name: "CR PARTSGROUP, S.A. I",
//     status: "Activa",
//     availableAmount: 252.93,
//     totalAmount: 252.93
//   }

//   const formValueData: ILayoutVoucherSimple = {
//     amount: 2555,
//     comment: 'string',
//   }

//   const data: IOTEVoucherLayoutRequest = {
//     title: 'own-transfer',
//     subtitle: 'own-transfer',
//     date: '19092022000000',
//     titlePdf: 'own-transfer',
//     reference: '1425',
//     fileNamePdf: 'own-transfer',
//     accountCredit: account,
//     accountDebited: account,
//     formValues: formValueData,
//   }
//   it('should return Obj { layoutJsonVoucher, headBandLayout, layoutJsonVoucherModal, pdfLayout  }', () => {
//     const test = service.voucherLayoutsMainBuilder(data);
//     console.log(test)
//     // expect(otdTransferVoucherModalService.builderLayoutVoucherModal).toHaveBeenCalled()
//     expect(test.layoutJsonVoucher.title).toEqual('own-transfer')
//   })


// })
