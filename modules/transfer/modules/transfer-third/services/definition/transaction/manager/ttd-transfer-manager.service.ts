import { ILayout } from '@adf/components';
import { Injectable } from '@angular/core';
import { EProfile } from 'src/app/enums/profile.enum';
import { environment } from 'src/environments/environment';
import { ITTDForm } from '../../../../interfaces/third-transfer-definition.interface';
import {
  IPdfLayout,
  IThirdTransferConfirmationVoucher,
  IThirdTransferModal,
  IThirdTransferSampleVoucher,
} from '../../../../interfaces/third-transfer.interface';
import { TtdTransferConfirmService } from '../personalization/ttd-transfer-banpais-confirm.service';
import { TtdTransferFormService } from '../personalization/ttd-transfer-banpais-form.service';
import { TtdTransferModalService } from '../personalization/ttd-transfer-banpais-modal.service';
import { TtdTransferPdfService } from '../personalization/ttd-transfer-banpais-pdf.service';
import { TtdTransferVoucherService } from '../personalization/ttd-transfer-banpais-voucher.service';
import { TtdTransferBisvConfirmService } from '../personalization/ttd-transfer-bisv-confirm.service';
import { TtdTransferBisvFormService } from '../personalization/ttd-transfer-bisv-form.service';
import { TtdTransferBisvModalService } from '../personalization/ttd-transfer-bisv-modal.service';
import { TtdTransferBisvPdfService } from '../personalization/ttd-transfer-bisv-pdf.service';
import { TtdTransferBisvVoucherService } from '../personalization/ttd-transfer-bisv-voucher.service';

@Injectable({
  providedIn: 'root',
})
export class TtdTransferManagerService {
  constructor(
    private transferConfirm: TtdTransferConfirmService,
    private transferBisvConfirm: TtdTransferBisvConfirmService,

    private transferVoucher: TtdTransferVoucherService,
    private transferBisvVoucher: TtdTransferBisvVoucherService,

    private transferModal: TtdTransferModalService,
    private transferBisvModal: TtdTransferBisvModalService,

    private transferPdf: TtdTransferPdfService,
    private transferBisvPdf: TtdTransferBisvPdfService,

    private transferForm: TtdTransferFormService,
    private transferBisvForm: TtdTransferBisvFormService
  ) {}

  profile = environment.profile;

  buildTransferFormStep1(form: ITTDForm): ILayout {
    switch (this.profile) {
      case EProfile.HONDURAS:
      case EProfile.PANAMA:
        return this.transferForm.buildSimpleThirdTransferLayout(form);
      case EProfile.SALVADOR:
        return this.transferBisvForm.buildSimpleThirdTransferLayout(form);
      default:
        return this.transferForm.buildSimpleThirdTransferLayout(form);
    }
  }

  buildTransferVoucherStep2(voucherProperties: IThirdTransferSampleVoucher, isFavoriteWidget: boolean = true) {
    switch (this.profile) {
      case EProfile.HONDURAS:
      case EProfile.PANAMA:
        return this.transferVoucher.buildSampleVoucher(voucherProperties, isFavoriteWidget);
      case EProfile.SALVADOR:
        return this.transferBisvVoucher.buildSampleVoucher(voucherProperties, isFavoriteWidget);
      default:
        return this.transferVoucher.buildSampleVoucher(voucherProperties, isFavoriteWidget);
    }
  }

  buildTransferConfirmationStep4(confirmationProperties: IThirdTransferConfirmationVoucher, isSignatureTrackingUpdate?: boolean) {
    switch (this.profile) {
      case EProfile.HONDURAS:
      case EProfile.PANAMA:
        return this.transferConfirm.buildConfirmationVoucher(confirmationProperties, isSignatureTrackingUpdate);
      case EProfile.SALVADOR:
        return this.transferBisvConfirm.buildConfirmationVoucher(confirmationProperties, isSignatureTrackingUpdate);
      default:
        return this.transferConfirm.buildConfirmationVoucher(confirmationProperties, isSignatureTrackingUpdate);
    }
  }

  buildTransferModalStep5(modalProperties: IThirdTransferModal) {
    switch (this.profile) {
      case EProfile.HONDURAS:
      case EProfile.PANAMA:
        return this.transferModal.buildModalLayout(modalProperties);
      case EProfile.SALVADOR:
        return this.transferBisvModal.buildModalLayout(modalProperties);
      default:
        return this.transferModal.buildModalLayout(modalProperties);
    }
  }

  buildTransferPdfStep5(pdfProps: IPdfLayout) {
    switch (this.profile) {
      case EProfile.HONDURAS:
      case EProfile.PANAMA:
        return this.transferPdf.buildThirdTransferPdf(pdfProps);
      case EProfile.SALVADOR:
        return this.transferBisvPdf.buildThirdTransferPdf(pdfProps);
      default:
        return this.transferPdf.buildThirdTransferPdf(pdfProps);
    }
  }
}
