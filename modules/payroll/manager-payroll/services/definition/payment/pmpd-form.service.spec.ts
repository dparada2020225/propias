import {TestBed} from '@angular/core/testing';

import {PmpdFormService} from './pmpd-form.service';
import {AdfFormatService} from "@adf/components";
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {iSPPLDFormParametersMock} from "../../../../../../../assets/mocks/modules/payroll/payroll.mock";

describe('SppdFormService', () => {
  let service: PmpdFormService;
  let adfFormatService: jasmine.SpyObj<AdfFormatService>;

  beforeEach(() => {
    const adfFormatServiceSpy = jasmine.createSpyObj('AdfFormatService', ['getFormatDateTime', 'formatAmount'])

    TestBed.configureTestingModule({
      providers: [
        { provide: AdfFormatService, useValue: adfFormatServiceSpy },
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
    service = TestBed.inject(PmpdFormService);
    adfFormatService = TestBed.inject(AdfFormatService) as jasmine.SpyObj<AdfFormatService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should buildFormLayout', () => {
    adfFormatService.getFormatDateTime.and.returnValue({standard: '5421'} as any)
    const req = service.buildFormLayout(iSPPLDFormParametersMock);
    expect(req.title).toEqual(iSPPLDFormParametersMock.title)
    expect(req.subtitle).toEqual(iSPPLDFormParametersMock.subtitle);
    expect(req.attributes).toHaveSize(4);
  })

});
