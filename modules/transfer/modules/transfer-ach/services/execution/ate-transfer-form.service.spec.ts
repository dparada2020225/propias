import {TestBed} from '@angular/core/testing';

import {AdfFormBuilderService} from '@adf/components';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {UtilService} from 'src/app/service/common/util.service';
import {AttributeFormTransferAch} from '../../enum/ach-transfer-control-name.enum';
import {AtdTransferManagerService} from '../definition/transaction/atd-transfer-manager.service';
import {AteTransferFormService} from './ate-transfer-form.service';

describe('AteTransferFormService', () => {
  let service: AteTransferFormService;
  let util: jasmine.SpyObj<UtilService>;
  let transferDefinitionManager: jasmine.SpyObj<AtdTransferManagerService>;
  let adfFormBuilder: jasmine.SpyObj<AdfFormBuilderService>;
  let formBuilder: FormBuilder;
  let formGroup: FormGroup;

  beforeEach(() => {
    const utilSpy = jasmine.createSpyObj('UtilService', [
      'removeLayoutSelect',
      'getCurrencySymbolToIso',
      'getAmountMask',
      'getLabelProduct',
      'getLabelCurrency',
    ]);
    const transferDefinitionManagerSpy = jasmine.createSpyObj('AtdTransferManagerService', ['buildFormLayout', 'buildLayoutAttribute']);
    const adfFormBuilderSpy = jasmine.createSpyObj('AdfFormBuilderService', ['formDefinition']);

    TestBed.configureTestingModule({
      providers: [
        AteTransferFormService,
        { provide: UtilService, useValue: utilSpy },
        { provide: AtdTransferManagerService, useValue: transferDefinitionManagerSpy },
        { provide: AdfFormBuilderService, useValue: adfFormBuilderSpy },
      ],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
        ReactiveFormsModule,
        FormsModule,
      ],
    });
    service = TestBed.inject(AteTransferFormService);
    util = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
    transferDefinitionManager = TestBed.inject(AtdTransferManagerService) as jasmine.SpyObj<AtdTransferManagerService>;
    adfFormBuilder = TestBed.inject(AdfFormBuilderService) as jasmine.SpyObj<AdfFormBuilderService>;

    formBuilder = TestBed.inject(FormBuilder);

    formGroup = formBuilder.group({
      [AttributeFormTransferAch.ACCOUNT_DEBITED]: '',
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


});
