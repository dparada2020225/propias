import {IDataReading, IHeadBandAttribute} from '@adf/components';
import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {EProfile} from 'src/app/enums/profile.enum';
import {ParameterManagementService} from 'src/app/service/navegation-parameters/parameter-management.service';
import {environment} from 'src/environments/environment';
import {UtilService} from '../../../../../../../../service/common/util.service';
import {IThirdTransfersAccounts} from '../../../../../../interface/transfer-data-interface';
import {ITTDDeleteConfirm} from '../../../../interfaces/third-crud.interface';
import {IThirdTransferDeleteState} from '../../../../interfaces/third-transfer-persistence.interface';
import {TteTransferDeleteAccountService} from '../../../../services/execution/tte-transfer-delete-account.service';

@Component({
  selector: 'byte-ttd-delete',
  templateUrl: './ttd-delete.component.html',
  styleUrls: ['./ttd-delete.component.scss'],
})
export class TtdDeleteComponent implements OnInit {
  confirmationVoucher: IDataReading | null = null;
  headBand: IHeadBandAttribute[] = [];

  isShowPrintButton: boolean = false;

  typeAlert: string | null = null;
  messageAlert: string | null = null;
  dateTime!: string;
  reference!: string;

  currentAccount!: IThirdTransfersAccounts;

  typeProfile: string = environment.profile;
  profile: string = EProfile.SALVADOR;

  get customShow() {
    return this.typeAlert && this.messageAlert ? 'custom_show' : '';
  }

  get typePrevButton() {
    return this.typeProfile === EProfile.HONDURAS ? 'primary' : 'secondary';
  }

  constructor(
    private router: Router,
    private parameterManagement: ParameterManagementService,
    private deleteManager: TteTransferDeleteAccountService,
    private utils: UtilService,
  ) {
  }

  ngOnInit(): void {
    const crudCreateState: IThirdTransferDeleteState = this.parameterManagement.getParameter('navigateStateParameters');

    this.reference = crudCreateState?.transactionResponse?.reference;
    this.dateTime = crudCreateState?.transactionResponse?.dateTime;
    this.currentAccount = crudCreateState?.accountToDelete;
    this.buildDeleteConfirmationVoucher();
  }

  buildDeleteConfirmationVoucher() {
    const deleteConfirm: ITTDDeleteConfirm = {
      reference: this.reference,
      account: this.currentAccount,
      date: this.dateTime,
    };

    const {
      layoutJsonCrud,
      headBandLayout,
    } = this.deleteManager.voucherDeleteLayout(deleteConfirm);

    this.confirmationVoucher = layoutJsonCrud;
    this.headBand = headBandLayout;

    if (this.typeProfile === this.profile) {
      this.isShowPrintButton = !this.isShowPrintButton;
    }

    this.showAlert('success', 'account_successfully_removed');
  }

  prevStep() {
    this.utils.showLoader();
    this.resetStorage();
    this.router.navigate(['/transfer/third']).finally(() => this.utils.hideLoader());
  }

  resetStorage() {
    this.parameterManagement.sendParameters({
      navigationProtectedParameter: null,
      navigateStateParameters: null,
    });
  }

  showAlert(type: string, message: string) {
    this.typeAlert = type;
    this.messageAlert = message;
  }

  hiddenAlert() {
    this.typeAlert = null;
    this.messageAlert = null;
  }
}
