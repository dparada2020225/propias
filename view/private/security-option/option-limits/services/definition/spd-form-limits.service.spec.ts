import { TestBed } from '@angular/core/testing';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { SpdFormLimitsService } from './spd-form-limits.service';

describe('SpdFormLimitsService', () => {
  let service: SpdFormLimitsService;

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

    service = TestBed.inject(SpdFormLimitsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should builder Form Definition', () => {
    const res = service.builderFormDefinition();
    expect(res.attributes).toHaveSize(3)
  })

});
