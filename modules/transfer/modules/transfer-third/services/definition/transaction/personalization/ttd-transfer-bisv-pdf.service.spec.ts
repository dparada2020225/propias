import {TestBed} from '@angular/core/testing';
import {TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {TtdTransferBisvPdfService} from './ttd-transfer-bisv-pdf.service';
import {UtilService} from 'src/app/service/common/util.service';
import {AdfFormatService} from '@adf/components';
import {TtdBaseTransferService} from '../base/ttd-base-transfer.service';
import {iPdfLayoutMock} from 'src/assets/mocks/modules/transfer/service/third-transfer/thisrd.data.mock';

describe('TtdTransferBisvPdfService', () => {
  let service: TtdTransferBisvPdfService;
  let util: jasmine.SpyObj<UtilService>;
  let formatService: jasmine.SpyObj<AdfFormatService>;
  let translateService: jasmine.SpyObj<TranslateService>;
  let base: jasmine.SpyObj<TtdBaseTransferService>;

  beforeEach(() => {

    const utilSpy = jasmine.createSpyObj('UtilService', ['getLabelProduct', 'geCurrencSymbol', 'separatorValidation'])
    const formatServiceSpy = jasmine.createSpyObj('AdfFormatService', ['formatAmount'])
    const translateServiceSpy = jasmine.createSpyObj('TranslateService', ['instant'])
    const baseSpy = jasmine.createSpyObj('TtdBaseTransferService', ['builderDataPdf'])

    TestBed.configureTestingModule({
      declarations: [],
      providers: [
        { provide: UtilService, useValue: utilSpy },
        { provide: AdfFormatService, useValue: formatServiceSpy },
        { provide: TranslateService, useValue: translateServiceSpy },
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

    service = TestBed.inject(TtdTransferBisvPdfService);
    util = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
    formatService = TestBed.inject(AdfFormatService) as jasmine.SpyObj<AdfFormatService>;
    translateService = TestBed.inject(TranslateService) as jasmine.SpyObj<TranslateService>;
    base = TestBed.inject(TtdBaseTransferService) as jasmine.SpyObj<TtdBaseTransferService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should build Third Transfer Pdf', () => {
    util.getLabelProduct.and.returnValue('input')
    util.separatorValidation.and.returnValue('-')
    util.geCurrencSymbol.and.returnValue('usd')
    const res = service.buildThirdTransferPdf(iPdfLayoutMock)
    expect(base.builderDataPdf).toHaveBeenCalled()
    expect(formatService.formatAmount).toHaveBeenCalled();
    expect(translateService.instant).toHaveBeenCalled()
    expect(res.title).toEqual('transfers-third-title-modal')
  })

});
