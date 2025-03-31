import { OperationBuilder, StorageService, TransactionBuilder } from '@adf/security';
import { AfterViewInit, Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Idle } from '@ng-idle/core';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { SmartCoreService } from 'src/app/service/common/smart-core.service';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { StepService } from 'src/app/service/private/step.service';
import { BusinessNameService } from 'src/app/service/shared/business-name.service';
import { MenuService } from 'src/app/service/shared/menu.service';
import { environment } from 'src/environments/environment';

import { ICheckpoint, ISettingData } from '../../../models/setting-interface';
import { ISignatoryEmbbededParams } from '../../../modules/transaction-manager/modules/signature-tracking/interfaces/signature-tracking.interface';


@Component({
  selector: 'byte-embedded-ob',
  templateUrl: './embedded-ob.component.html',
  styleUrls: ['./embedded-ob.component.scss']
})
export class EmbeddedObComponent implements OnInit, AfterViewInit, OnDestroy {

  safeUrl!: SafeResourceUrl;
  service!: string;
  signatoryParams: ISignatoryEmbbededParams | null = null;
  sourceAccount!: string;
  urlSafe!: SafeResourceUrl;
  private serviceSubscription!: Subscription;

  constructor(
    private sanitizer: DomSanitizer,
    private storage: StorageService,
    private menuService: MenuService,
    private spinner: NgxSpinnerService,
    private zone: NgZone,
    private businessName: BusinessNameService,
    private idle: Idle,
    private route: ActivatedRoute,
    private smartCore: SmartCoreService,
    private translate: TranslateService,
    private parameterManagementService: ParameterManagementService,
    private stepService: StepService,
  ) {

  }

  ngOnInit() {
    this.service = this.route.snapshot.data['service'] ?? this.parameterManagementService.getParameter('serviceEmbedded');
    this.signatoryParams = this.parameterManagementService.getParameter('signatoryParams')
    this.sourceAccount = this.businessName.accountNumber;

    const currentToken = this.storage.getItem('currentToken');
    if (currentToken) {
      const sessionToken = JSON.parse(currentToken)['sessionToken'];
      const sessionId = encodeURIComponent(JSON.parse(currentToken)['app_id']);
      if (!this.sourceAccount) {
        this.sourceAccount = '';
      }


      const serviceType = this.parameterManagementService.getParameter('serviceType');
      const stringServiceType = !serviceType ? '' : `&serviceType=${serviceType}`
      let url = `${environment.urlOnlineBankingLegacy}token=${sessionToken}&service=${this.service}&sourceAccount=${this.sourceAccount}&sessionId=${sessionId}${this.handleValidateSignatoryTrackingParams}${stringServiceType}`;
      if (environment.applyUrlEmbeddedPath) {
        url = `${window.location.origin}${url}`;
        url = url.replace(`/${environment.embeddedPath}`, '');
        url = url.replace(`..`, '');
      }

      this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      this.spinner.show('main-spinner');

      /**
       * Se añadió este bloque para quitar el spinner a los 3 segundos
       */
      //HU: Comentario
      setTimeout(() => {
        this.spinner.hide('main-spinner');
      }, 3000);

      const iframe = document.getElementById('frame');
      const handleLoad = () => {
        this.spinner.hide('main-spinner');
      };

      this.callSmartCore();
      iframe?.addEventListener('load', handleLoad, true);
    }
  }

  get handleValidateSignatoryTrackingParams() {
    let params: string = '';

    if (!this.signatoryParams || !this.signatoryParams.reference) {
      return params;
    }

    const { reference, currentTabPosition, action } = this.signatoryParams;

    params = `&trxID-seg=${reference}&current-step-seg=${currentTabPosition}&action-seg=${action}`

    return params;
  }


  ngAfterViewInit() {
    // get iframe by id 'frame' and add event on click
    const checkIframe = setInterval(() => {
      const iframe = document.getElementById('frame');
      if (iframe) {
        // @ts-ignore
        iframe.contentWindow.document.body.onclick = () => {
          this.zone.run(() => this.menuService.closeMenu(true));
          this.idle.watch();
        };
        clearInterval(checkIframe);
      }
    }, 3 * 1000);
  }

  callSmartCore() {
    let settings: ISettingData | undefined = undefined;

    if (this.storage.getItem('securityParameters')) {
      settings = JSON.parse(this.storage.getItem('securityParameters'));
    }

    const checkpointList: ICheckpoint[] = settings?.checkpointList ?? [] as ICheckpoint[];

    const checkpointListDecrypted: ICheckpoint[] = checkpointList.map(checkpoint => ({
      type: `${this.stepService.s(checkpoint?.type)}`,
      service: `${this.stepService.s(checkpoint?.service)}`,
      category: `${this.stepService.s(checkpoint?.category)}`,
    }));

    if (checkpointListDecrypted && checkpointListDecrypted.length > 0) {
      for (const element of checkpointListDecrypted) {
        if (element.service === this.service) {

          const transaction = new TransactionBuilder()
            .category(element.category)
            .type(element.type)
            .description(this.translate.instant(element.service))
            .build();

          const operation = new OperationBuilder()
            .transaction(transaction)
            .build();

          this.smartCore.personalizationOperation(operation);
        }
      }
    }
  }

  public ngOnDestroy(): void {
    if (this.serviceSubscription) {
      this.serviceSubscription.unsubscribe();
    }


    this.parameterManagementService.sendParameters({
      signatoryParams: null,
      serviceEmbedded: null,
    });
  }
}
