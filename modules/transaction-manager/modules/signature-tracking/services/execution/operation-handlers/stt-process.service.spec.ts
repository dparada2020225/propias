import {TestBed} from '@angular/core/testing';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {SttProcessService} from './stt-process.service';
import {UtilService} from "../../../../../../../service/common/util.service";
import {StProcessHandlerService} from "../utils/st-process-handler.service";
import {UtilTransactionService} from "../../../../../../../service/common/util-transaction.service";
import {StCommonTransactionService} from "../st-common-transaction.service";

describe('SttProcessService', () => {
  let service: SttProcessService;

  let utils: jasmine.SpyObj<UtilService>;
  let stProcessHandler: jasmine.SpyObj<StProcessHandlerService>;
  let utilsTransaction: jasmine.SpyObj<UtilTransactionService>;
  let stCommonTransaction: jasmine.SpyObj<StCommonTransactionService>;

  beforeEach(() => {
    const utilsSpy = jasmine.createSpyObj('UtilService', ['hideLoader', 'showLoader'])
    const stProcessHandlerSpy = jasmine.createSpyObj('StProcessHandlerService', ['processTransactionWithoutToken', 'processTransactionWithToken'])
    const utilsTransactionSpy = jasmine.createSpyObj('UtilTransactionService', ['handleResponseTransaction', 'handleErrorTransaction'])
    const stCommonTransactionSpy = jasmine.createSpyObj('StCommonTransactionService', ['handleResponseProcessOperation'])

    TestBed.configureTestingModule({
      declarations: [],
      providers: [
        { provide: UtilService, useValue: utilsSpy },
        { provide: StProcessHandlerService, useValue: stProcessHandlerSpy },
        { provide: UtilTransactionService, useValue: utilsTransactionSpy },
        { provide: StCommonTransactionService, useValue: stCommonTransactionSpy },
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

    service = TestBed.inject(SttProcessService);
    utils = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
    stProcessHandler = TestBed.inject(StProcessHandlerService) as jasmine.SpyObj<StProcessHandlerService>;
    utilsTransaction = TestBed.inject(UtilTransactionService) as jasmine.SpyObj<UtilTransactionService>;
    stCommonTransaction = TestBed.inject(StCommonTransactionService) as jasmine.SpyObj<StCommonTransactionService>;

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

});
