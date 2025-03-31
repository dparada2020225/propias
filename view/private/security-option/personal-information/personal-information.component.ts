import { StorageService } from '@adf/security';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import internationalMarkingCodes from '../../../../../assets/data/international-marking-codes.json';
import {
  PhoneChangeValidationModalComponent
} from '../phone-change-validation-modal/phone-change-validation-modal.component';
import { MaskOptionsBuilder } from '@adf/components';
import { ISettingData } from 'src/app/models/setting-interface';
import { SecurityOptionService } from 'src/app/service/private/security-option/security-option.service';
import { environment } from 'src/environments/environment';
import { Option, PasswordPeriod, PhoneCompanies, Profile } from 'src/app/models/security-option-modal';
import { StyleManagementService } from 'src/app/service/common/style-management.service';
import { PostponeModalComponent } from '../../routing-security-option/postpone-modal/postpone-modal.component';
import { CheckProfileService } from 'src/app/service/general/check-profile.service';
import { HttpErrorResponse } from '@angular/common/http';
import { EProfile } from '../../../../enums/profile.enum';
import areaCodesBisv from '../../../../../assets/data/area-codes-bisv.json';

@Component({
  selector: 'byte-personal-information',
  templateUrl: './personal-information.component.html',
  styleUrls: ['./personal-information.component.scss']
})
export class PersonalInformationComponent implements OnInit {

  @Input()
  configurationType!: number;

  @Input()
  phoneCompanies!: Array<PhoneCompanies>;

  @Input()
  profile!: Profile;

  @Input()
  passwordPeriod!: Array<PasswordPeriod>;

  @Output() dataUpdate:EventEmitter<{ [key: string]:string }> = new EventEmitter<{ [key: string]:string }>();
  hnProfile:string = EProfile.HONDURAS
  deploymentProfile = environment.profile;
  home: string = environment.home;
  phoneSettings = environment.phoneSettings;
  adminProfiles = JSON.parse(this.storage.getItem('userInformation'));
  settingsData!: ISettingData;

  personalInformation!: FormGroup;
  optionList!: Array<Option>;
  placeholderPhone = this.phoneSettings.placeholderPhone;
  regexImask = new MaskOptionsBuilder()
    .mask(
      {
        mask: this.phoneSettings.regexPhone,
        lazy: false,
        placeholderChar: ' '
      })
    .build()


  imaskNumber = new MaskOptionsBuilder()
    .mask({
      mask: '00000000'
    })
    .build()

    regexImaskSV = new MaskOptionsBuilder()
    .mask(
      {
        mask: '00000000',
        lazy: false,
        placeholderChar: ' '
      })
    .build()


  imaskNumberSV = new MaskOptionsBuilder()
    .mask({
      mask: '000000000000000'
    })
    .build()

  oldPhone;
  oldCodeOperator;
  oldAreaCode;
  areaCode!: string;
  areaCodeSV!: string;

  internationalMarkingCodes = internationalMarkingCodes;
  areaCodesBisv = areaCodesBisv;
  areaCodeList!: Array<Option>;

  phone: string | undefined;
  phoneCompany!: string;
  mail!: string;
  sendSms: boolean = false;

  showAlert: boolean = false;
  typeAlert;
  messageAlert;
  phoneTemp: string | undefined;
  disable!: boolean;
  validateUserService;
  lenghtEmail = 50;
  regexSV = /^[0-589][0-9]{7}$/;

 
  periodCode;

    get areaCodeControl(){
      return this.personalInformation.controls['areaCode'] as FormControl;
    }

    get phoneControl(){
      return this.personalInformation.controls['phone'] as FormControl;
    }

    get phoneCompanyControl(){
      return this.personalInformation.controls['phoneCompany'] as FormControl;
    }

    get phoneCompanyInputControl(){
      return this.personalInformation.controls['phoneCompanyInput'] as FormControl;
    }

    get mailControl(){
      return this.personalInformation.controls['mail'] as FormControl;
    }

    get mailConfirmationControl(){
      return this.personalInformation.controls['mailConfirmation'] as FormControl;
    }

