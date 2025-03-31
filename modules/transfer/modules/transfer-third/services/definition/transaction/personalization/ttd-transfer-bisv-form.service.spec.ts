import { TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';
import { TtdTransferBisvFormService } from './ttd-transfer-bisv-form.service';
import { UtilService } from 'src/app/service/common/util.service';
import { TtdBaseTransferService } from '../base/ttd-base-transfer.service';
import { iTTDFormMock } from 'src/assets/mocks/modules/transfer/service/third-transfer/thisrd.data.mock';

describe('TtdTransferBisvFormService', () => {
  let service: TtdTransferBisvFormService;
  let util: jasmine.SpyObj<UtilService>;
  let base: jasmine.SpyObj<TtdBaseTransferService>;

  beforeEach(() => {

    const utilSpy = jasmine.createSpyObj('UtilService', ['getLabelCurrency', 'getLabelProduct'])
    const baseSpy = jasmine.createSpyObj('TtdBaseTransferService', ['builderLayoutAttributes'])

    TestBed.configureTestingModule({

      declarations: [],
      providers: [
        { provide: UtilService, useValue: utilSpy },
        { provide: TtdBaseTransferService, useValue: baseSpy },
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

    service = TestBed.inject(TtdTransferBisvFormService);
    util = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
    base = TestBed.inject(TtdBaseTransferService) as jasmine.SpyObj<TtdBaseTransferService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should build Simple ThirdTransfer Layout', () => {

    util.getLabelCurrency.and.returnValue('usd')
    util.getLabelProduct.and.returnValue('input')
    const res = service.buildSimpleThirdTransferLayout(iTTDFormMock)
    expect(res.title).toEqual('Transfer')
    expect(res.subtitle).toEqual('third')
    expect(base.builderLayoutAttributes).toHaveBeenCalled()

  })

});
