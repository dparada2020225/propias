import {TestBed} from '@angular/core/testing';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TTDCreateManagerService} from './ttd-create-manager.service';
import {TTDCreateSeachService} from '../personalization/create/ttd-create-banpais-seach.service';
import {TtdCreateBisvSearchService} from '../personalization/create/ttd-create-bisv-search.service';
import {TTDCreateFormService} from '../personalization/create/ttd-create-banpais-form.service';
import {TtdCreateBisvFormService} from '../personalization/create/ttd-create-bisv-form.service';
import {TTDCreateConfirmService} from '../personalization/create/ttd-create-banpais-confirm.service';
import {TtdCreateBisvConfirmService} from '../personalization/create/ttd-create-bisv-confirm.service';
import {EProfile} from 'src/app/enums/profile.enum';
import {
  iGetThirdTransferResponseMock,
  iTTDCreateConfirmMockThird
} from 'src/assets/mocks/modules/transfer/service/third-transfer/thisrd.data.mock';

describe('TTDCreateManagerService', () => {
  let service: TTDCreateManagerService;

  let createSearch: jasmine.SpyObj<TTDCreateSeachService>;
  let createBisvSearch: jasmine.SpyObj<TtdCreateBisvSearchService>;

  let createForm: jasmine.SpyObj<TTDCreateFormService>;
  let createBisvForm: jasmine.SpyObj<TtdCreateBisvFormService>;

  let createConfirm: jasmine.SpyObj<TTDCreateConfirmService>;
  let createBisvConfirm: jasmine.SpyObj<TtdCreateBisvConfirmService>;


  beforeEach(() => {

    const createSearchSpy = jasmine.createSpyObj('TTDCreateSeachService', ['buildConsultingLayout'])
    const createBisvSearchSpy = jasmine.createSpyObj('TtdCreateBisvSearchService', ['buildConsultingLayout'])
    const createFormSpy = jasmine.createSpyObj('TTDCreateFormService', ['buildCreateAccountLayout'])
    const createBisvFormSpy = jasmine.createSpyObj('TtdCreateBisvFormService', ['buildCreateAccountLayout'])
    const createConfirmSpy = jasmine.createSpyObj('TTDCreateConfirmService', ['builderCreatedConfirmation'])
    const createBisvConfirmSpy = jasmine.createSpyObj('TtdCreateBisvConfirmService', ['builderCreatedConfirmation'])

    TestBed.configureTestingModule({
      providers: [
        {provide: TTDCreateSeachService, useValue: createSearchSpy},
        {provide: TtdCreateBisvSearchService, useValue: createBisvSearchSpy},
        {provide: TTDCreateFormService, useValue: createFormSpy},
        {provide: TtdCreateBisvFormService, useValue: createBisvFormSpy},
        {provide: TTDCreateConfirmService, useValue: createConfirmSpy},
        {provide: TtdCreateBisvConfirmService, useValue: createBisvConfirmSpy},

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

    service = TestBed.inject(TTDCreateManagerService);
    createSearch = TestBed.inject(TTDCreateSeachService) as jasmine.SpyObj<TTDCreateSeachService>;
    createBisvSearch = TestBed.inject(TtdCreateBisvSearchService) as jasmine.SpyObj<TtdCreateBisvSearchService>;
    createForm = TestBed.inject(TTDCreateFormService) as jasmine.SpyObj<TTDCreateFormService>;
    createBisvForm = TestBed.inject(TtdCreateBisvFormService) as jasmine.SpyObj<TtdCreateBisvFormService>;
    createConfirm = TestBed.inject(TTDCreateConfirmService) as jasmine.SpyObj<TTDCreateConfirmService>;
    createBisvConfirm = TestBed.inject(TtdCreateBisvConfirmService) as jasmine.SpyObj<TtdCreateBisvConfirmService>;

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should build Consulting Layout', () => {

    service.profile = EProfile.HONDURAS;

    service.buildConsultingLayout();
    expect(createSearch.buildConsultingLayout).toHaveBeenCalled();

    service.profile = EProfile.SALVADOR;

    service.buildConsultingLayout();
    expect(createBisvSearch.buildConsultingLayout).toHaveBeenCalled();

    service.profile = null as any

    service.buildConsultingLayout();
    expect(createSearch.buildConsultingLayout).toHaveBeenCalled();
  })

  it('should build Create Account Layout', () => {
    service.profile = EProfile.HONDURAS;

    service.buildCreateAccountLayout(iGetThirdTransferResponseMock);
    expect(createForm.buildCreateAccountLayout).toHaveBeenCalledWith(iGetThirdTransferResponseMock);

    service.profile = EProfile.SALVADOR;

    service.buildCreateAccountLayout(iGetThirdTransferResponseMock);
    expect(createBisvForm.buildCreateAccountLayout).toHaveBeenCalledWith(iGetThirdTransferResponseMock);

    service.profile = null as any;

    service.buildCreateAccountLayout(iGetThirdTransferResponseMock);
    expect(createForm.buildCreateAccountLayout).toHaveBeenCalledWith(iGetThirdTransferResponseMock);
  })

  it('should builder Created Confirmation', () => {
    service.profile = EProfile.HONDURAS;

    service.builderCreatedConfirmation(iTTDCreateConfirmMockThird);
    expect(createConfirm.builderCreatedConfirmation).toHaveBeenCalledWith(iTTDCreateConfirmMockThird);

    service.profile = EProfile.SALVADOR;

    service.builderCreatedConfirmation(iTTDCreateConfirmMockThird);
    expect(createBisvConfirm.builderCreatedConfirmation).toHaveBeenCalledWith(iTTDCreateConfirmMockThird);

    service.profile = null as any;

    service.builderCreatedConfirmation(iTTDCreateConfirmMockThird);
    expect(createConfirm.builderCreatedConfirmation).toHaveBeenCalledWith(iTTDCreateConfirmMockThird);
  })

});
