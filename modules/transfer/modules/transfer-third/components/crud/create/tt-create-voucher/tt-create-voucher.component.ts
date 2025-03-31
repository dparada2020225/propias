import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {IDataReading, IHeadBandAttribute} from '@adf/components';
import {IGetThirdTransferResponse} from '../../../../interfaces/third-transfer-service';
import {ITTDCreateConfirm} from '../../../../interfaces/third-crud.interface';
import {IThirdTransferCreateState} from '../../../../interfaces/third-transfer-persistence.interface';
import {ICrudCreateFormValues, IInfoFavorite} from '../../../../interfaces/third-transfer.interface';
import {ICreateThird} from '../../../../interfaces/crud/create-third-interface';
import {ParameterManagementService} from 'src/app/service/navegation-parameters/parameter-management.service';
import {UtilService} from '../../../../../../../../service/common/util.service';
import {environment} from 'src/environments/environment';
import {EProfile} from 'src/app/enums/profile.enum';
import {IPrint} from 'src/app/modules/transfer/interface/print-data-interface';
import {TteTransferCrudService} from '../../../../services/execution/tte-transfer-add-account.service';
import {
  EThirdTransferNavigateParameters,
  EThirdTransferUrlNavigationCollection
} from "../../../../enums/third-transfer-navigate-parameters.enum";
import {Currency, IThirdTransfersAccounts, Status} from "../../../../../../interface/transfer-data-interface";
import {IAddFavoriteACH} from "../../../../../transfer-ach/interfaces/ach-transfer.interface";

@Component({
  selector: 'byte-tt-create-voucher',
  templateUrl: './tt-create-voucher.component.html',
  styleUrls: ['./tt-create-voucher.component.scss'],
})
export class TtCreateVoucherComponent implements OnInit {
  accountToAdd: IGetThirdTransferResponse | null = null;
  confirmationVoucher: IDataReading | null = null;
  pdfLayout?: IPrint;

  typeAlert: string | null = null;
  messageAlert: string | null = null;
  dateTime!: string;
  reference!: string;
  headBand: IHeadBandAttribute[] = [];
  formValues!: ICrudCreateFormValues;
  currentAccount!: ICreateThird;

  isShowPrintButton: boolean = false;
  private profile: string = environment.profile;
  profileSv: string = EProfile.SALVADOR;

  isFavorite: boolean = false;
  accountToSendFavorite: IAddFavoriteACH | null = null;

  get customShow() {
    return this.typeAlert && this.messageAlert ? 'custom_show' : '';
  }

  get typePrevButton() {
    return !this.isShowPrintButton && this.profile === EProfile.HONDURAS ? 'primary' : 'secondary';
  }

  get buttonMessage() {
    const message = {
      [EProfile.HONDURAS]: 'print',
      [EProfile.SALVADOR]: 'transfers',
    }
    return message[this.profile] || '´print';
  }

  get classNameLayout() {
    const className = {
      [EProfile.SALVADOR]: 'layout-bisv',
    }
    return className[this.profile] || ''
  }

  get classNameButtons() {
    const classNameButtons = {
      [EProfile.SALVADOR]: 'hover_button-primary-sv btn-sv'
    }
    return classNameButtons[this.profile] || ''
  }

  get classNameheadband() {
    const classNameHeadband = {
      [EProfile.SALVADOR]: 'headband-sv'
    }
    return classNameHeadband[this.profile] || ''
  }

  constructor(
    private router: Router,
    private parameterManagement: ParameterManagementService,
    private createScreenManager: TteTransferCrudService,
    private utils: UtilService,
  ) {
  }

  ngOnInit(): void {
    const crudCreateState: IThirdTransferCreateState = this.parameterManagement.getParameter('navigateStateParameters');

    this.accountToAdd = crudCreateState?.accountToAdd;
    this.reference = crudCreateState?.transactionResponse?.reference as string;
    this.dateTime = crudCreateState?.transactionResponse?.dateTime as string;
    this.currentAccount = crudCreateState?.currentAccount as ICreateThird;
    this.formValues = crudCreateState?.formValues as ICrudCreateFormValues;

    if (this.profile === this.profileSv) {
      this.isFavorite = this.currentAccount?.favorite || false;
      this.accountToSendFavorite = {
        alias: this.currentAccount.alias || '',
        number: this.currentAccount.account || '',
      }
    }

    this.confirmationAssociationAccount();
  }

  confirmationAssociationAccount(): void {

    const createConfirm: ITTDCreateConfirm = {
      reference: this.reference,
      account: this.currentAccount,
      alias: this.formValues?.alias,
      email: this.formValues?.email ?? '',
      detailAccount: this.accountToAdd as IGetThirdTransferResponse,
      date: this.dateTime
    };

    const {layoutJsonCrud, headBandLayout} =
      this.createScreenManager.voucherLayoutsMainBuilder(createConfirm);

    this.confirmationVoucher = layoutJsonCrud;
    this.headBand = headBandLayout;

    if (this.profile === this.profileSv) {
      this.isShowPrintButton = !this.isShowPrintButton;
    }

    const mapMessage = {
      [EProfile.SALVADOR]: 'account_created_successfully-sv',
      [EProfile.HONDURAS]: 'account_created_successfully'
    }

    this.showAlert('success', mapMessage[this.profile] || 'account_created_successfully');
  }

  navigateToTransferThird() {
    this.utils.showLoader();

    const accountToTransfer: IThirdTransfersAccounts = {
      alias: this.currentAccount.alias,
      account: this.accountToAdd?.account!,
      name: this.accountToAdd?.name!,
      currency: Currency.Usd,
      formattedAccount: '',
      product: this.accountToAdd?.product!,
      email: this.formValues.email!,
      status: this.accountToAdd?.status as Status,
      type: this.currentAccount.type!,
      favorite: this.currentAccount.favorite,
      subProduct: this.accountToAdd?.subProductType!,
    }

    this.parameterManagement.sendParameters({
      navigationProtectedParameter: EThirdTransferNavigateParameters.TRANSFER_HOME,
      navigateStateParameters: {
        targetAccount: accountToTransfer,
      }
    });

    this.router.navigate(['/transfer/third/transaction']).finally(() => this.utils.hideLoader());
  }

  nextStep(): void {
    switch (this.profile) {
      case EProfile.HONDURAS:
        return;
      case EProfile.SALVADOR:
        this.navigateToTransferThird();
        break;
      default:
        return;
    }
  }

  prevStep() {
    const mapNavigation = {
      [EProfile.SALVADOR]: EThirdTransferUrlNavigationCollection.HOMESV,
      [EProfile.HONDURAS]: EThirdTransferUrlNavigationCollection.HOME,
    }
    this.utils.showLoader();
    this.resetStorage();
    this.router.navigate([mapNavigation[this.profile] || EThirdTransferUrlNavigationCollection.HOME]).finally(() => this.utils.hideLoader());
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
