import { TestBed } from '@angular/core/testing';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { AdfFormatService } from '@adf/components';
import { UtilWorkFlowService } from 'src/app/service/common/util-work-flow.service';
import { iATEVoucherLayoutMock } from 'src/assets/mocks/modules/transfer/service/transfer-ach/ach.data.mock';
import { AtdTransferManagerService } from '../definition/transaction/atd-transfer-manager.service';
import { AteTransferVoucherService } from './ate-transfer-voucher.service';

describe('AteTransferVoucherService', () => {
  let service: AteTransferVoucherService;

  let transferManagerDefinition: jasmine.SpyObj<AtdTransferManagerService>;
  let utilWorkFlow: jasmine.SpyObj<UtilWorkFlowService>;
  let adfFormat: jasmine.SpyObj<AdfFormatService>;

  beforeEach(() => {
    const transferManagerDefinitionSpy = jasmine.createSpyObj('AtdTransferManagerService', [
      'buildModalDefinition',
      'buildVoucherDefinition',
      'buildPDfDefinition',
    ]);
    const utilWorkFlowSpy = jasmine.createSpyObj('UtilWorkFlowService', ['getHeadBandLayoutConfirm']);
    const adfFormatSpy = jasmine.createSpyObj('AdfFormatService', ['getFormatDateTime']);

    TestBed.configureTestingModule({
      providers: [
        AteTransferVoucherService,
        { provide: AtdTransferManagerService, useValue: transferManagerDefinitionSpy },
        { provide: UtilWorkFlowService, useValue: utilWorkFlowSpy },
        { provide: AdfFormatService, useValue: adfFormatSpy },
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
    service = TestBed.inject(AteTransferVoucherService);
    transferManagerDefinition = TestBed.inject(AtdTransferManagerService) as jasmine.SpyObj<AtdTransferManagerService>;
    utilWorkFlow = TestBed.inject(UtilWorkFlowService) as jasmine.SpyObj<UtilWorkFlowService>;
    adfFormat = TestBed.inject(AdfFormatService) as jasmine.SpyObj<AdfFormatService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should build voucherLayoutMainBuilder', () => {
    service.voucherLayoutMainBuilder(iATEVoucherLayoutMock);

    expect(transferManagerDefinition.buildVoucherDefinition).toHaveBeenCalled();
    expect(transferManagerDefinition.buildModalDefinition).toHaveBeenCalled();
    expect(transferManagerDefinition.buildPDfDefinition).toHaveBeenCalled();
    expect(utilWorkFlow.getHeadBandLayoutConfirm).toHaveBeenCalled();
    expect(adfFormat.getFormatDateTime).toHaveBeenCalled();
  });
});
