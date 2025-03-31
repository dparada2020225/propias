import {TestBed} from '@angular/core/testing';

import {PmpdVoucherService} from './pmpd-voucher.service';
import {AdfFormatService} from "@adf/components";
import {UtilWorkFlowService} from "../../../../../../service/common/util-work-flow.service";
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {
  iSPPDVoucherParametersMock,
  iSPPESignatureTrackingParametersMock
} from "../../../../../../../assets/mocks/modules/payroll/payroll.mock";

describe('SppdVoucherService', () => {
  let service: PmpdVoucherService;

  let adfFormat: jasmine.SpyObj<AdfFormatService>;
  let utilWorkFlow: jasmine.SpyObj<UtilWorkFlowService>;

  beforeEach(() => {

    const adfFormatSpy = jasmine.createSpyObj('AdfFormatService', ['getFormatDateTime', 'formatAmount'])
    const utilWorkFlowSpy = jasmine.createSpyObj('UtilWorkFlowService', ['getUserDataTransaction'])


    TestBed.configureTestingModule({
      providers: [
        { provide: AdfFormatService, useValue: adfFormatSpy },
        { provide: UtilWorkFlowService, useValue: utilWorkFlowSpy },
      ],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ]
    });
    service = TestBed.inject(PmpdVoucherService);
    adfFormat = TestBed.inject(AdfFormatService) as jasmine.SpyObj<AdfFormatService>;
    utilWorkFlow = TestBed.inject(UtilWorkFlowService) as jasmine.SpyObj<UtilWorkFlowService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should buildConfirmationVoucher', () => {
    adfFormat.getFormatDateTime.and.returnValue({standard: '10/10/10'} as any)
    const req = service.buildConfirmationVoucher(iSPPDVoucherParametersMock)
    expect(req.title).toEqual(iSPPDVoucherParametersMock.title);
    expect(req.subtitle).toEqual(iSPPDVoucherParametersMock.subtitle);
    expect(req.groupList[0].attributes).toHaveSize(4)
  })

  it('should buildVoucherForSignatureTracking', () => {

    const req = service.buildVoucherForSignatureTracking(iSPPESignatureTrackingParametersMock);
    expect(req.subtitle).toEqual('payroll:title');

  })

});
