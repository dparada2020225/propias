import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import jsonTranslationsEn from '../../../assets/i18n/en.json';
import jsonTranslationsEs from '../../../assets/i18n/es.json';
import { EProfile } from '../../enums/profile.enum';
import { EVersionHandler } from '../../enums/version-handler.enum';
import { StyleManagementService } from './style-management.service';

@Injectable({
    providedIn: 'root'
})
export class LoaderBuilderService {

    profile: string = environment.profile || EProfile.HONDURAS;
    styleContainer = `display: flex; flex-direction: column; align-items: center;`;

    constructor(
        private translate: TranslateService,
        private styleManagement: StyleManagementService
    ) { }

    getLoader(message?: string): string {
        if(this.styleManagement.corporateImageApplication()){
            return this.newLoaderBuilder(message);
        }else{
            return this.oldLoaderBuilder();
        }
    }

    private oldLoaderBuilder(): string {
        const gifURL = `assets/images/gif/LoaderBR/Loader_${this.profile}_${EVersionHandler.ASSETS}.gif`;
        const gif = `<img src="${gifURL}"/>`;

        return gif;
    }

     private validateKey(key: string = 'loader_almost'): string {

      let codeLanguage: string | undefined | null = localStorage.getItem('code') ?? this.translate.getBrowserLang();

      const jsonTranslations = codeLanguage === 'es' ? jsonTranslationsEs : jsonTranslationsEn;
      const valueTranslation = jsonTranslations[key];

      const label = this.translate.instant(key);
      if(label !== key && label === valueTranslation) {
        return label;
      }

      if (!valueTranslation){
        return jsonTranslations['loader_almost'];
      }
      return valueTranslation;
    }

    newLoaderBuilder(message?: string): string {
      const imageUrl = `assets/images/gif/LoaderBR/Loader_${this.profile}_${EVersionHandler.ASSETS}.png`;
      const label = this.validateKey(message);
      const gifUrl = `assets/images/gif/LoaderBR/Loader_${this.profile}_${EVersionHandler.ASSETS}.gif`;
      const styleLoader = `
          <style>
              .image-loader{
                  margin-top: 65px;
              }
              .label-loader{
                  color: var(--label-color-login);
                  font: var(--font-family);
                  animation: 3s fade linear;
                  font-size: 27px;
                  padding-top: 45px;
                  font-weight: bold;
              }
              @keyframes fade {
                  from {
                    opacity: 0;
                  }
                  to {
                    opacity: 1;
                  }
              }
          </style>`;
      const loader = `
          <div style='${this.styleContainer}'>
              ${styleLoader}
              <img src="${imageUrl}">
              <div class='label-loader'>${label}</div>
              <img class='loader-index-gif' src="${gifUrl}"/>
          </div>`;
      return loader;
    }

    getLoaderSimple(): string {
        if(!this.styleManagement.corporateImageApplication()) return this.oldLoaderBuilder();
        const imageUrl = `assets/images/gif/LoaderBR/Loader_${this.profile}_${EVersionHandler.ASSETS}.png`;
        const gifUrl = `assets/images/gif/LoaderBR/Loader_${this.profile}_${EVersionHandler.ASSETS}.gif`;

        const styleLoader = `
        <style>
            .image-loader{
                margin-top: 65px;
            }

            .gif-loader{
                animation: 2s fade linear;
            }

            @keyframes fade {
                from {
                  opacity: 1;
                }

                to {
                  opacity: 0;
                }
            }
        </style>`;

        const loader = `
        <div style='${this.styleContainer}'>
            ${styleLoader}
            <img src="${imageUrl}">
            <img class='loader-index-gif gif-loader' src="${gifUrl}"/>
        </div>`;

        return loader;
    }
}
