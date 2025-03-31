import {TestBed} from '@angular/core/testing';

import {PmpdTableService} from './pmpd-table.service';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from "@angular/core";
import {PmpUploadComponent} from "../../../components/load/pmp-upload/pmp-upload.component";
import {iloadParticipantMock} from "../../../../../../../assets/mocks/modules/payroll/payroll.mock";
import {Participant} from "../../../interfaces/pmp-payment-home.interface";

describe('SppdTableService', () => {
  let service: PmpdTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ PmpUploadComponent],
      imports : [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    });
    service = TestBed.inject(PmpdTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should buildTable', () => {
    const req = service.buildTable([iloadParticipantMock as Participant]);
    expect(req).toBeDefined()
  })

});
