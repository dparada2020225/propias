import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { UtilService } from 'src/app/service/common/util.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { AchUniTransferProtectedNavigation, AchUniTransferUrlNavigationCollection } from '../../enums/ach-uni-navigation-parameter.enum';
import { AchUniTransferService } from '../../services/transaction/ach-uni-transfer.service';
import { firstValueFrom } from 'rxjs';
import { AchUniStatusTermsResponse } from '../../interfaces/ach-uni-status-terms-response';
import { environment } from 'src/environments/environment';
import { E365UrlCollection } from '../../../transfer-365/enum/url-collection.enum';
import { EM365UrlCollection } from '../../../transfer-365-movil/enum/url-collection.enum';
import { TypesTransferACH } from '../../enums/type-transfer-ach.enum';
import { ServiceTypeStatusTermsConditions } from 'src/app/modules/transfer/enum/service-type-status-terms-conditions.enum';
import { HttpErrorResponse } from '@angular/common/http';
import { ET365TermCondition } from '../../../../../accounts-management/interfaces/terms-condition.interface';
import { T365RouteProtected } from '../../../transfer-365/enum/route-protected.enum';
import { PROTECTED_PARAMETER_ROUTE, PROTECTED_PARAMETER_STATE } from '../../../../../../enums/common-value.enum';
import { S365RouteProtected } from '../../../transfer-365-movil/enum/route-protected.enum';
@Component({
  selector: 'byte-ach-uni-home',
  templateUrl: './ach-uni-home.component.html',
  styleUrls: ['./ach-uni-home.component.scss'],
  animations: [
    trigger('inOut', [
      transition('void => *', [
        style({ opacity: 0 }), // initial styles
        animate(
          '500ms',
          style({ opacity: 1 }) // final style after the transition has finished
        ),
      ]),
      transition('* => void', [
        animate(
          '500ms',
          style({ opacity: 0 }) // we assume the initial style will always be opacity: 1
        ),
      ]),
    ]),
  ],
})
export class AchUniHomeComponent implements OnInit {

  typeAlert: string | null = null;
  messageAlert: string | null = null;
  modalRef;
  theme = environment.profile || 'byte-theme';
  cards = [
    {
      imageName: "assets/images/private/ach/SVG_BIES_WEB_TOB_T365_Logo.svg",
      title: "title-card-transfer-365",
      description: "desc-card-transfer-365",
      descriptionEnd:"sub-desc-card-transfer-365",
      typeTransferACH: TypesTransferACH.Transfer365
    },
    {
      imageName: "assets/images/private/ach/SVG_BIES_WEB_TOB_T365_Movil_Logo.svg",
      title: "title-card-transfer-365-movil",
      description: "desc-card-transfer-365-movil",
      descriptionEnd:"sub-desc-card-transfer-365",
      typeTransferACH: TypesTransferACH.Transfer365Movil
    },
    {
      imageName: "assets/images/logos/SVG_BIES_TOB_UNI_Logo.svg",
      title: "title-card-transfer-uni",
      description: "desc-card-transfer-uni",
      descriptionEnd:"",
      typeTransferACH: TypesTransferACH.UNI
    }
  ];

  constructor(
    public utils: UtilService,
    private router: Router,
    // private activatedRouter: ActivatedRoute,
    public persistStepStateService: ParameterManagementService,
    public achUniTransferService: AchUniTransferService,
    private modalService: NgbModal,
  ) {}

  ngOnInit(): void {
    this.persistStepStateService.sendParameters({
      navigateStateParameters: null,
      navigationProtectedParameter: null,
    });
    this.utils.hideLoader();
  }

