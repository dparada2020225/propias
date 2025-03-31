import { Component, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';
import { finalize } from 'rxjs/operators';
import { Profile } from 'src/app/models/security-option-modal';
import { CheckProfileService } from 'src/app/service/general/check-profile.service';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { SecurityOptionService } from 'src/app/service/private/security-option/security-option.service';
import { StyleManagementService } from 'src/app/service/common/style-management.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'byte-security-option-modal',
  templateUrl: './security-option-modal.component.html',
  styleUrls: ['./security-option-modal.component.scss'],
})
export class SecurityOptionModalComponent implements OnInit {
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
    private parameterManagemen: ParameterManagementService,
    private securityOptionService: SecurityOptionService,
    private styleManagement: StyleManagementService
  ) {
    this.hideTrans = false;
  }

  ngOnInit(): void {
    this.profile = this.securityOptionService.getProfile;

    if (this.profile.error) {
      this.descriptionError = this.profile.error.message || this.profile.error.error;
    }
  }

  skip(value) {
    this.showAlert = false;
    this.spinner.show('main-spinner');
    this.loading = true;

    if (value === 1) {
      this.checkProfileService
        .postponeRegisterProfile()
        .pipe(finalize(() => this.spinner.hide('main-spinner')))
        .subscribe({
          next: (data) => {
            this.responseRegisterProfile();
          },
          error: (error: HttpErrorResponse) => {
            this.openAler('error', error?.error?.message);
          }
        });
    } else if (value === 2) {
      this.spinner.hide('main-spinner');
      this.activeModal.close('Close click');
      this.router.navigate(['/security-option']);
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
            this.responseRegisterProfile();
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
    this.parameterManagemen.sendParameters(parameters);
    this.router.navigate(['/' + this.home]);
  }

  corporateImageApplication(): boolean {
    return this.styleManagement.corporateImageApplication();
  }
}
