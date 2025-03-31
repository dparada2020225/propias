import {Injectable} from '@angular/core';
import {ITTDCrudLayoutUpdate, ITTDUpdateConfirm} from '../../interfaces/third-crud.interface';
import {IThirdTransfersAccounts} from 'src/app/modules/transfer/interface/transfer-data-interface';
import {ICrudCreateFormValues} from '../../interfaces/third-transfer.interface';
import {AdfFormatService, DateTimeFormat, IDataReading, IHeadBandAttribute} from '@adf/components';
import {TTDCRUDManagerService} from '../definition/crud/manager/ttd-crud-manager.service';

@Injectable({
    providedIn: 'root'
})
export class TteTransferUpdateAccountService {

    account!: IThirdTransfersAccounts
    formValues!: ICrudCreateFormValues;
    reference!: string;
    dateTime!: DateTimeFormat;

    layoutJsonVoucher: IDataReading | null = null;
    headBandLayout: IHeadBandAttribute[] = [];


    constructor(
        private crudManagerService: TTDCRUDManagerService,
        private formatService: AdfFormatService,
    ) {
    }

    voucherLayoutUpdate(builderParameters: ITTDUpdateConfirm): ITTDCrudLayoutUpdate {

        this.account = builderParameters.account;
        this.formValues = builderParameters.formValues;
        this.reference = builderParameters.reference;
        this.dateTime = this.formatService.getFormatDateTime(builderParameters.dateTime!)

        this.layoutVoucherBuilder();
        return this.responseVoucherLayoutsUpdateBuilder();
    }

    private responseVoucherLayoutsUpdateBuilder(): ITTDCrudLayoutUpdate {
        return {
            layoutJsonCrud: this.layoutJsonVoucher,
        };
    }

    private layoutVoucherBuilder(): void {
        const updateConfirm: ITTDUpdateConfirm = {
            account: this.account,
            formValues: this.formValues,
            reference: this.reference,
        };

        this.layoutJsonVoucher = this.crudManagerService.builderUpdateConfirmationTTU(updateConfirm);
    }

}
