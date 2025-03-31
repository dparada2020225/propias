import {TestBed} from '@angular/core/testing';

import {ParsedFileUploadUtilService} from './parsed-file-upload-util.service';
import {TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService} from "@ngx-translate/core";

describe('ParsedFileUploadUtilService', () => {
  let service: ParsedFileUploadUtilService;
  let translate: jasmine.SpyObj<TranslateService>;

  beforeEach(() => {

    const translateSpy = jasmine.createSpyObj('TranslateService', ['instant'])

    TestBed.configureTestingModule({
      providers: [
        { provide: TranslateService, useValue: translateSpy },
      ],
      imports : [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ]
    });
    translate = TestBed.inject(TranslateService) as jasmine.SpyObj<TranslateService>;
    service = TestBed.inject(ParsedFileUploadUtilService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
