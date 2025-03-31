import {TestBed} from '@angular/core/testing';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TpldTableThirdService} from './tpld-table-third.service';

describe('TpldTableThirdService', () => {
  let service: TpldTableThirdService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      providers: [],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
    });

    service = TestBed.inject(TpldTableThirdService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should build Third Loan Table Layout', () => {
    const res = service.buildThirdLoanTableLayout([]);
    expect(res.title).toEqual('loans_third_parties');
    expect(res.headers).toHaveSize(4);
    expect(res.options).toBeDefined()
  });
});