  handleTransferClick(ev: string) {
    this.utils.showLoader();
    const value: string = ev;
    switch (value) {
      case 'Transfer365':
        this.persistStepStateService.sendParameters({
          serviceEmbedded: 'ach-transf',
          serviceType: 'SPM'
        });

        this.router.navigate(['/embedded-ob']).then(() => {});
        break;
      case 'Transfer365Movil':
        this.persistStepStateService.sendParameters({
          serviceEmbedded: 'ach-transf',
          serviceType: 'TRM'
        });

        this.router.navigate(['/embedded-ob']).then(() => {});
        break;
      case 'UNI':
        firstValueFrom(this.achUniTransferService.getStatusTermsConditions(ServiceTypeStatusTermsConditions.UNI, this.getClientCode()))
          .then((res: AchUniStatusTermsResponse) => {

            if (res.result === 'S' && res.errorCode === '0') {
              this.persistStepStateService.sendParameters({
                navigateStateParameters: null,
                navigationProtectedParameter: AchUniTransferProtectedNavigation.TRANSACTION,
                result: res
              });
              this.router.navigate([AchUniTransferUrlNavigationCollection.DEFAULT_TRANSACTION])
                .finally(() => this.utils.hideLoader());
            } else if(res.result === 'N' && res.errorCode === '0'){
              this.persistStepStateService.sendParameters({
                navigateStateParameters: null,
                navigationProtectedParameter: AchUniTransferProtectedNavigation.TERMS_CONDITIONS,
                result: res
              });
              this.router.navigate([AchUniTransferUrlNavigationCollection.TERMS_CONDITIONS])
                .finally(() => this.utils.hideLoader());
            }else{
              this.showAlert('error', res.errorDescription);
              this.utils.hideLoader();
            }
          })
          .catch((error) => {
            this.utils.hideLoader();
            this.showAlert('error', error?.error?.errorDescription ? error.error.errorDescription :  error.error.message);
          });

        break;
      default:
        console.error('Valor desconocido:', value);
    }
  }

  getClientCode(): string {
    return this.persistStepStateService.getParameter('userInfo')?.customerCode;
  }

  manageTermAndConditionFor365Transfer() {
    this.utils.showLoader();
    this.achUniTransferService.getStatusTermsConditions(ServiceTypeStatusTermsConditions.T365, this.getClientCode()).subscribe({
      next: (response) => {

        if (!response) {
          return;
        }

        if (response.result === ET365TermCondition.NOT) {
          this.persistStepStateService.sendParameters({
            [PROTECTED_PARAMETER_STATE]: null,
            [PROTECTED_PARAMETER_ROUTE]: T365RouteProtected.TERMS_CONDITION,
          });

          this.router.navigate([E365UrlCollection.TERMS_CONDITION]).finally(() => {});
          return;
        }

        this.persistStepStateService.sendParameters({
          [PROTECTED_PARAMETER_STATE]: null,
          [PROTECTED_PARAMETER_ROUTE]: T365RouteProtected.HOME,
        });

        this.router.navigate([E365UrlCollection.HOME]).finally(() => {});
      },
      error: (error: HttpErrorResponse) => {
        this.utils.hideLoader();
        this.utils.scrollToTop();
        this.showAlert('error', error?.error?.errorDescription ? error.error.errorDescription :  error.error.message);
      }
    });
  }

  manageTermAndConditionFor365TransferMovil() {
    this.utils.showLoader();
    this.achUniTransferService.getStatusTermsConditions(ServiceTypeStatusTermsConditions.M365, this.getClientCode()).subscribe({
      next: (response) => {

        if (!response) {
          return;
        }

        if (response.result === ET365TermCondition.NOT) {
          this.persistStepStateService.sendParameters({
            [PROTECTED_PARAMETER_STATE]: null,
            [PROTECTED_PARAMETER_ROUTE]: S365RouteProtected.TERMS_CONDITION,
          });

          this.router.navigate([EM365UrlCollection.TERMS_CONDITION]).finally(() => {});
          return;
        }

        this.persistStepStateService.sendParameters({
          [PROTECTED_PARAMETER_STATE]: null,
          [PROTECTED_PARAMETER_ROUTE]: S365RouteProtected.HOME,
        });

        this.router.navigate([EM365UrlCollection.HOME]).finally(() => {});
      },
      error: (error: HttpErrorResponse) => {
        this.utils.hideLoader();
        this.utils.scrollToTop();
        this.showAlert('error', error?.error?.errorDescription ? error.error.errorDescription :  error.error.message);
      }
    });
  }

  showAlert(type: string, message: string) {
    this.typeAlert = type;
    this.messageAlert = message;
  }

  lastStep() {
    this.router.navigate([AchUniTransferUrlNavigationCollection.HOME_APP]).then(() => {});
  }
}
