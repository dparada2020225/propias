import { StorageService } from '@adf/security';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, ElementRef } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from '../environments/environment';
import { EProfile } from './enums/profile.enum';
import { EVersionHandler } from './enums/version-handler.enum';
import { StyleManagementService } from './service/common/style-management.service';
import { UtilService } from './service/common/util.service';
import { BrowserInfoService } from './service/general/browser-info.service';

@Component({
  selector: 'byte-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  block: boolean = false;
  favIcon: HTMLLinkElement = document.querySelector('#appIcon') ?? new HTMLLinkElement();
  theme: string | undefined;
  languageCode = localStorage.getItem('code') ?? 'es';
  profile: string = environment.profile;
  gif = this.util.getLoaderSimple();

  constructor(
    private overlayContainer: OverlayContainer,
    private spinner: NgxSpinnerService,
    private styleManagement: StyleManagementService,
    private storage: StorageService,
    private titlePage: Title,
    private translate: TranslateService,
    private util: UtilService,
    private browserInfoService: BrowserInfoService,
    private _elementRef: ElementRef
  ) {
    if (!environment.isDevMode && this._elementRef?.nativeElement) {
      this._elementRef.nativeElement.removeAttribute('ng-version');
    }
    this.translate.setDefaultLang('es');
    this.translate.use(this.languageCode);

    this.setTitle(environment['profile']);

    this.favIcon.href = `assets/images/favicon/favicon_${environment['profile']}_${EVersionHandler.ASSETS}.png`;

    this.storage.removeItem('headerList');

    this.theme = environment['profile'] || 'byte';
    document.getElementsByTagName('body')[0].classList.add(`${this.theme}`);

    if (this.styleManagement.corporateImageApplication()) {
      document.getElementsByTagName('body')[0].classList.add('corporate-image');
    }

    overlayContainer.getContainerElement().classList.add(`${this.theme}`);

    const browserInfo = this.browserInfoService.getBrowserInfo();
    this.block = browserInfo.name === 'ie'; // ie
  }

  setTitle(theme: string) {
    if (theme === EProfile.HONDURAS) {
      this.titlePage.setTitle('BP en Línea');
    } else {
      this.titlePage.setTitle('Bi en Línea');
    }
  }
}
