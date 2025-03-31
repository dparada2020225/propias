import {Injectable} from '@angular/core';
import {ITTDCrudLayoutRenponce, ITTDDeleteConfirm} from '../../interfaces/third-crud.interface';
import {IThirdTransfersAccounts} from 'src/app/modules/transfer/interface/transfer-data-interface';
import {AdfFormatService, DateTimeFormat, IDataReading, IHeadBandAttribute} from '@adf/components';
import {UtilService} from 'src/app/service/common/util.service';
import {TTDCRUDManagerService} from '../definition/crud/manager/ttd-crud-manager.service';
import {IHeadBandLayoutConfirm} from 'src/app/models/util-work-flow.interface';
import {UtilWorkFlowService} from 'src/app/service/common/util-work-flow.service';

@Injectable({
  providedIn: 'root'
})
export class TteTransferDeleteAccountService {

  account!: IThirdTransfersAccounts;
  reference: string | null = null;
  dateTime!: DateTimeFormat;
  date: string = '';
  layoutJsonVoucher: IDataReading | null = null;
  headBandLayout: IHeadBandAttribute[] = [];
  userName: string = '';


  constructor(
    private util: UtilService,
    private utilWorkFlow: UtilWorkFlowService,
    private crudManagerService: TTDCRUDManagerService,
    private formatService: AdfFormatService,
  ) {
  }

  voucherDeleteLayout(builderParameters: ITTDDeleteConfirm): ITTDCrudLayoutRenponce {

    const {account, reference, date} = builderParameters ?? {};

    this.account = account;
    this.reference = reference;
    this.userName = this.util.getUserName();
    this.date = date!;
    this.dateTime = this.formatService.getFormatDateTime(date!);


    this.layoutVoucherBuilder();
    this.headBandLayoutBuilder();

    return this.responseVoucherLayoutsMainBuilder()
  }

  private responseVoucherLayoutsMainBuilder(): ITTDCrudLayoutRenponce {
    return {
      layoutJsonCrud: this.layoutJsonVoucher,
      headBandLayout: this.headBandLayout,
    };
  }

  private layoutVoucherBuilder(): void {
    const voucher: ITTDDeleteConfirm = {
      account: this.account,
      reference: this.reference!
    };

    this.layoutJsonVoucher = this.crudManagerService.builderDeleteConfirmationTTD(voucher);
  }

  private headBandLayoutBuilder(): void {
    const headBandLayoutConfirm: IHeadBandLayoutConfirm = {
      date: this.dateTime,
      reference: this.reference!,
    };

    this.headBandLayout = this.utilWorkFlow.getHeadBandLayoutConfirm(headBandLayoutConfirm);
  }
}
