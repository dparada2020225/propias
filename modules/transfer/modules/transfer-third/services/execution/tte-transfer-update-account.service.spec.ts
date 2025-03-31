import {TestBed} from '@angular/core/testing';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TteTransferUpdateAccountService} from './tte-transfer-update-account.service';
import {TTDCRUDManagerService} from '../definition/crud/manager/ttd-crud-manager.service';
import {AdfFormatService} from '@adf/components';
import {iTTDUpdateConfirmMockThird} from 'src/assets/mocks/modules/transfer/service/third-transfer/thisrd.data.mock';

describe('TteTransferUpdateAccountService', () => {
  let service: TteTransferUpdateAccountService;
  let crudManagerService: jasmine.SpyObj<TTDCRUDManagerService>;
  let formatService: jasmine.SpyObj<AdfFormatService>;

  beforeEach(() => {

    const crudManagerServiceSpy = jasmine.createSpyObj('TTDCRUDManagerService', ['builderUpdateConfirmationTTU', 'builderUpdateConfirmationModalTTU', 'builderUpdateConfirmationPdfTTU'])
    const formatServiceSpy = jasmine.createSpyObj('AdfFormatService', ['getFormatDateTime'])

    TestBed.configureTestingModule({
      declarations: [],
      providers: [{provide: TTDCRUDManagerService, useValue: crudManagerServiceSpy},
        {provide: AdfFormatService, useValue: formatServiceSpy}],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
    });

    service = TestBed.inject(TteTransferUpdateAccountService);
    crudManagerService = TestBed.inject(TTDCRUDManagerService) as jasmine.SpyObj<TTDCRUDManagerService>;
    formatService = TestBed.inject(AdfFormatService) as jasmine.SpyObj<AdfFormatService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should voucher Layout Update', () => {
    service.voucherLayoutUpdate(iTTDUpdateConfirmMockThird)
    expect(formatService.getFormatDateTime).toHaveBeenCalled()
    expect(crudManagerService.builderUpdateConfirmationTTU).toHaveBeenCalled()
  })

});
