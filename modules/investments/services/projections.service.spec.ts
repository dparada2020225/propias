import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TokenizerAccountsService } from 'src/app/service/token/tokenizer-accounts.service';
import { ProjectionsService } from './projections.service';

describe('ProjectionsService', () => {
  let service: ProjectionsService;
  let tokenizerEncrypt: jasmine.SpyObj<TokenizerAccountsService>;
  let httpClient: HttpTestingController;

  beforeEach(() => {
    const tokenizerEncryptSpy = jasmine.createSpyObj('TokenizerAccountsService', ['tokenizer']);

    TestBed.configureTestingModule({
      declarations: [],
      providers: [{ provide: TokenizerAccountsService, useValue: tokenizerEncryptSpy }],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
        HttpClientTestingModule,
      ],
    });

    service = TestBed.inject(ProjectionsService);
    httpClient = TestBed.inject(HttpTestingController);
    tokenizerEncrypt = TestBed.inject(TokenizerAccountsService) as jasmine.SpyObj<TokenizerAccountsService>;
  });

  afterEach(() => {
    httpClient.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('test_single_section_single_element', () => {
    const information = {
      section1: {
        element1: 'value1',
      },
    };
    expect(service.buildInformationHelper(information)).toBeUndefined();
    //Esto por que no retorna nada, pero si lo ordenada
  });

  it('should get Data By Account', () => {
    const dto: string = '54654';
    const response: string = 'ok';

    tokenizerEncrypt.tokenizer.and.returnValue(dto);

    service.getDataByAccount(dto).subscribe({
      next(value) {
        expect(value).toEqual(response);
      },
    });

    const url: string = '/v1/inquiries/account-balance/fixed-term-movements';
    const req = httpClient.expectOne(url);
    req.flush(response);

    expect(req.request.body).toEqual({
      account: dto,
    });
  });
});
