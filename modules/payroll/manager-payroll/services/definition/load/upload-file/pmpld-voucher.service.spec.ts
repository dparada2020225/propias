import {TestBed} from '@angular/core/testing';

import {PmpldVoucherService} from './pmpld-voucher.service';
import {AdfFormatService} from "@adf/components";
import {iSplfdVoucherParametersMock} from "../../../../../../../../assets/mocks/modules/payroll/payroll.mock";

describe('SppldVoucherService', () => {
  let service: PmpldVoucherService;
  let adfFormatService: jasmine.SpyObj<AdfFormatService>;


  beforeEach(() => {
    const adfFormatServiceSpy = jasmine.createSpyObj('AdfFormatService', ['formatAmount'])
    TestBed.configureTestingModule({
      providers: [
        { provide: AdfFormatService, useValue: adfFormatServiceSpy },
      ]
    });
    service = TestBed.inject(PmpldVoucherService);
    adfFormatService = TestBed.inject(AdfFormatService) as jasmine.SpyObj<AdfFormatService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should buildVoucherLayout', () => {
    const req = service.buildVoucherLayout(iSplfdVoucherParametersMock)
    expect(req.title).toEqual(iSplfdVoucherParametersMock.title)
    expect(req.subtitle).toEqual(iSplfdVoucherParametersMock.subtitle)
  })

});
