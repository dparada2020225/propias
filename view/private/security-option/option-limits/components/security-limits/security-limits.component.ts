import { Component, OnInit } from '@angular/core';
import {
  ESPLimitsDateValues,
  ICurrentLimitsResponse,
  ISpSetLimitsRequestBody
} from '../../interfaces/sp-limits.interface';
import { finalize } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpStatusCode } from '../../../../../../enums/http-status-code.enum';
import { AdfAlertModalComponent, AdfFormatService, AdfFormBuilderService, ILayout } from '@adf/components';
import { environment } from '../../../../../../../environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  ParameterManagementService
} from '../../../../../../service/navegation-parameters/parameter-management.service';
import { SpdModalChangesService } from '../../services/definition/spd-modal-changes.service';
import { SpdFormLimitsService } from '../../services/definition/spd-form-limits.service';
import { SpLimitsTransactionService } from '../../services/transaction/sp-limits-transaction.service';
import { FormGroup } from '@angular/forms';
import { SpModalLastChangesComponent } from '../sp-modal-last-changes/sp-modal-last-changes.component';

@Component({
  selector: 'byte-security-limits',
  templateUrl: './security-limits.component.html',
  styleUrls: ['./security-limits.component.scss']
})
export class SecurityLimitsComponent implements OnInit {
  form!: FormGroup;
  formLayout!: ILayout;
  typeAlert: string = '';
  messageAlert: string = '';
  currentLimits: ICurrentLimitsResponse[] = []
  isDisabledNextButton = true;

  get customShow() {
    return this.typeAlert && this.messageAlert ? 'custom_show' : '';
  }

  constructor(
    private modalService: NgbModal,
    private modalChangesDefinition: SpdModalChangesService,
    private activatedRoute: ActivatedRoute,
    private adfFormBuilder: AdfFormBuilderService,
    private formDefinition: SpdFormLimitsService,
    private router: Router,
    private translate: TranslateService,
    private spinner: NgxSpinnerService,
    private adfFormat: AdfFormatService,
    private spLimits: SpLimitsTransactionService,
    private parameterManager: ParameterManagementService,

  ) {
  }

  ngOnInit(): void {
    this.initDefinition();
    this.formLayoutDefinition();
    this.hiddenSpinner();
  }

  initDefinition() {
    const lastModifiedResponse = this.activatedRoute.snapshot.data['currentLimits'];

    if (lastModifiedResponse?.hasOwnProperty('error')) {
      return;
    }

    if (lastModifiedResponse.length <= 0) { return; }

    this.currentLimits = lastModifiedResponse;
    const lastDateModified = this.getDate(this.currentLimits[0].dateLastUpdate);
    const lastHourModified = this.getHour(this.currentLimits[0].timeLastUpdate);

    if (lastHourModified === ESPLimitsDateValues.HOUR && lastDateModified === ESPLimitsDateValues.DATE) { return; }

    const txtBase = this.translate.instant('description:last_changeS_modified');
    const dateFormatted = this.adfFormat.getFormatDateTime(`${lastDateModified}${lastHourModified}`);
    const finalDate = dateFormatted.standard;
    const finalHour = dateFormatted.hour;
    const txt = `${txtBase} ${finalDate} ${finalHour}`;
    this.openModalLastChanges(txt);
  }

  getHour(hour: string) {
    if (hour.trim().length <= 0 || !hour) { return '000000'; }
    const finalHour = hour.trim();

    const nHour = finalHour.length <= 5 ? '0' + finalHour.substring(0, 1) : ('0' + finalHour.substring(0, 2)).slice(-2);
    const minutes = finalHour.length <= 5 ? ('0' + finalHour.substring(1, 3)).slice(-2) : ('0' + finalHour.substring(2, 4)).slice(-2);
    const seconds = finalHour.length <= 5 ? ('0' + finalHour.substring(3, 5)).slice(-2) : ('0' + finalHour.substring(4, 6)).slice(-2);

    return `${nHour}${minutes}${seconds}`;
  }

  getDate(date: string) {
    if (date.trim().length <= 0 || !date) { return '00000000'; }
    const finalDate = date.trim();

    const year = finalDate.substring(0, 4);
    const month = finalDate.substring(4, 6);
    const day = finalDate.substring(6, 8);

    return `${day}${month}${year}`;
  }

