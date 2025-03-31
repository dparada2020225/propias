import {TestBed} from '@angular/core/testing';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TteTransferDeleteAccountService} from './tte-transfer-delete-account.service';
import {UtilService} from 'src/app/service/common/util.service';
import {UtilWorkFlowService} from 'src/app/service/common/util-work-flow.service';
import {TTDCRUDManagerService} from '../definition/crud/manager/ttd-crud-manager.service';
import {AdfFormatService} from '@adf/components';
import {iTTDDeleteConfirmMock} from 'src/assets/mocks/modules/transfer/service/third-transfer/thisrd.data.mock';

describe('TteTransferDeleteAccountService', () => {
  let service: TteTransferDeleteAccountService;
  let util: jasmine.SpyObj<UtilService>;
  let utilWorkFlow: jasmine.SpyObj<UtilWorkFlowService>;
  let crudManagerService: jasmine.SpyObj<TTDCRUDManagerService>;
  let formatService: jasmine.SpyObj<AdfFormatService>;

  beforeEach(() => {

    const utilSpy = jasmine.createSpyObj('UtilService', ['getUserName'])
    const utilWorkFlowSpy = jasmine.createSpyObj('UtilWorkFlowService', ['getHeadBandLayoutConfirm'])
    const crudManagerServiceSpy = jasmine.createSpyObj('TTDCRUDManagerService', ['builderDeleteConfirmationTTD', 'builderDeleteConfirmationModalTTD', 'builderDeleteConfirmationPdfTTD'])
    const formatServiceSpy = jasmine.createSpyObj('AdfFormatService', ['getFormatDateTime'])

    TestBed.configureTestingModule({
      declarations: [],
      providers: [
        {provide: UtilService, useValue: utilSpy},
        {provide: UtilWorkFlowService, useValue: utilWorkFlowSpy},
        {provide: TTDCRUDManagerService, useValue: crudManagerServiceSpy},
        {provide: AdfFormatService, useValue: formatServiceSpy}
      ],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
    });

    service = TestBed.inject(TteTransferDeleteAccountService);
    util = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
    utilWorkFlow = TestBed.inject(UtilWorkFlowService) as jasmine.SpyObj<UtilWorkFlowService>;
    crudManagerService = TestBed.inject(TTDCRUDManagerService) as jasmine.SpyObj<TTDCRUDManagerService>;
    formatService = TestBed.inject(AdfFormatService) as jasmine.SpyObj<AdfFormatService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should voucher Delete Layout', () => {
    service.voucherDeleteLayout(iTTDDeleteConfirmMock)
    expect(util.getUserName).toHaveBeenCalled()
    expect(formatService.getFormatDateTime).toHaveBeenCalled()
    expect(utilWorkFlow.getHeadBandLayoutConfirm).toHaveBeenCalled()
    expect(crudManagerService.builderDeleteConfirmationTTD).toHaveBeenCalled()
  })

});
