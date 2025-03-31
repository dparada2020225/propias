import {IDataReading} from '@adf/components';
import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {EProfile} from 'src/app/enums/profile.enum';
import {ParameterManagementService} from 'src/app/service/navegation-parameters/parameter-management.service';
import {environment} from 'src/environments/environment';
import {IThirdTransfersAccounts} from '../../../../../../interface/transfer-data-interface';
import {ITTDUpdateConfirm} from '../../../../interfaces/third-crud.interface';
import {IThirdTransferUpdateState} from '../../../../interfaces/third-transfer-persistence.interface';
import {ICrudCreateFormValues, IInfoFavorite} from '../../../../interfaces/third-transfer.interface';
import {TteTransferUpdateAccountService} from '../../../../services/execution/tte-transfer-update-account.service';
import {EThirdTransferUrlNavigationCollection} from "../../../../enums/third-transfer-navigate-parameters.enum";
import {IAddFavoriteACH} from "../../../../../transfer-ach/interfaces/ach-transfer.interface";

@Component({
  selector: 'byte-tt-update-voucher',
  templateUrl: './tt-update-voucher.component.html',
  styleUrls: ['./tt-update-voucher.component.scss'],
})
export class TtUpdateVoucherComponent implements OnInit {
  accountToUpdate!: IThirdTransfersAccounts;

  private profile: string = environment.profile;
  typeProfile: string = EProfile.SALVADOR;
  isFavorite: boolean = false;
  accountToSendFavorite: IAddFavoriteACH | null = null;

  typeAlert: string | null = null;
  messageAlert: string | null = null;
  reference!: string;
  dateTime: string | null = null;
  formValues!: ICrudCreateFormValues;
  voucherLayout!: IDataReading;

  get customShow() {
    return this.typeAlert && this.messageAlert ? 'custom_show' : '';
  }

  get typePrevButton() {
    return this.profile === EProfile.HONDURAS ? 'primary' : 'secondary';
  }

  get classNameReadings() {
    const className = {
      [EProfile.SALVADOR]: 'reading-sv'
    }
    return className[this.profile] || '';
  }

  get classNameButtons() {
    const className = {
      [EProfile.SALVADOR]: 'no-line_sv hover_button-primary-sv button-sv'
    }
    return className[this.profile] || '';
  }

  constructor(
    private router: Router,
    private parameterManagement: ParameterManagementService,
    private builderAttributes: TteTransferUpdateAccountService,
  ) {
  }

  ngOnInit(): void {
    const updateState: IThirdTransferUpdateState = this.parameterManagement.getParameter('navigateStateParameters');
    this.accountToUpdate = updateState?.accountToUpdate;
    this.formValues = updateState?.formValues as never;
    this.reference = updateState?.transactionResponse?.reference as never;
    this.dateTime = updateState?.transactionResponse?.dateTime as never;

    if (this.profile === this.typeProfile) {
      this.isFavorite = this.accountToUpdate?.favorite || false;
      this.accountToSendFavorite = {
        alias: this.formValues.alias || '',
        number: this.accountToUpdate.account || ''
      }
    }

    this.buildUpdateVoucher();
  }

  buildUpdateVoucher() {
    const updateConfirm: ITTDUpdateConfirm = {
      account: this.accountToUpdate,
      formValues: this.formValues,
      reference: this.reference,
      dateTime: this.dateTime!
    };

    const {layoutJsonCrud} =
      this.builderAttributes.voucherLayoutUpdate(updateConfirm);

    this.voucherLayout = layoutJsonCrud!;

    const mapMessageEdit = {
      [EProfile.SALVADOR]: 'account_update_successfully-sv',
      [EProfile.HONDURAS]: 'account_update_successfully'
    }

    this.showAlert('success', mapMessageEdit[this.profile] || 'account_update_successfully');
  }

  prevStep() {
    const mapNavigation = {
      [EProfile.SALVADOR]: EThirdTransferUrlNavigationCollection.HOMESV,
      [EProfile.HONDURAS]: EThirdTransferUrlNavigationCollection.HOME,
    }
    this.resetStorage();
    this.router.navigate([mapNavigation[this.profile] || EThirdTransferUrlNavigationCollection.HOME]).then(() => {
    });
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

  changeInfoAndShowAlert(data: IInfoFavorite) {
    const {favorite, typeAlert, message} = data
    this.isFavorite = favorite;

    if (typeAlert && message) {
      this.typeAlert = typeAlert!;
      this.messageAlert = message!
    }
  }
}