  constructor(
    private spinner: NgxSpinnerService,
    private checkProfileService: CheckProfileService,
    private securityOptionService: SecurityOptionService,
    private translate: TranslateService,
    private router: Router,
    private modalService: NgbModal,
    private storage: StorageService,
    private styleManagement: StyleManagementService

  ) { }

  ngOnInit(): void {
    this.settingsData = JSON.parse(this.storage.getItem('securityParameters'));
    this.optionList = new Array<Option>();

    if (this.profile.phone) {
      this.oldPhone = this.profile.phone;
    }

    if (this.profile.codeOperator) {
      this.oldCodeOperator = this.profile.codeOperator;
    }

    if (this.profile.codeArea) {
      this.oldAreaCode = this.profile.codeArea;
    }


    const codeOperator = this.profile.codeOperator ? this.profile.codeOperator : '';

    if (this.deploymentProfile === EProfile.PANAMA) {
      this.buildFormForBIPAProfile(codeOperator);
    }else if (this.deploymentProfile === EProfile.SALVADOR) {
      this.buildFormForBISVProfile(codeOperator);
    } else {
      this.buildFormForOthersProfiles(codeOperator);
    }

    this.assignmentValues();
    this.confLenghtEmail();
  }

  buildFormForBIPAProfile(codeOperator: string) {
    this.assignmentCode();

    if (this.phone) {
      let phoneTmp = (this.phone.trim() as any).replaceAll('0', '');
      if (phoneTmp.length === 0) {
        this.phone = undefined;
      }
    }

    this.phoneTemp = this.phone;
    this.personalInformation = new FormGroup({
      areaCode: new FormControl(this.areaCode ? this.areaCode : '', [Validators.required]),
      phone: new FormControl(this.phone, [Validators.required]),
      phoneCompany: new FormControl(codeOperator, [Validators.required]),
      phoneCompanyInput: new FormControl(codeOperator, [Validators.required]),
      mail: new FormControl(this.profile.email, [Validators.required, Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)]),
      mailConfirmation: new FormControl(this.profile.email, [Validators.required, Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)])
    });
  }

  buildFormForBISVProfile(codeOperator: string) {
    this.assignmentCodeBISV();
    if (this.profile.phone) {
      let phoneTmp = (this.profile.phone.trim() as any).replaceAll('0', '');
      if (phoneTmp.length === 0) {
        this.profile.phone = undefined;
      }
    }
    this.phoneTemp = this.profile.phone; 
    this.personalInformation = new FormGroup({
      areaCode: new FormControl(this.profile.codeArea ? this.profile.codeArea : this.areaCodeList[0].value, [Validators.required]),
      phone: new FormControl(this.profile.phone, [Validators.required]),
      phoneCompany: new FormControl(codeOperator, [Validators.required]),
      mail: new FormControl(this.profile.email, [Validators.required, Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)]),
      mailConfirmation: new FormControl(this.profile.email, [Validators.required])
    });
    this.selectedAreaCode(this.profile.codeArea)
  }

  buildFormForOthersProfiles(codeOperator: string) {
    if (this.profile.phone) {
      let phoneTmp = (this.profile.phone.trim() as any).replaceAll('0', '');
      if (phoneTmp.length === 0) {
        this.profile.phone = undefined;
      }
    }

    this.phoneTemp = this.profile.phone;
    this.personalInformation = new FormGroup({
      phone: new FormControl(this.profile.phone, [Validators.required]),
      phoneCompany: new FormControl(codeOperator, [Validators.required]),
      mail: new FormControl(this.profile.email, [Validators.required, Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)]),
      mailConfirmation: new FormControl(this.profile.email, [Validators.required])
    });
  }

  corporateImageApplication(): boolean{
    return  this.styleManagement.corporateImageApplication();
  }

  assignmentCode() {
    this.areaCodeList = new Array<Option>();

    if (this.oldPhone && this.oldPhone.indexOf('+50') === 0) {
      this.areaCode = this.oldPhone.substr(0, 4);
      this.phone = this.oldPhone.substr(4, 15);
    } else {
      this.phone = this.oldPhone;
    }

    if (!this.areaCode) {
      let option: Option = new Option();
      option.value = '';
      option.name = this.translate.instant('so_select_code');

      this.areaCodeList.push(option);
    }

    if (this.internationalMarkingCodes && this.internationalMarkingCodes.length > 0) {
      for (const internationalMarkingCode of this.internationalMarkingCodes) {
        let option: Option = new Option();
        option.value = internationalMarkingCode.value;
        option.name = internationalMarkingCode.value + ' - ' + internationalMarkingCode.acronym;
        this.areaCodeList.push(option);
      }
    }
  }

  assignmentCodeBISV() {
    this.areaCodeList = new Array<Option>();
    if (this.areaCodesBisv && this.areaCodesBisv.length > 0) {
      for (const areaCodeBisv of this.areaCodesBisv) {
        let option: Option = new Option();
        option.value = areaCodeBisv.value;
        option.name = this.translate.instant(areaCodeBisv.name);
        this.areaCodeList.push(option);
      }
    }
  }

  assignmentValues() {

    if (this.phoneCompanies['error']) {
      this.setAlert('error', 'so_update_info_error');
    }

    if (!this.profile.codeOperator) {
      let option: Option = new Option();
      option.value = '';
      option.name = this.translate.instant('so_select_phone_company');

      this.optionList.push(option);
    }

    if ((!this.phoneCompanies['error']) && this.phoneCompanies && this.phoneCompanies.length > 0) {
      this.optionList = new Array<Option>;
      for (const phoneCompany of this.phoneCompanies) {
        let option: Option = new Option();

        option.value = phoneCompany.code;
        option.name = phoneCompany.description;

        this.optionList.push(option);
      }
    } else {
      this.setAlert('error', 'error.http.500');
    }
  }

  selectedCompany(event) {
    this.personalInformation.controls['phoneCompany'].setValue(event);
  }

  selectedAreaCode(event) {
    this.personalInformation.controls['areaCode'].setValue(event);
    if (this.personalInformation.controls['areaCode'].value === '+507' && this.deploymentProfile === 'bipa') {
      this.disable = true;
      this.personalInformation.controls['phoneCompanyInput'].disable();
      for (const list of this.optionList) {
        if (list.value === 'P') {
          this.personalInformation.controls['phoneCompanyInput'].setValue(list.name);
          this.personalInformation.controls['phoneCompany'].setValue(list.value);
          break;
        }
      }
    } else if (this.personalInformation.controls['areaCode'].value === 'Otro' && this.deploymentProfile === EProfile.SALVADOR) {
      this.areaCodeSV =this.personalInformation.controls['areaCode'].value
      this.optionList = new Array<Option>();
      let option: Option = new Option();
      option.value = '';
      option.name = this.translate.instant('so_select_phone_company');
      this.optionList.push(option);
      this.personalInformation.get('phoneCompany')?.disable();
    }  else if (this.personalInformation.controls['areaCode'].value === '+503' && this.deploymentProfile === EProfile.SALVADOR) {
      this.areaCodeSV =this.personalInformation.controls['areaCode'].value
      this.optionList = new Array<Option>();
      this.assignmentValues();
      this.personalInformation.get('phoneCompany')?.enable();
    } else {
      this.disable = false;
      this.personalInformation.controls['phoneCompanyInput'].setValue(this.optionList[0].name);
      this.personalInformation.controls['phoneCompany'].setValue(this.optionList[0].value);
    }
  }

  // Se crean flujos diferentes porque RO no está dispuesto a cambiar sus WS.
  bipaFlow(){
    if (this.sendSms) {
      this.handleSendAffiliationCodeOnBIPAFlow();

    } else {
      this.handleUpdateContactOnBIPAFlow();
    }
  }

  handleUpdateContactOnBIPAFlow() {
    this.securityOptionService.updateContact(this.phone ?? '', this.phoneCompany, this.mail, this.sendSms)
      .subscribe({
        next: (data) => {
          const newData = {
            phone: String(this.phone),
            codeOperator: this.phoneCompany,
            email: this.mail
          }
          this.dataUpdate.emit(newData)
          
          if(this.deploymentProfile === EProfile.SALVADOR){
            this.updateInfoContact();
          }else {
            this.setAlert('success', 'so_update_info_success');
          }
          
          this.redirectHome();
        },
        error: () => {
          if(this.deploymentProfile !== EProfile.SALVADOR){
            this.setAlert('error', 'so_update_info_error');
          }
          
        }
      })
  }

  handleSendAffiliationCodeOnBIPAFlow() {
    this.securityOptionService.sendAffiliationCode(this.phone ?? '', this.phoneCompany, this.areaCode, this.mail)
      .subscribe({
        next: () => {
          this.spinner.hide();
          this.openModal();
        },
        error: () => {
          this.spinner.hide();
          this.setAlert('error', 'so_sending_affiliation-code');
        }
      });
      
  }

  updateInfoContact(){
    if(!this.profile.changePeriod){
      if (!this.passwordPeriod['error'] && this.passwordPeriod && this.passwordPeriod.length > 0){
        this.periodCode = this.passwordPeriod[0].code;
      }else {
        this.setAlert('error', 'error.http.500');
      }
    }else{
      let period = Number(this.profile.changePeriod);
      this.periodCode = period.toString();
    }
    let periodC = this.periodCode.padStart(3, 0);
    this.securityOptionService.updateInfoContact(this.phone ?? '', this.phoneCompany, this.mail, periodC, this.areaCode)
    .subscribe({
      next: () => {
        const newData = {
          codeArea: this.areaCode,
          phone: String(this.phone),
          codeOperator: this.phoneCompany,
          email: this.mail
        }
        this.dataUpdate.emit(newData)
        this.setAlert('success', 'so_update_info_success');
        this.spinner.hide();
      },
      error: () => {
        this.spinner.hide();
        this.setAlert('error', 'so_update_info_error');
      }
    });
  }

  sendInfo() {
    this.spinner.show();
    this.showAlert = false;

    const mail = this.personalInformation.controls['mail'].value;
    const mailConfirmation = this.personalInformation.controls['mailConfirmation'].value;
    this.validatePhone();

    if (mail !== mailConfirmation) {
      this.personalInformation.controls['mailConfirmation'].setErrors({ 'doNotDuplicate': true });
    }

    if (!this.personalInformation.valid) {
      this.spinner.hide();
      this.personalInformation.markAllAsTouched();
      return;
    }


    this.phoneCompany = this.personalInformation.controls[`phoneCompany`].value;
    this.mail = this.personalInformation.controls['mail'].value;

    if (environment.profile === EProfile.PANAMA) {
      this.areaCode = this.personalInformation.controls['areaCode']?.value;

      if (this.phone !== this.oldPhone || this.areaCode !== this.oldAreaCode || this.phoneCompany !== this.oldCodeOperator) {
        this.sendSms = true;
      }

    } else  if (environment.profile === EProfile.SALVADOR) {
      this.areaCode = this.personalInformation.controls['areaCode']?.value;

      if (this.phone !== this.oldPhone || this.areaCode !== this.oldAreaCode || this.phoneCompany !== this.oldCodeOperator) {
          this.sendSms = true;
        
      }

    } else if (this.phone !== this.oldPhone || this.phoneCompany !== this.oldCodeOperator) {
      this.sendSms = true;
    }

    if (this.sendSms) {
      this.securityOptionService.setPhone(this.phone ?? '');
    }

    if (environment.profile === EProfile.PANAMA || environment.profile === EProfile.SALVADOR){
      this.bipaFlow()
    } else {
      this.handleSendInfoByProfileWithoutBIPAProfile();
    }

  }

  handleSendInfoByProfileWithoutBIPAProfile() {
    this.securityOptionService.updateContact(this.phone ?? '', this.phoneCompany, this.mail, this.sendSms)
      .subscribe({
        next: (data) => {
          if (this.sendSms) {
            this.spinner.hide();
            this.openModal();
          } else {
            const newData = {
              'phone': String(this.phone),
              'codeOperator': this.phoneCompany,
              'email': this.mail
            }
            this.dataUpdate.emit(newData)
            this.setAlert('success', 'so_update_info_success');
            this.redirectHome();
          }
        },
        error: (error: HttpErrorResponse) => {
          this.spinner.hide();
          this.setAlert('error', 'so_update_info_error');
        }
      });
  }

  validatePhone() {
    let phone = this.personalInformation.controls['phone'].value;
    
    let minLength = this.phoneSettings.minLength;
    if(environment.profile === EProfile.SALVADOR && this.personalInformation.controls['areaCode'].value === '+503'){
      //Longitud minima que se evalua es 8
      if (!phone || phone.length < minLength) {
        this.personalInformation.controls['phone'].setErrors({ 'minlength': true });
      }
      if(this.regexSV.exec(phone)){
        this.personalInformation.controls['phone'].setErrors({ 'initphone': true });
      }
    }else if (environment.profile === EProfile.SALVADOR && this.personalInformation.controls['areaCode'].value === 'Otro'){
      //Longitud mínima que se evalua actualmente es 8 se evaluava 12
      if (!phone || phone.length < minLength ) {
        this.personalInformation.controls['phone'].setErrors({ 'minlength': true });
      }
    }else {
      if (!phone || phone.length < minLength) {
        this.personalInformation.controls['phone'].setErrors({ 'minlength': true });
      }
    }
    

    this.phone = phone;
  }

  clearInfo() {
    this.checkProfileService.validateUser()
      .subscribe({
        next: (result) => {
          this.validateUserService = result.postponeTimes;
          if (this.validateUserService <= 0) {
            const theme = environment['profile'] || 'byte';
            this.modalService.open(PostponeModalComponent,
              {
                centered: true, windowClass: `custom-modal ${theme}`, size: 'lg',
              });
          } else {
            this.goClearInfo();
          }
        },
        error: () => {
          this.goClearInfo();
        }
      });
  }
  goClearInfo() {
    this.spinner.show();
    this.checkProfileService.postponeRegisterProfile()
      .subscribe({
        next: (data) => {
          this.spinner.hide();
          this.router.navigate(['/' + this.home]);
        },
        error: (error: HttpErrorResponse) => {
          this.spinner.hide();

          this.personalInformation.controls['phone'].setValue('');
          this.personalInformation.controls['mail'].setValue('');
          this.personalInformation.controls['mailConfirmation'].setValue('');

          this.setAlert('error', error?.error?.message);
        }
      });
  }

  errorToShow(error): string {

    if (error.pattern) {

      return 'error_regex_mail';
    } else if (error.doNotMatch) {

      return 'cp_do_not_match';
    } else if (error.doNotDuplicate) {

      return 'cp_do_not_duplicate';
    } else if (error.minlength) {

      return 'so_error_minLength';
    } else if (error.initphone) {

      return 'so_error_invalidphone';
    }
    
    return 'unknown';
  }

  openModal() {
    const theme = environment['profile'] || 'byte-theme';
    const modalRef = this.modalService.open(PhoneChangeValidationModalComponent,
      {
        centered: true, windowClass: theme + " phone-modal", size: 'lg'
        // keyboard: false
      });
    
    modalRef.componentInstance.areaCode = this.areaCode;
    modalRef.result.then((result) => {
      this.handleResponseFromOpenModal(result);
    });
  }

  handleResponseFromOpenModal(result: any) {
      if (result === '0') {
        this.spinner.show();
        this.sendSms = false;
        this.securityOptionService.updateContact(this.phone ?? '', this.phoneCompany, this.mail, this.sendSms)
          .subscribe({
            next: () => {
              const newData = {
                phone: String(this.phone),
                codeOperator: this.phoneCompany,
                email: this.mail
              }

              this.dataUpdate.emit(newData)
              
              if(this.deploymentProfile === EProfile.SALVADOR){
                this.updateInfoContact();
              }else {
                this.setAlert('success', 'so_update_info_success');
              }
              this.redirectHome();
            },
            error: () => {
              this.spinner.hide();
              if (this.deploymentProfile !== EProfile.SALVADOR){
                this.setAlert('error', 'so_update_info_error');
              }
             
            }
          })
      } else {
        this.setAlert('error', 'so_update_code_error');
      }

  }

  redirectHome() {
    if (this.configurationType === 1) {
      setTimeout(() => {
        this.router.navigate(['/' + this.home]);
        this.spinner.hide();
      }, 2000);
    } else {
      this.spinner.hide();
    }
  }

  setAlert(type: string, error: string) {
    this.showAlert = true;
    this.typeAlert = type;
    this.messageAlert = error;
  }

  confLenghtEmail(){
    if(environment.profile === EProfile.SALVADOR){
      this.lenghtEmail = 60;
    }else {
      this.lenghtEmail = 50;
    }
  }
}
