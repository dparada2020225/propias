import { TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';
import { TtdUpdateBisvFormService } from './ttd-update-bisv-form.service';
import { TtdBaseCrudService } from '../../base/ttd-base-crud.service';
import { UtilService } from 'src/app/service/common/util.service';
import { iThirdTransfersAccountsMock } from 'src/assets/mocks/modules/transfer/service/third-transfer/thisrd.data.mock';

describe('TtdUpdateBisvFormService', () => {
  let service: TtdUpdateBisvFormService;
  let util: jasmine.SpyObj<UtilService>;
  let base: jasmine.SpyObj<TtdBaseCrudService>;

  beforeEach(() => {
    const utilSpy = jasmine.createSpyObj('UtilService', ['getLabelStatus', 'getLabelCurrency'])
    const baseSpy = jasmine.createSpyObj('TtdBaseCrudService', ['builderLayoutAttribute'])

    TestBed.configureTestingModule({
      declarations: [],
      providers: [
        { provide: UtilService, useValue: utilSpy },
        { provide: TtdBaseCrudService, useValue: baseSpy }
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

    service = TestBed.inject(TtdUpdateBisvFormService);
    util = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
    base = TestBed.inject(TtdBaseCrudService) as jasmine.SpyObj<TtdBaseCrudService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should build Update Account Layout', () => {

    util.getLabelStatus.and.returnValue('Active')
    util.getLabelCurrency.and.returnValue('usd')

    const res = service.buildUpdateAccountLayout(iThirdTransfersAccountsMock)

    expect(base.builderLayoutAttribute).toHaveBeenCalledTimes(7)
    expect(res.attributes).toHaveSize(7)
    expect(res.title).toEqual('transfers-third-title')
    expect(res.subtitle).toEqual('title.edit_third_party_account')
    expect(res.class).toEqual('third-edit-layout padding-side')

  })

});
