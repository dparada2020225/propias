import {TestBed} from '@angular/core/testing';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TtdDeleteManagerService} from './ttd-delete-manager.service';
import {TTDDeleteConfirmService} from '../personalization/delete/ttd-delete-banpais-confirm.service';
import {iTTDDeleteConfirmMock} from 'src/assets/mocks/modules/transfer/service/third-transfer/thisrd.data.mock';
import {EProfile} from 'src/app/enums/profile.enum';

describe('TtdDeleteManagerService', () => {
  let service: TtdDeleteManagerService;

  let deleteConfirm: jasmine.SpyObj<TTDDeleteConfirmService>;

  beforeEach(() => {

    const deleteConfirmSpy = jasmine.createSpyObj('TTDDeleteConfirmService', ['builderDeleteConfirmation'])

    TestBed.configureTestingModule({
      declarations: [],
      providers: [
        {provide: TTDDeleteConfirmService, useValue: deleteConfirmSpy},
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

    service = TestBed.inject(TtdDeleteManagerService);
    deleteConfirm = TestBed.inject(TTDDeleteConfirmService) as jasmine.SpyObj<TTDDeleteConfirmService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should build Delete Account Layout', () => {
    service['profile'] = EProfile.HONDURAS;
    service.buildDeleteAccountLayout(iTTDDeleteConfirmMock);
    expect(deleteConfirm.builderDeleteConfirmation).toHaveBeenCalledWith(iTTDDeleteConfirmMock)
  })
});
