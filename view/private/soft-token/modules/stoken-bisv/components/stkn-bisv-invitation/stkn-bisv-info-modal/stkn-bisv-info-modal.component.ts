import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import dataSteps from '../../../data/stoken-bisv-steps-info.json';
import { EInvitationModal } from '../../../enums/stkn-bisv.enum';
import { StknBisvInvitationService } from '../../../services/stkn-bisv-invitation.service';
import { StknBisvUtilsService } from '../../../services/utils/stkn-bisv-utils.service';
import { IStepsStokenBISV } from '../../../interfaces/stkn-bisv.interface';

@Component({
  selector: 'byte-stkn-bisv-info-modal',
  templateUrl: './stkn-bisv-info-modal.component.html',
  styleUrls: ['./stkn-bisv-info-modal.component.scss']
})
export class StknBisvInfoModalComponent {

  dataSteps: IStepsStokenBISV[] = dataSteps;
  @Input() showRememberLaterBtn: boolean = true;
  @Input() allowCloseModal: boolean = true;


  constructor(
    private activeModal: NgbActiveModal,
    private invitationStknService : StknBisvInvitationService,
    private stknBisvUtilsService: StknBisvUtilsService,
  ) { }

  close(close?: boolean) {
    if(!this.allowCloseModal) return;
    this.activeModal.close(close);
  }

  next(){
    const hasGracePeriod = this.stknBisvUtilsService.validateIfUserIsInGracePeriod();
    this.activeModal.close(close);
    this.invitationStknService.handlerOpenModal(EInvitationModal.MODAL_QR, hasGracePeriod);
  }

  back(){
    this.activeModal.close();
  }
  
}
