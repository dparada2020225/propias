import {TestBed} from '@angular/core/testing';

import {PmpldFormService} from './pmpld-form.service';
import {UtilService} from "../../../../../../../service/common/util.service";
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from "@angular/core";
import {iSPLDFormParametersMock} from "../../../../../../../../assets/mocks/modules/payroll/payroll.mock";

describe('SpplFormService', () => {
  let service: PmpldFormService;
  let utils: jasmine.SpyObj<UtilService>;

  beforeEach(() => {

    const utilsSpy = jasmine.createSpyObj('UtilService', ['getAmountMask'])


    TestBed.configureTestingModule({
      providers: [
        { provide: UtilService, useValue: utilsSpy },
      ],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    });
    service = TestBed.inject(PmpldFormService);
    utils = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should buildFormLayout', () => {
    const req = service.buildFormLayout(iSPLDFormParametersMock);
    expect(req.title).toEqual(iSPLDFormParametersMock.title)
    expect(req.subtitle).toEqual(iSPLDFormParametersMock.subtitle)
    expect(req.attributes).toHaveSize(4)
  })

  it('should buildUploadFormLayout', () => {
    const req = service.buildUploadFormLayout();
    expect(req.attributes).toHaveSize(1)
  })

});
