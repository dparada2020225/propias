import {AdfFormatService, DateTimeFormat, IDataReading, IHeadBandAttribute} from '@adf/components';
import {Injectable} from '@angular/core';
import {UtilWorkFlowService} from 'src/app/service/common/util-work-flow.service';
import {UtilService} from 'src/app/service/common/util.service';
import {ITTDCreateConfirm, ITTDCrudLayoutRenponce} from '../../interfaces/third-crud.interface';
import {ICreateThird} from '../../interfaces/crud/create-third-interface';
import {IGetThirdTransferResponse} from '../../interfaces/third-transfer-service';
import {IHeadBandLayoutConfirm} from 'src/app/models/util-work-flow.interface';
import {TTDCRUDManagerService} from '../definition/crud/manager/ttd-crud-manager.service';

@Injectable({
  providedIn: 'root'
})
export class TteTransferCrudService {


  layoutJsonVoucher: IDataReading | null = null;
  headBandLayout: IHeadBandAttribute[] = [];

  reference!: string;
  dateTime!: DateTimeFormat;
  account!: ICreateThird;
  detailAccount!: IGetThirdTransferResponse;
  alias!: string;
  email!: string;
  userName: string = '';


  constructor(
    private definitionServiceManager: TTDCRUDManagerService,
    private utilWorkFlow: UtilWorkFlowService,
    private formatService: AdfFormatService,
    private util: UtilService
  ) {
  }


  voucherLayoutsMainBuilder(builderParameters: ITTDCreateConfirm): ITTDCrudLayoutRenponce {
    const {reference, account, alias, email, detailAccount, date} = builderParameters ?? {};

    this.reference = reference;
    this.dateTime = this.formatService.getFormatDateTime(date!);
    this.account = account;
    this.alias = alias
    this.email = email;
    this.detailAccount = detailAccount;
    this.userName = this.util.getUserName();

    this.layoutVoucherBuilder();
    this.headBandLayoutBuilder();

    return this.responseVoucherLayoutsMainBuilder();
  }

  private responseVoucherLayoutsMainBuilder(): ITTDCrudLayoutRenponce {
    return {
      layoutJsonCrud: this.layoutJsonVoucher,
      headBandLayout: this.headBandLayout,
    };
  }

  private layoutVoucherBuilder(): void {
    const layout: ITTDCreateConfirm = {
      account: this.account,
      alias: this.alias,
      detailAccount: this.detailAccount,
      email: this.email,
      reference: this.reference
    };

    this.layoutJsonVoucher = this.definitionServiceManager.builderCreatedConfirmationTTC(layout);
  }

  private headBandLayoutBuilder(): void {
    const headBandLayoutConfirm: IHeadBandLayoutConfirm = {
      date: this.dateTime,
      reference: this.reference,
    };

    this.headBandLayout = this.utilWorkFlow.getHeadBandLayoutConfirm(headBandLayoutConfirm);
  }

}
