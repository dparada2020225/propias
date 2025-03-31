import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TranslateLoader } from '@ngx-translate/core';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { EProfile } from '../../enums/profile.enum';
import { environment } from '../../../environments/environment';

import enTranslation from '../../../assets/i18n/en.json';
import esTranslation from '../../../assets/i18n/es.json';

import esBIPATranslation from '../../../assets/i18n/es_bipa.json';
import enBIPATranslation from '../../../assets/i18n/en_bipa.json';

import esBPTranslation from '../../../assets/i18n/es_banpais.json';
import enBPTranslation from '../../../assets/i18n/en_banpais.json';

import esBISVTranslation from '../../../assets/i18n/es_bisv.json';
import enBISVTranslation from '../../../assets/i18n/en_bisv.json';

export class MultiTranslateHttpLoaderService implements TranslateLoader {

  constructor(
    private http: HttpClient,
    private resources: {
      prefix: string,
      suffix: string
    }[],
  ) { }

  public getTranslation(lang: string): Observable<any> {
    const headers = new HttpHeaders().set('Cache-Control', 'no-cache')

    const requests = this.resources.map((resource) => {
      const path = resource.prefix + lang + resource.suffix

      return this.http.get(path, { headers })
        .pipe(
          retry(3),
          catchError(() => {
            return of(null)
          })
        )
    })

    return forkJoin(requests).pipe(map((response: any[]) => {

      let i18n1 = response[0] || this.getGenericJsoFileTranslation(lang);
      let i18n2 = response[1] || this.getJsonFileByProfile(lang);

      return { ...i18n1, ...i18n2 };
    }));
  }

  private getGenericJsoFileTranslation(lang: string) {
    const translationMap = {
      es: esTranslation,
      en: enTranslation,
    };

    return translationMap[lang] ?? translationMap['es'];
  }

  private getJsonFileByProfile(lang: string) {
    const translationMap = {
      [EProfile.HONDURAS]: {
        es: esBPTranslation,
        en: enBPTranslation,
      },
      [EProfile.PANAMA]: {
        es: esBIPATranslation,
        en: enBIPATranslation,
      },
      [EProfile.SALVADOR]: {
        es: esBISVTranslation,
        en: enBISVTranslation,
      },
    };

    const translateProfileFIle = translationMap[environment.profile];

    return translateProfileFIle[lang] ?? translateProfileFIle['es'];
  }
}