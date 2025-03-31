import {TestBed} from '@angular/core/testing';

import {PmpldTableService} from './pmpld-table.service';
import {TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService} from "@ngx-translate/core";
import {SPPMTableKeys} from "../../../../interfaces/sppd-manually.interface";

describe('SppldTableService', () => {
  let service: PmpldTableService;
  let translateService: jasmine.SpyObj<TranslateService>;


  beforeEach(() => {

    const translateServiceSpy = jasmine.createSpyObj('TranslateService', ['instant'])

    TestBed.configureTestingModule({
      providers: [
        { provide: TranslateService, useValue: translateServiceSpy },
      ],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ]
    });
    service = TestBed.inject(PmpldTableService);
    translateService = TestBed.inject(TranslateService) as jasmine.SpyObj<TranslateService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should tableLoadManuallyHeaders', () => {

    const req = service.tableLoadManuallyHeaders();
    expect(req).toEqual([
      {
        name: SPPMTableKeys.IS_CHECKED,
        label: '',
        icon: 'sprint2-icon-trash',
        action: 'action:delete'
      },
      {
        name: SPPMTableKeys.ACCOUNT,
        label: 'account',
        icon: '',
        action: ''
      },
      {
        name: SPPMTableKeys.NAME,
        label: 'label.home.name',
        icon: '',
        action: ''
      },
      {
        name: SPPMTableKeys.AMOUNT_PARSED,
        label: 'label.statements.amount',
        icon: '',
        action: ''
      },
      {
        name: SPPMTableKeys.EMAIL,
        label: 'payroll:email_example',
        icon: '',
        action: ''
      }
    ])

  })

  it('should buildExcelFieldTable', () => {
    const req = service.buildExcelFieldTable();
    expect(req).toBeDefined()
  })

  it('should buildCsvFieldTable', () => {
    const req = service.buildCsvFieldTable();
    expect(req).toBeDefined()
  })

});
