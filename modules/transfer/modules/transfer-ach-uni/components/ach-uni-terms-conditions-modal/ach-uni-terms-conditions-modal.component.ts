import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { Profile } from 'src/app/models/security-option-modal';
import { StyleManagementService } from 'src/app/service/common/style-management.service';
import { CheckProfileService } from 'src/app/service/general/check-profile.service';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { SecurityOptionService } from 'src/app/service/private/security-option/security-option.service';
import { environment } from 'src/environments/environment';
import { AchUniTransferProtectedNavigation, AchUniTransferUrlNavigationCollection } from '../../enums/ach-uni-navigation-parameter.enum';
import { UtilService } from 'src/app/service/common/util.service';


@Component({
  selector: 'byte-ach-uni-terms-conditions-modal',
  templateUrl: './ach-uni-terms-conditions-modal.component.html',
  styleUrls: ['./ach-uni-terms-conditions-modal.component.scss']
})
export class AchUniTermsConditionsModalComponent implements OnInit {

  descriptionError!: string;
  profile!: Profile;
  home: string = environment.home;
  showAlert: boolean = false;
  typeAlert: string = '';
  messageAlert: string = '';
  loading: boolean = false;

  @Input() hideTrans;


  constructor(
    public activeModal: NgbActiveModal,
    private spinner: NgxSpinnerService,
    private router: Router,
    private eRef: ElementRef,
    private checkProfileService: CheckProfileService,
    private parameterManagement: ParameterManagementService,
    private securityOptionService: SecurityOptionService,
    private styleManagement: StyleManagementService,
    private utils: UtilService,
  ) {
    this.hideTrans = false;
  }

  ngOnInit(): void {
    this.profile = this.securityOptionService.getProfile;

  if (this.profile?.error) {
    this.descriptionError = this.profile.error.message || this.profile.error.error;
  }
  }

  skip(value) {
    this.showAlert = false;
    this.loading = true;

    if (value === 1) {
      this.activeModal.close('Close click');// no acepta terminos y condiciones
    } else if (value === 2) {//si aceptar terminos y condiciones
      this.spinner.hide('main-spinner');
      this.activeModal.close('Close click');
      this.parameterManagement.sendParameters({
        navigateStateParameters: null,
        navigationProtectedParameter: AchUniTransferProtectedNavigation.TRANSACTION,
      });
      this.router.navigate([AchUniTransferUrlNavigationCollection.DEFAULT_TRANSACTION]).then(() => this.utils.hideLoader());
    } else {
      this.spinner.hide('main-spinner');
    }
  }

  openAler(type: string, message: any) {
    this.showAlert = true;
    this.typeAlert = type;
    this.messageAlert = message;
  }

  @HostListener('document:click', ['$event']) clickout(event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.checkProfileService
        .postponeRegisterProfile()
        .pipe(finalize(() => this.spinner.hide('main-spinner')))
        .subscribe({
          next: (data) => {
            // this.responseRegisterProfile();
          },
          error: (error: HttpErrorResponse) => {
            this.openAler('error', error?.error?.message);
          }
        });
    }
  }

  responseRegisterProfile() {
    this.activeModal.close('Close click');
    let parameters = { product: undefined };
    this.parameterManagement.sendParameters(parameters);
    this.router.navigate(['/' + this.home]);
  }

  corporateImageApplication(): boolean {
    return this.styleManagement.corporateImageApplication();
  }
}
