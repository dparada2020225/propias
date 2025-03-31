import { StorageService } from '@adf/security';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { Profile } from 'src/app/models/security-option-modal';
import { CheckProfileService } from 'src/app/service/general/check-profile.service';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { SecurityOptionService } from 'src/app/service/private/security-option/security-option.service';
import { environment } from 'src/environments/environment';
import { PostponeModalComponent } from "./postpone-modal/postpone-modal.component";
import { SecurityOptionModalComponent } from './security-option-modal/security-option-modal.component';
import { finalize } from 'rxjs/operators';
import { FeatureManagerService } from 'src/app/service/common/feature-manager.service';
import { AdfAlertModalComponent } from '@adf/components';
import { ModalDefinitionService } from '../security-option/update-data/services/modal-definition.service';
import { ModalTokenComponent } from '../token/modal-token/modal-token.component';
import { UtilService } from 'src/app/service/common/util.service';
import { ERequestTypeTransaction } from 'src/app/enums/transaction-header.enum';
import { IResponseExpirationDate } from '../security-option/update-data/enum/update-data-status.interfaces';


@Component({
  selector: 'byte-routing-security-option',
  templateUrl: './routing-security-option.component.html',
  styleUrls: ['./routing-security-option.component.scss']
})
export class RoutingSecurityOptionComponent implements OnInit {

  recordNavigation;
  profile!: Profile;
  profileResponse;
  home: string = environment.home;
  descriptionModal!: string;
  validateUserService;
  theme = environment['profile'] || 'byte-theme';
  modalRef;
  code!: any;
  responseService!: IResponseExpirationDate;

  constructor(
    private modalService: NgbModal,
    protected route: ActivatedRoute,
    private router: Router,
    private securityOptionService: SecurityOptionService,
    private checkProfileService: CheckProfileService,
    private parameterManagemen: ParameterManagementService,
    private spinner: NgxSpinnerService,
    private storage: StorageService,
    private featureManagerService: FeatureManagerService,
    private modalDefinitionService: ModalDefinitionService,
    private utils: UtilService,
  ) { }

  ngOnInit() {

    this.profile = this.route.snapshot.data['routingSecurityOption']?.body;
    const infoUserProfile = JSON.parse(this.storage.getItem('userInformation'));


    const clientType = this.parameterManagemen.getParameter('clientType');
    if (clientType === 'N' && this.featureManagerService.updateDataAllow() && infoUserProfile.profile === "BIF") {
      this.openUpdateModal();
      return;
    }
    this.continueFlow();
  }

  openUpdateModal() {
    this.code = this.parameterManagemen.getParameter('codeInfo');

    if (this.code === '0') {
      this.continueFlow();
    } else {
      this.modalRef = this.modalService.open(AdfAlertModalComponent, {
        centered: true,
        windowClass: `custom-modal update-data-modal ${this.theme}`,
        size: 'lg',
        backdrop: 'static',
      });
      if (this.code === '301') {
        this.hiddenSpinner()
        this.modalRef.componentInstance.data = this.modalDefinitionService.buildAlertToUpdateWhithLather();
      } else if (this.code === '302') {
        this.hiddenSpinner()
        this.modalRef.componentInstance.data = this.modalDefinitionService.buildAlertToUpdate();
      }else{
        this.modalRef.componentInstance.data = this.modalDefinitionService.buildErrorToUpdate();
        this.modalRef.result.then((isResult: boolean) => {
          if (!isResult) {
            this.router.navigate(['/home']);
            return;
          }
          this.router.navigate(['/login ']);

        });
        return;
      }
      this.modalRef.result.then((isResult: boolean) => {
        if (!isResult) {
          this.router.navigate(['/home']);
          return;
        }
        this.openTokenModal();
      });
    }
  }

  openTokenModal() {
    this.modalRef = this.modalService.open(ModalTokenComponent, {
      centered: true,
      windowClass: `${environment.profile || 'byte-theme'} sm-600`,
      backdrop: 'static',
      size: 'lg',
    });

    this.modalRef.componentInstance.tokenType = this.utils.getTokenType();
    this.modalRef.componentInstance.typeTransaction = ERequestTypeTransaction.AUTHENTICATION;

    this.modalRef.dismissed.subscribe((a) => {
      return;
    });

    this.modalRef.result
      .then((result) => {
        if (!result) {
          if (this.code === "301") {
            this.router.navigate(['/home']);
          }else if(this.code === "302"){
            this.router.navigate(['/logout']);
          }else{
            this.router.navigate(['/logout']);
          }
          return;

        }

      this.router.navigate(['/update-data']);
    }).catch(error => error);
  }


  /*
* Method to remove @requireSecurityProfile from storage, when user has completed validations to access to
* home private. Without this one to user login Guard redirect to login. then access to home private.
* */
  handleRemoveSecurityParameter() {
    this.storage.removeItem('requireSecurityProfile');
  }


  open() {
    this.checkProfileService.validateUser()
      .pipe(finalize(() => this.spinner.hide('main-spinner')))
      .subscribe({
      next: (result) => {
      this.validateUserService = result.postponeTimes;
      if (this.validateUserService <= 0) {
        this.storage.addItem('requireSecurityProfile', 'true');
        this.modalRef = this.modalService.open(PostponeModalComponent,
          {
            centered: true, windowClass: `custom-modal ${this.theme}`, size: 'lg',
          });
      } else {
        this.modalRef = this.modalService.open(SecurityOptionModalComponent,
          {
            centered: true, windowClass: `custom-modal ${this.theme}`, size: 'lg',
          });
      }
    },
      error: (err) => {
        this.modalRef = this.modalService.open(SecurityOptionModalComponent,
          {
            centered: true, windowClass: `custom-modal ${this.theme}`, size: 'lg',
          });
      }
    });
  }

  continueFlow() {
    if (this.profile?.status === 'P' || this.profile?.error) {
      this.securityOptionService.setProfile(this.profile);
      this.open();
    } else {
      let parameters = { product: undefined };
      this.parameterManagemen.sendParameters(parameters);
      this.handleRemoveSecurityParameter();
      this.router.navigate(['/' + this.home]).finally(() => {});
    }
  }

  private hiddenSpinner() {
    this.spinner.hide('main-spinner');
  }

}
