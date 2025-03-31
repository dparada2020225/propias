import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { EProfile } from 'src/app/enums/profile.enum';
import { environment } from 'src/environments/environment';
import { MultiTranslateHttpLoaderService } from './multi-translate-http-loader.service';

describe('MultiTranslateHttpLoaderService', () => {
  let service: MultiTranslateHttpLoaderService;
  let http: HttpClient;
  let httpController: HttpTestingController;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    http = TestBed.inject(HttpClient);
    httpController = TestBed.inject(HttpTestingController);

    service = new MultiTranslateHttpLoaderService(http as any, [
      { prefix: '../../assets/i18n/', suffix: '.json' },
    ]);
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return translations for a given language', fakeAsync(() => {
    environment.profile = EProfile.PANAMA
    const lang = 'es';
    const dataMock = 'test'


    service.getTranslation(lang).subscribe({
      next: (data) => {
        expect(data['cm-cheques']).toEqual('Cuenta Corriente')
        tick(3000)
      }
    })

    const url = '../../assets/i18n/es.json';
    const req = httpController.expectOne(url);
    req.flush(dataMock)
    httpController.verify();
  }));

  it('should return translations for a given language en', fakeAsync(() => {
    environment.profile = EProfile.PANAMA
    const lang = 'en';
    const dataMock = 'test'


    service.getTranslation(lang).subscribe({
      next: (data) => {
        expect(data['cm-cheques']).toEqual('Account Current')
        tick(3000)
      }
    })

    const url = '../../assets/i18n/en.json';
    const req = httpController.expectOne(url);
    req.flush(dataMock)
    httpController.verify();
  }));

});
