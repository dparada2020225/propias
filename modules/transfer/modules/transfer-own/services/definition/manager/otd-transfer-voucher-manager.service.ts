import { IConfirmationModal, IDataReading } from '@adf/components';
import { Injectable } from '@angular/core';
import { IPrint } from '../../../../../interface/print-data-interface';
import { IOTDVoucher, IOTDVoucherModal, IOTDVoucherPdf } from '../../../interfaces/own-transfer-definition.interface';
import { IExecuteOwnTransfer, IOwnTransferExecuteProperties } from '../../../interfaces/own-transfer.interface';
import { OtdTransferBaseVoucherService } from '../base/otd-transfer-base-voucher.service';
import { OtdTransferBanpaisVoucherModalService } from '../personalization/otd-transfer-banpais-voucher-modal.service';
import { OtdTransferBanpaisVoucherPdfService } from '../personalization/otd-transfer-banpais-voucher-pdf.service';
import { OtdTransferBanpaisVoucherService } from '../personalization/otd-transfer-banpais-voucher.service';
import { OtdTransferBisvVoucherModalService } from '../personalization/otd-transfer-bisv-voucher-modal.service';
import { OtdTransferBisvVoucherPdfService } from '../personalization/otd-transfer-bisv-voucher-pdf.service';
import { OtdTransferBisvVoucherService } from '../personalization/otd-transfer-bisv-voucher.service';
import { EProfile } from 'src/app/enums/profile.enum';
import { environment } from 'src/environments/environment';
import { OtdTransferBipaVoucherService } from '../personalization/otd-transfer-bipa-voucher.service';
import { OtdTransferBipaVoucherModalService } from '../personalization/otd-transfer-bipa-voucher-modal.service';
import { OtdTransferBipaVoucherPdfService } from '../personalization/otd-transfer-bipa-voucher-pdf.service';

@Injectable({
  providedIn: 'root'
})
export class OtdTransferVoucherManagerService {

  profile = environment.profile;

  constructor(
    private banpaisVoucher: OtdTransferBanpaisVoucherService,
    private bisvVoucher: OtdTransferBisvVoucherService,
    private bipaVoucher: OtdTransferBipaVoucherService,
    private baseVoucher: OtdTransferBaseVoucherService,
    private modalBisv: OtdTransferBisvVoucherModalService,
    private modalBanpais: OtdTransferBanpaisVoucherModalService,
    private modalBipa: OtdTransferBipaVoucherModalService,
    private banpaisPdf: OtdTransferBanpaisVoucherPdfService,
    private bisvPdf: OtdTransferBisvVoucherPdfService,
    private bipaPdf: OtdTransferBipaVoucherPdfService
  ) { }

  buildAccountToExecuteTransferStep3(properties: IOwnTransferExecuteProperties): IExecuteOwnTransfer {
    return this.baseVoucher.buildAccountToExecuteTransfer(properties);
  }

  builderLayoutVoucherStep3(voucher: IOTDVoucher, isSignatureTrackingUpdate?: boolean): IDataReading {
    switch (this.profile) {
      case EProfile.HONDURAS:
        return this.banpaisVoucher.builderLayoutVoucher(voucher, isSignatureTrackingUpdate);
      case EProfile.PANAMA:
        return this.bipaVoucher.builderLayoutVoucher(voucher, isSignatureTrackingUpdate);
      case EProfile.SALVADOR:
        return this.bisvVoucher.builderLayoutVoucher(voucher, isSignatureTrackingUpdate);
      default:
        return this.banpaisVoucher.builderLayoutVoucher(voucher, isSignatureTrackingUpdate);
    }
  }

  builderLayoutVoucherModalStep4(confirm: IOTDVoucherModal): IConfirmationModal {
    switch (this.profile) {
      case EProfile.HONDURAS:
        return this.modalBanpais.builderLayoutVoucherModal(confirm);
      case EProfile.PANAMA:
        return this.modalBipa.builderLayoutVoucherModal(confirm);
      case EProfile.SALVADOR:
        return this.modalBisv.builderLayoutVoucherModal(confirm);
      default:
        return this.modalBanpais.builderLayoutVoucherModal(confirm);
    }
  }

  buildOwnTransferPdfStep5(voucherPdf: IOTDVoucherPdf): IPrint {
    switch (this.profile) {
      case EProfile.HONDURAS:
        return this.banpaisPdf.buildOwnTransferPdf(voucherPdf);
      case EProfile.PANAMA:
        return this.bipaPdf.buildOwnTransferPdf(voucherPdf);
      case EProfile.SALVADOR:
        return this.bisvPdf.buildOwnTransferPdf(voucherPdf);
      default:
        return this.banpaisPdf.buildOwnTransferPdf(voucherPdf);
    }
  }
}
