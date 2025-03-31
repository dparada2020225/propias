import {TestBed} from '@angular/core/testing';

import {PmpmdFormService} from './pmpmd-form.service';
import {UtilService} from "../../../../../../../service/common/util.service";
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {iSPLDFormParametersMock} from "../../../../../../../../assets/mocks/modules/payroll/payroll.mock";

describe('SpplmdFormService', () => {
  let service: PmpmdFormService;
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
      ]
    });
    service = TestBed.inject(PmpmdFormService);
    utils = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should build form', () => {

    utils.getAmountMask.and.returnValue(
      {
        mask: `USD num`,
        blocks: {
          num: {
            mask: Number,
            thousandsSeparator: ',',
            scale: 2,
            signed: false,
            radix: '.',
            padFractionalZeros: true,
            min: 1,
            max: 99999999999.99,
          },
        },
      }
    )

    const req = service.buildForm(iSPLDFormParametersMock);

    expect(req.title).toEqual(iSPLDFormParametersMock.title);
    expect(req.subtitle).toEqual(iSPLDFormParametersMock.subtitle);
    expect(req.attributes).toHaveSize(3)
  })

});
