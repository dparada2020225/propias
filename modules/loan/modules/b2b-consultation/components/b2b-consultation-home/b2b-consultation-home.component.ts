import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import {
  ParameterManagementService
} from '../../../../../../service/navegation-parameters/parameter-management.service';
import { IB2bConsultationAccounts } from '../../interfaces/b2b-consultation-service.interface';
import {
  AdfConfirmationModalComponent,
  AdfFormBuilderService,
  IConfirmationModal,
  IDataReading,
  IDataSelect,
  ILayout,
  IPossibleValue
} from '@adf/components';
import { FormGroup } from '@angular/forms';
import { IPrintData } from '../../../../../transfer/interface/print-data-interface';
import { ActivatedRoute, Router } from '@angular/router';
import { IFlowError } from '../../../../../../models/error.interface';
import { B2bdConsultManagerService } from '../../service/definition/b2bd-consult-manager.service';
import { AttributeB2BConsultation } from '../../enum/b2b-consultation-control-name.enum';
import { distinctUntilChanged, finalize, throttleTime } from 'rxjs/operators';
import { B2bConsultationTransactionService } from '../../service/transaction/b2b-consultation-transaction.service';
import { HttpErrorResponse } from '@angular/common/http';
import { IB2bConsultationBalance, IB2bConsultationDetail } from '../../interfaces/b2b-consultation.interface';
import { IB2BDConsultModalParameters } from '../../interfaces/b2bd-consult-modal.interface';
import moment from 'moment';
import { B2bConsultationPrintService } from '../../../../prints/b2b-consultation-print.service';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ValidationTriggerTimeService } from '../../../../../../service/common/validation-trigger-time.service';
import { IIsSchedule } from '../../../../../../models/isSchedule.interface';
import { UtilService } from '../../../../../../service/common/util.service';
import { IUserInfo } from '../../../../../../models/user-info.interface';

@Component({
  selector: 'byte-b2b-consultation-home',
  templateUrl: './b2b-consultation-home.component.html',
  styleUrls: ['./b2b-consultation-home.component.scss']
})
export class B2bConsultationHomeComponent implements OnInit {
  form!: FormGroup;
  formLayout!: ILayout;
  modalLayout: IConfirmationModal | null = null;
  voucherLayout!: IDataReading;
  pdfLayout: IPrintData[] = [];

  informationBalance: IPossibleValue[] = [];
  b2bAccountSelectedDetail: IB2bConsultationDetail | null = null;
  b2bAccountSelected: IB2bConsultationAccounts | null = null;

  optionsList: IDataSelect[] = [];
  bankName: string = 'BI-BANK CONNECTION';

  currency: string = environment.currency
  b2bAccountList: IB2bConsultationAccounts[] = []

  typeAlert: string = '';
  messageAlert: string = '';
  userInfo: IUserInfo = this.parameterManagement.getParameter('userInfo');
  hasDetailAccountError: boolean = false;

  get customShow() {
    return this.typeAlert && this.messageAlert ? 'custom_show' : '';
  }

  constructor(
    private parameterManagement: ParameterManagementService,
    private managerDefinition: B2bdConsultManagerService,
    private activatedRoute: ActivatedRoute,
    private adfFormBuilder: AdfFormBuilderService,
    private transactionService: B2bConsultationTransactionService,
    private pdfService: B2bConsultationPrintService,
    private translate: TranslateService,
    private modalService: NgbModal,
    private router: Router,
    private validationTriggerTime: ValidationTriggerTimeService,
    private utils: UtilService,
  ) { }

  ngOnInit(): void {
    this.validationRangeTriggerTime();
    this.getB2bAccounts();
    this.formDefinition();
    this.getDefaultDetail();
  }

  validationRangeTriggerTime() {
    const schedule: IIsSchedule | IFlowError = this.activatedRoute.snapshot.data['scheduleService'];

    this.validationTriggerTime.validate(environment.profile, schedule);
  }

  formDefinition() {
    this.formLayout = this.managerDefinition.buildFormLayout()
    this.form = this.adfFormBuilder.formDefinition(this.formLayout.attributes);
    this.accountDataList(AttributeB2BConsultation.B2B_ACCOUNT, this.b2bAccountList)
    this.changeFormSimple();
  }

  changeFormSimple() {
    this.form.get(AttributeB2BConsultation.B2B_ACCOUNT)?.valueChanges
      .pipe(distinctUntilChanged(), throttleTime(500))
      .subscribe((account) => {
        this.getSelectedAccount(account);
        this.changeB2bAccountSelected(account);
    });
  }

  getSelectedAccount(numberAccount: string) {
    const account = this.b2bAccountList.find(acc => acc.b2bID === numberAccount);

    if (!account) { return; }

    this.b2bAccountSelected = account;
  }