  formLayoutDefinition() {
    this.formLayout = this.formDefinition.builderFormDefinition();
    this.form = this.adfFormBuilder.formDefinition(this.formLayout.attributes);
    this.setDefaultValues();
    this.changeForm();
  }

  setDefaultValues() {
    if (this.currentLimits.length <= 0) { return; }

    this.form.patchValue({
      amount_per_transaction: this.currentLimits[0].transactionLimit,
      amount_max_daily: this.currentLimits[0].dailyLimit,
      amount_max_monthly: this.currentLimits[0].monthlyLimit,
    });
  }

  openModalLastChanges(message: string) {
    const modal = this.modalService.open(SpModalLastChangesComponent, {
      centered: true,
      windowClass: `${environment.profile || 'byte-theme'} alert-modal sp-last-modal`,
      size: `lg`,
    });

    modal.componentInstance.message = message;

    modal.result.then(result => {

    }).catch(error => error);
  }

  openModalSuccessModifyChanges() {
    const modal = this.modalService.open(AdfAlertModalComponent, {
      centered: true,
      windowClass: `${environment.profile || 'byte-theme'} alert-modal sp-success-modal`,
      size: `lg`,
    });

    modal.componentInstance.data = this.modalChangesDefinition.buildAlertSuccessModifiedChanges();

    modal.dismissed.subscribe(() => {
      this.back();
    })

    modal.result.then(result => {
      this.back();

    }).catch(error => error);
  }

  setConfigurationLimits() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const perTransactionValue = this.form.getRawValue()['amount_per_transaction'];
    const maxDailyValue = this.form.getRawValue()['amount_max_daily'];
    const maxMonthlyValue = this.form.getRawValue()['amount_max_monthly'];

    if (Number(perTransactionValue) > Number(maxDailyValue) || Number(maxDailyValue) > Number(maxMonthlyValue)) {
      const perTransactionError = Number(perTransactionValue) > Number(maxDailyValue);
      const monthlyTransactionError = Number(maxDailyValue) > Number(maxMonthlyValue);

      perTransactionError && this.showAlert('error', 'error:sp_monthly_error');
      monthlyTransactionError && this.showAlert('error', 'error:sp_daily_error');
      return;
    }

    if (Number(perTransactionValue) <= 0 || Number(maxDailyValue) <= 0 || Number(maxMonthlyValue) <= 0) {
      this.showAlert('warning', 'error:sp_zero_error');
      return;
    }

    this.setConfiguration();
  }

  setConfiguration() {
    this.showSpinner();
    const dataToSetLimits: ISpSetLimitsRequestBody = {
      transactionLimit: this.form.getRawValue()['amount_per_transaction'],
      dailyLimit: this.form.getRawValue()['amount_max_daily'],
      monthlyLimit: this.form.getRawValue()['amount_max_monthly'],
    }

    this.spLimits.setLimits(dataToSetLimits)
      .pipe(finalize(() => this.hiddenSpinner()))
      .subscribe({
        next: (response) => {
          this.openModalSuccessModifyChanges();
          this.hiddenAlert();
        },
        error: (error: HttpErrorResponse) => {
          if (error?.error?.code === HttpStatusCode.SIGNATURE_TRACKING) {
            this.showAlert('info', error?.error?.message);
            this.isDisabledNextButton = false;
            return;
          }
          this.showAlert('error', error?.error?.message ?? 'internal_server_error');
        }
      });
  }

  changeForm() {
    this.form.valueChanges.subscribe(() => {
      this.hiddenAlert();
    } );
  }

  back() {
    this.showSpinner();
    this.parameterManager.sendParameters({
      parameterStateNavigation: null,
    });

    this.router.navigate(['security-profile']).finally(() => this.hiddenSpinner());
  }

  showAlert(type: string, message: string) {
    this.typeAlert = type;
    this.messageAlert = message;
  }

  hiddenAlert() {
    this.typeAlert = '';
    this.messageAlert = '';
  }

  showSpinner() {
    this.spinner.show('main-spinner');
  }

  hiddenSpinner() {
    this.spinner.hide('main-spinner');
  }


}
