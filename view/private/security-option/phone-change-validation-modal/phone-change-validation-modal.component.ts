import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, Validators, FormControl } from '@angular/forms';

import { MaskOptionsBuilder } from '@adf/components';
import { SecurityOptionService } from 'src/app/service/private/security-option/security-option.service';
import { phoneValidationCode } from 'src/app/models/security-option-modal';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'byte-phone-change-validation-modal',
  templateUrl: './phone-change-validation-modal.component.html',
  styleUrls: ['./phone-change-validation-modal.component.scss']
})
export class PhoneChangeValidationModalComponent implements OnInit {

  @Input()
  areaCode!: string;

  phoneChangeForm!: FormGroup;
  maxlength = phoneValidationCode.maxLength;
  showConfirmation: boolean = false;
  responseCode!: string;
  phone: string = '';
  errorMessage!: string;
  typeAlert;
  showAlert: boolean = false;
  loading: boolean = false;

  get codeControl(){
    return this.phoneChangeForm.controls['code'] as FormControl;
  }

  regexImask = new MaskOptionsBuilder()
    .mask({
      mask: /^\w{0,10}$/
    }).build()

  constructor(
    public activeModal: NgbActiveModal,
    private securityOptionService: SecurityOptionService

  ) { }

  ngOnInit(): void {
    this.phone = this.securityOptionService.getPhone;

    this.phoneChangeForm = new FormGroup({
      code: new FormControl('', [Validators.required, Validators.maxLength(phoneValidationCode.maxLength),
      Validators.minLength(phoneValidationCode.minLength)])
    });
  }

  errorToShow(error): string {

    if (error.required) {

      return 'required';
    } else if (error.minlength) {

      return 'so_error_minLength';
    } else if (error.maxlength) {

      return 'so_error_maxLength';
    }
    return 'unknown';
  }

  sendCode() {

    if (!this.showConfirmation) {
      this.loading = true;
      if (this.phoneChangeForm.valid) {
        this.handleValidateAffiliation();
      } else {
        this.loading = false;
        this.phoneChangeForm.markAllAsTouched();
      }
    } else {
      this.activeModal.close(this.responseCode);
    }
  }

  handleValidateAffiliation() {
    this.securityOptionService.validateAffiliation(this.phoneChangeForm.controls['code'].value, this.areaCode)
      .subscribe({
        next: () => {
          this.loading = false;
          this.showConfirmation = true;
          this.responseCode = "0";
        },
        error: (error: HttpErrorResponse) => {
          this.loading = false;
          this.showConfirmation = true;
          this.responseCode = error.error.code;
          this.errorMessage = error.error.message;
        }
      });
  }

  setAlert(type: string, message: string) {
    this.showAlert = true;
    this.typeAlert = type;
    this.errorMessage = message;
  }
}
