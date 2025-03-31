import {TestBed} from '@angular/core/testing';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TTDUpdateManagerService} from './ttd-update-manager.service';
import {TTDUpdateFormService} from '../personalization/update/ttd-update-banpais-form.service';
import {TtdUpdateBisvFormService} from '../personalization/update/ttd-update-bisv-form.service';
import {UtilWorkFlowService} from 'src/app/service/common/util-work-flow.service';
import {TtdUpdateBisvConfirmService} from '../personalization/update/ttd-update-bisv-confirm.service';
import {TTDUpdateConfirmService} from '../personalization/update/ttd-update-banpais-confirm.service';
import {
  iThirdTransfersAccountsMock,
  iTTDUpdateConfirmMockThird
} from 'src/assets/mocks/modules/transfer/service/third-transfer/thisrd.data.mock';
import {EProfile} from 'src/app/enums/profile.enum';

describe('TTDUpdateManagerService', () => {
  let service: TTDUpdateManagerService;

  let updateForm: jasmine.SpyObj<TTDUpdateFormService>;
  let updateBisvForm: jasmine.SpyObj<TtdUpdateBisvFormService>;
  let updateConfirm: jasmine.SpyObj<TTDUpdateConfirmService>;
  let updateBisvConfirm: jasmine.SpyObj<TtdUpdateBisvConfirmService>;
  let utilWorkFlow: jasmine.SpyObj<UtilWorkFlowService>;

  beforeEach(() => {

    const updateFormSpy = jasmine.createSpyObj('TTDUpdateFormService', ['buildUpdateAccountLayout'])
    const updateBisvFormSpy = jasmine.createSpyObj('TtdUpdateBisvFormService', ['buildUpdateAccountLayout'])
    const updateConfirmSpy = jasmine.createSpyObj('TTDUpdateConfirmService', ['builderUpdateConfirmation'])
    const updateBisvConfirmSpy = jasmine.createSpyObj('TtdUpdateBisvConfirmService', ['builderUpdateConfirmation'])
    const utilWorkFlowSpy = jasmine.createSpyObj('UtilWorkFlowService', ['buildAlertToUpdate'])

    TestBed.configureTestingModule({
      declarations: [],
      providers: [
        {provide: TTDUpdateFormService, useValue: updateFormSpy},
        {provide: TtdUpdateBisvFormService, useValue: updateBisvFormSpy},
        {provide: TTDUpdateConfirmService, useValue: updateConfirmSpy},
        {provide: TtdUpdateBisvConfirmService, useValue: updateBisvConfirmSpy},
        {provide: UtilWorkFlowService, useValue: utilWorkFlowSpy},
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

    service = TestBed.inject(TTDUpdateManagerService);
    updateForm = TestBed.inject(TTDUpdateFormService) as jasmine.SpyObj<TTDUpdateFormService>;
    updateBisvForm = TestBed.inject(TtdUpdateBisvFormService) as jasmine.SpyObj<TtdUpdateBisvFormService>;
    updateConfirm = TestBed.inject(TTDUpdateConfirmService) as jasmine.SpyObj<TTDUpdateConfirmService>;
    updateBisvConfirm = TestBed.inject(TtdUpdateBisvConfirmService) as jasmine.SpyObj<TtdUpdateBisvConfirmService>;
    utilWorkFlow = TestBed.inject(UtilWorkFlowService) as jasmine.SpyObj<UtilWorkFlowService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should build Update Account Layout', () => {
    service.profile = EProfile.HONDURAS
    service.buildUpdateAccountLayout(iThirdTransfersAccountsMock)
    expect(updateForm.buildUpdateAccountLayout).toHaveBeenCalledWith(iThirdTransfersAccountsMock)

    service.profile = EProfile.SALVADOR
    service.buildUpdateAccountLayout(iThirdTransfersAccountsMock)
    expect(updateBisvForm.buildUpdateAccountLayout).toHaveBeenCalledWith(iThirdTransfersAccountsMock)

    service.profile = null as any
    service.buildUpdateAccountLayout(iThirdTransfersAccountsMock)
    expect(updateForm.buildUpdateAccountLayout).toHaveBeenCalledWith(iThirdTransfersAccountsMock)
  })

  it('should build Update Alert', () => {
    service.buildUpdateAlert();
    expect(utilWorkFlow.buildAlertToUpdate).toHaveBeenCalled();
  })

  it('should builder Update Confirmation', () => {
    service.profile = EProfile.HONDURAS
    service.builderUpdateConfirmation(iTTDUpdateConfirmMockThird)
    expect(updateConfirm.builderUpdateConfirmation).toHaveBeenCalledWith(iTTDUpdateConfirmMockThird)

    service.profile = EProfile.SALVADOR
    service.builderUpdateConfirmation(iTTDUpdateConfirmMockThird)
    expect(updateBisvConfirm.builderUpdateConfirmation).toHaveBeenCalledWith(iTTDUpdateConfirmMockThird)

    service.profile = null as any
    service.builderUpdateConfirmation(iTTDUpdateConfirmMockThird)
    expect(updateConfirm.builderUpdateConfirmation).toHaveBeenCalledWith(iTTDUpdateConfirmMockThird)
  })
});
