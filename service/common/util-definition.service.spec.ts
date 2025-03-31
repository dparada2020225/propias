import {TestBed} from '@angular/core/testing';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {IAttributePdf} from 'src/app/models/build.interface';
import {UtilDefinitionService} from './util-definition.service';

describe('UtilDefinitionService', () => {
  let service: UtilDefinitionService;

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

    service = TestBed.inject(UtilDefinitionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should build Data Pdf', () => {
    const data: IAttributePdf = {
      label: 'label',
      title: true,
      value: 'value',
      secondColumn: true,
    };

    expect(service.buildDataPdf(data)).toBeDefined();
  })


});
