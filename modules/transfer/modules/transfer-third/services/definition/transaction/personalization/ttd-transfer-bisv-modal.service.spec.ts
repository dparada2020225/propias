import {TestBed} from '@angular/core/testing';
import {TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {TtdTransferBisvModalService} from './ttd-transfer-bisv-modal.service';
import {UtilService} from 'src/app/service/common/util.service';
import {UtilWorkFlowService} from 'src/app/service/common/util-work-flow.service';
import {AdfFormatService} from '@adf/components';
import {TtdBaseTransferService} from '../base/ttd-base-transfer.service';
import {iThirdTransferModalMock} from 'src/assets/mocks/modules/transfer/service/third-transfer/thisrd.data.mock';

describe('TtdTransferBisvModalService', () => {
  let service: TtdTransferBisvModalService;
  let translate: jasmine.SpyObj<TranslateService>;
  let util: jasmine.SpyObj<UtilService>;
  let utilWorkFlow: jasmine.SpyObj<UtilWorkFlowService>;
  let formatService: jasmine.SpyObj<AdfFormatService>;
  let base: jasmine.SpyObj<TtdBaseTransferService>;

  beforeEach(() => {

    const translateSpy = jasmine.createSpyObj('TranslateService', ['instant'])
    const utilSpy = jasmine.createSpyObj('UtilService', ['getLabelProduct', 'geCurrencSymbol'])
    const utilWorkFlowSpy = jasmine.createSpyObj('UtilWorkFlowService', ['getUserDataModalPdf', 'getHeadBandLayout', 'buildImagesToModal'])
    const formatServiceSpy = jasmine.createSpyObj('AdfFormatService', ['formatAmount'])
    const baseSpy = jasmine.createSpyObj('TtdBaseTransferService', ['builderDataReading'])

    TestBed.configureTestingModule({
      declarations: [],
      providers: [
        { provide: TranslateService, useValue: translateSpy },
        { provide: UtilService, useValue: utilSpy },
        { provide: UtilWorkFlowService, useValue: utilWorkFlowSpy },
        { provide: AdfFormatService, useValue: formatServiceSpy },
        { provide: TtdBaseTransferService, useValue: baseSpy }
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

    service = TestBed.inject(TtdTransferBisvModalService);
    translate = TestBed.inject(TranslateService) as jasmine.SpyObj<TranslateService>;
    util = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
    utilWorkFlow = TestBed.inject(UtilWorkFlowService) as jasmine.SpyObj<UtilWorkFlowService>;
    formatService = TestBed.inject(AdfFormatService) as jasmine.SpyObj<AdfFormatService>;
    base = TestBed.inject(TtdBaseTransferService) as jasmine.SpyObj<TtdBaseTransferService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should build Modal Layout', () => {
    util.getLabelProduct.and.returnValue('input')
    util.geCurrencSymbol.and.returnValue('usd')
    const res = service.buildModalLayout(iThirdTransferModalMock)
    expect(base.builderDataReading).toHaveBeenCalled()
    expect(translate.instant).toHaveBeenCalled();
    expect(utilWorkFlow.getUserDataModalPdf).toHaveBeenCalled()
    expect(formatService.formatAmount).toHaveBeenCalled()
    expect(res.titleModal).toEqual('transfers-third-title-modal')
    expect(res.containerValue).toEqual('note_list-sv')
  })

});
