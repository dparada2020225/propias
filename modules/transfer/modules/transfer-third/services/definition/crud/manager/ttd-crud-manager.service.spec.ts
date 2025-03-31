import {TestBed} from '@angular/core/testing';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TTDCRUDManagerService} from './ttd-crud-manager.service';
import {TTDCreateManagerService} from './ttd-create-manager.service';
import {TTDUpdateManagerService} from './ttd-update-manager.service';
import {TtdDeleteManagerService} from './ttd-delete-manager.service';
import {
  iGetThirdTransferResponseMock,
  iThirdTransfersAccountsMock,
  iTTDCreateConfirmMockThird,
  iTTDDeleteConfirmMock,
  iTTDUpdateConfirmMockThird
} from 'src/assets/mocks/modules/transfer/service/third-transfer/thisrd.data.mock';

describe('TTDCRUDManagerService', () => {
  let service: TTDCRUDManagerService;

  let createManager: jasmine.SpyObj<TTDCreateManagerService>;
  let updateManager: jasmine.SpyObj<TTDUpdateManagerService>;
  let deleteManager: jasmine.SpyObj<TtdDeleteManagerService>;

  beforeEach(() => {

    const createManagerSpy = jasmine.createSpyObj('TTDCreateManagerService', ['buildConsultingLayout', 'buildCreateAccountLayout', 'builderCreatedConfirmation', 'buildCreateVoucherPdfModal', 'buildCreateVoucherPdf'])
    const updateManagerSpy = jasmine.createSpyObj('TTDUpdateManagerService', ['buildUpdateAccountLayout', 'buildUpdateAlert', 'builderUpdateConfirmation', 'builderUpdateConfirmationModal', 'builderUpdateConfirmationPdf'])
    const deleteManagerSpy = jasmine.createSpyObj('TtdDeleteManagerService', ['buildDeleteAccountLayout', 'buildDeleteModalLayout', 'buildDeletePdfLayout'])

    TestBed.configureTestingModule({
      declarations: [],
      providers: [
        {provide: TTDCreateManagerService, useValue: createManagerSpy},
        {provide: TTDUpdateManagerService, useValue: updateManagerSpy},
        {provide: TtdDeleteManagerService, useValue: deleteManagerSpy},
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

    service = TestBed.inject(TTDCRUDManagerService);

    createManager = TestBed.inject(TTDCreateManagerService) as jasmine.SpyObj<TTDCreateManagerService>;
    updateManager = TestBed.inject(TTDUpdateManagerService) as jasmine.SpyObj<TTDUpdateManagerService>;
    deleteManager = TestBed.inject(TtdDeleteManagerService) as jasmine.SpyObj<TtdDeleteManagerService>;

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('CREATE', () => {
    it('should build Consulting Layout TTC', () => {
      service.buildConsultingLayoutTTC()
      expect(createManager.buildConsultingLayout).toHaveBeenCalled();
    })

    it('should build Create Account LayoutTTC', () => {
      service.buildCreateAccountLayoutTTC(iGetThirdTransferResponseMock);
      expect(createManager.buildCreateAccountLayout).toHaveBeenCalledWith(iGetThirdTransferResponseMock);
    })

    it('should builder Created Confirmation TTC', () => {
      service.builderCreatedConfirmationTTC(iTTDCreateConfirmMockThird);
      expect(createManager.builderCreatedConfirmation).toHaveBeenCalledWith(iTTDCreateConfirmMockThird)
    })


    describe('UPDATE', () => {
      it('should build Update Account Layout TTU', () => {
        service.buildUpdateAccountLayoutTTU(iThirdTransfersAccountsMock);
        expect(updateManager.buildUpdateAccountLayout).toHaveBeenCalledWith(iThirdTransfersAccountsMock)
      })

      it('should build Update Alert TTU', () => {
        service.buildUpdateAlertTTU();
        expect(updateManager.buildUpdateAlert).toHaveBeenCalled()
      })

      it('should builder Update Confirmation TTU', () => {
        service.builderUpdateConfirmationTTU(iTTDUpdateConfirmMockThird)
        expect(updateManager.builderUpdateConfirmation).toHaveBeenCalledWith(iTTDUpdateConfirmMockThird)
      })

    })

    describe('DELETE', () => {
      it('should builder Delete Confirmation TTD', () => {
        service.builderDeleteConfirmationTTD(iTTDDeleteConfirmMock);
        expect(deleteManager.buildDeleteAccountLayout).toHaveBeenCalledWith(iTTDDeleteConfirmMock)
      })
    })

  })
})
