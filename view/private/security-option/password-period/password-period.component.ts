import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { NgxSpinnerService } from 'ngx-spinner';
import { PasswordPeriod, Profile } from 'src/app/models/security-option-modal';
import { SecurityOptionService } from 'src/app/service/private/security-option/security-option.service';


@Component({
  selector: 'byte-password-period',
  templateUrl: './password-period.component.html',
  styleUrls: ['./password-period.component.scss']
})
export class PasswordPeriodComponent implements OnInit {

  @Input()
  configurationType!: number;

  @Input()
  passwordPeriod!: Array<PasswordPeriod>;

  @Input()
  profile!: Profile;

  @Output() changeTab: EventEmitter<string> = new EventEmitter<string>()

  @Output() newperiodCode:EventEmitter<{ [key: string]:string }> = new EventEmitter<{ [key: string]:string }>();

  periodCode;

  showAlert = false;
  typeAler!: string;
  messageAlert!: string;

  loading: boolean = false;

  constructor(
    private spinner: NgxSpinnerService,
    private securityOptionService: SecurityOptionService
  ) { }

  ngOnInit(): void {
    this.assignPeriod();
  }

  assignPeriod() {
    if (!this.passwordPeriod['error'] && this.passwordPeriod && this.passwordPeriod.length > 0) {

      if (this.profile && this.profile.changePeriod) {
        let period = Number(this.profile.changePeriod);
        if (this.profile.changePeriod === "0") {
          this.periodCode = this.passwordPeriod[0].code;
        } else {
          this.periodCode = period.toString();
        }
      } else {
        this.periodCode = this.passwordPeriod[0].code;
      }
    } else {
      this.setAlert('error', 'error.http.500');
    }
  }

  changePeriod(event) {
    this.spinner.show();
    this.securityOptionService.updatePassworPeriod(this.periodCode)
      .subscribe({
        next: () => {
          const newData = { 'periodChangePassword': this.periodCode };
          this.setAlert('success', 'period_successfully_saved');
          this.newperiodCode.emit(newData);
          if (this.configurationType === 1) {
            setTimeout(() => {
              this.changeTab.emit('personalInfo');
              this.spinner.hide();
            }, 2000);
          } else {
            this.spinner.hide();
          }
        },
        error: () => {
          this.spinner.hide();
          this.setAlert('error', 'so_transaction_not_sent');
        }
      });
  }

  setAlert(type: string, message: string) {
    this.showAlert = true;
    this.typeAler = type;
    this.messageAlert = message;
  }
}