  changeB2bAccountSelected(account: string) {
    this.utils.showLoader();

    this.transactionService
      .b2bDetail(account)
      .pipe(finalize(() => this.utils.hideLoader()))
      .subscribe({
        next: (b2bAccountDetail) => {
          this.b2bAccountSelectedDetail = b2bAccountDetail;
          this.buildMainLayout(b2bAccountDetail);
          this.buildInformation(b2bAccountDetail?.balance);
        },
        error: (error: HttpErrorResponse) => {
          this.hasDetailAccountError = true;
          this.showAlert('error', error?.error?.message ?? 'message-err-data-account');
        }
      });
  }

  buildMainLayout(b2bAccountDetail: IB2bConsultationDetail) {
    this.voucherLayout = this.managerDefinition.buildVoucherLayout(b2bAccountDetail, this.currency);
    this.pdfLayout = this.managerDefinition.buildPdfLayout(this.b2bAccountSelectedDetail as IB2bConsultationDetail, this.currency);
    this.buildModalLayout();
  }

  buildModalLayout() {
    const dateTime = this.getEmissionDate();

    const propertiesToModal: IB2BDConsultModalParameters = {
      back2back: this.b2bAccountSelectedDetail as IB2bConsultationDetail,
      dateTime: {
        hour: dateTime?.hour,
        date: dateTime?.date,
      },
      user: this.userInfo,
      bankName: this.bankName,
      currency: this.currency,
    };

    this.modalLayout = this.managerDefinition.buildModalLayout(propertiesToModal);
  }

  getDefaultDetail() {
    if (this.b2bAccountList.length <= 0) { return; }
    const firstValue = this.b2bAccountList[0];
    this.form.get(AttributeB2BConsultation.B2B_ACCOUNT)?.setValue(firstValue.b2bID);
  }

  accountDataList(controlName: string, accountList: IB2bConsultationAccounts[]): void {
    if (!accountList) { return; }

    const accounts: IPossibleValue[] = accountList.map((account) => ({
      name: `${account.b2bID} - ${account.name}`,
      value: account.b2bID,
    }));

    const list: IDataSelect = {
      controlName,
      data: accounts,
    };

    this.optionsList = [...this.optionsList, { ...list }];
  }

  getB2bAccounts() {
    const b2bConsultationResponse = this.activatedRoute.snapshot.data['b2bAccountList'];
    console.log(b2bConsultationResponse);

    if (b2bConsultationResponse.hasOwnProperty('error')) {
      const error: IFlowError = b2bConsultationResponse;
      this.showAlert('error', error?.message);
      return
    }

    const b2bAccountList = b2bConsultationResponse as IB2bConsultationAccounts[];

    if (b2bAccountList.length <= 0) {
      this.showAlert('info', 'errorB2b:b2bAccountEmptyList');
    }

    this.b2bAccountList = b2bAccountList;
  }


  nextStep() {
    if (!this.validationTriggerTime.isAvailableSchedule) {
      this.validationTriggerTime.openModal();
      return;
    }

    if (this.hasDetailAccountError) { return; }
    this.openProofModal();
  }

  lastStep() {
    this.router.navigate(['home']).then(() => {});
  }

  openProofModal() {
    const modal = this.modalService.open(AdfConfirmationModalComponent, {
      centered: true,
      windowClass: `${environment.profile || 'byte-theme'} byte-consultation`,
      size: 'lg',
    });

    modal.componentInstance.data = this.modalLayout;

    modal.result.then(isConfirm => {
      if (!isConfirm) { return; }

      this.exportPdfFile();
    });
  }

  exportPdfFile() {
    const reference = this.b2bAccountSelectedDetail?.reference;
    const label = this.translate.instant('title-pdf:b2b-consult');
    this.pdfService.pdfGenerate(reference, `${reference}`, label, 268, 'consultation-b2b', this.pdfLayout);
  }

  getEmissionDate() {
    const date = moment().format('DD/MM/YYYY');
    const hour = moment().format('HH');
    const minute = moment().format('mm');

    const suffix = +hour <= 12 ? 'AM' : 'PM';

    const finalHour = `${hour}:${minute} ${suffix}`;

    return {
      hour: finalHour,
      date,
    };
  }

  buildInformation(balanceDetail: IB2bConsultationBalance) {
    this.informationBalance = [];
    if (Object.keys(balanceDetail).length !== 0) {
      Object.entries(balanceDetail).forEach(([key, value]) => {
        this.informationBalance.push({ name: key, value } as IPossibleValue);
      });
    } else {
      this.informationBalance.push({ name: 'total', value: '0' });
    }
  }

  showAlert(type: string, message: string) {
    this.typeAlert = type;
    this.messageAlert = message;
  }

  hiddenAlert() {
    this.typeAlert = '';
    this.messageAlert ='';
  }


}
