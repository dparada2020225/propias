import {TestBed} from '@angular/core/testing';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TteTransferCrudService} from './tte-transfer-add-account.service';
import {UtilWorkFlowService} from 'src/app/service/common/util-work-flow.service';
import {AdfFormatService} from '@adf/components';
import {UtilService} from 'src/app/service/common/util.service';
import {TTDCRUDManagerService} from '../definition/crud/manager/ttd-crud-manager.service';
import {iTTDCreateConfirmMockThird} from 'src/assets/mocks/modules/transfer/service/third-transfer/thisrd.data.mock';

describe('TteTransferCrudService', () => {
  let service: TteTransferCrudService;

  let definitionServiceManager: jasmine.SpyObj<TTDCRUDManagerService>;
  let utilWorkFlow: jasmine.SpyObj<UtilWorkFlowService>;
  let formatService: jasmine.SpyObj<AdfFormatService>;
  let util: jasmine.SpyObj<UtilService>;

  beforeEach(() => {

    const definitionServiceManagerSpy = jasmine.createSpyObj('TTDCRUDManagerService', ['builderCreatedConfirmationTTC', 'builderCreatedModalTTC', 'builderCreatedPdfTTC'])
    const utilWorkFlowSpy = jasmine.createSpyObj('UtilWorkFlowService', ['getHeadBandLayoutConfirm'])
    const formatServiceSpy = jasmine.createSpyObj('AdfFormatService', ['getFormatDateTime'])
    const utilSpy = jasmine.createSpyObj('UtilService', ['getUserName'])

    TestBed.configureTestingModule({
      declarations: [],
      providers: [
        TteTransferCrudService,
        {provide: TTDCRUDManagerService, useValue: definitionServiceManagerSpy},
        {provide: UtilWorkFlowService, useValue: utilWorkFlowSpy},
        {provide: AdfFormatService, useValue: formatServiceSpy},
        {provide: UtilService, useValue: utilSpy}
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

    service = TestBed.inject(TteTransferCrudService);
    definitionServiceManager = TestBed.inject(TTDCRUDManagerService) as jasmine.SpyObj<TTDCRUDManagerService>;
    utilWorkFlow = TestBed.inject(UtilWorkFlowService) as jasmine.SpyObj<UtilWorkFlowService>;
    formatService = TestBed.inject(AdfFormatService) as jasmine.SpyObj<AdfFormatService>;
    util = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should voucher Layouts Main Builder', () => {
    service.voucherLayoutsMainBuilder(iTTDCreateConfirmMockThird)
    expect(util.getUserName).toHaveBeenCalled()
    expect(formatService.getFormatDateTime).toHaveBeenCalled()
    expect(utilWorkFlow.getHeadBandLayoutConfirm).toHaveBeenCalled()
    expect(definitionServiceManager.builderCreatedConfirmationTTC).toHaveBeenCalled()
  })

});
