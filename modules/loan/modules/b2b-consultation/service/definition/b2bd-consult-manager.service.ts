import { Injectable } from '@angular/core';
import { B2bdConsultDefinitionService } from './b2bd-consult-definition.service';
import { IB2bConsultationDetail } from '../../interfaces/b2b-consultation.interface';
import { B2bdConsultFormService } from './b2bd-consult-form.service';
import { IB2BDConsultModalParameters } from '../../interfaces/b2bd-consult-modal.interface';
import { B2bdConsultModalService } from './b2bd-consult-modal.service';
import { B2bdConsultVoucherService } from './b2bd-consult-voucher.service';

@Injectable({
  providedIn: 'root'
})
export class B2bdConsultManagerService {

  constructor(
    private b2bConsultDefinition: B2bdConsultDefinitionService,
    private formDefinition: B2bdConsultFormService,
    private modalDefinition: B2bdConsultModalService,
    private voucherDefinition: B2bdConsultVoucherService,
  ) { }

  buildPdfLayout(accountB2B: IB2bConsultationDetail, currency: string) {
    return this.b2bConsultDefinition.buildPDfFile(accountB2B, currency);
  }

  buildVoucherLayout(back2back: IB2bConsultationDetail, currency: string) {
    return this.voucherDefinition.builderVoucherLayout(back2back, currency);
  }

  buildModalLayout(voucherProps: IB2BDConsultModalParameters) {
    return this.modalDefinition.builderModalLayout(voucherProps);
  }

  buildFormLayout() {
    return this.formDefinition.builderFormLayout();
  }
}
