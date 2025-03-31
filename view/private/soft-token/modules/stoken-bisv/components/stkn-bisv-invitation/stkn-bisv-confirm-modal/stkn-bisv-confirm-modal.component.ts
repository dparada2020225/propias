import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import BottomIMGSConfirmation from '../../../../../../soft-token/modules/stoken-bisv/data/confirmation-bottom-images.json';
import TopIMGSConfirmation from '../../../../../../soft-token/modules/stoken-bisv/data/confirmation-top-images.json';
import { EInvitationModal } from '../../../enums/stkn-bisv.enum';
import { StknBisvInvitationService } from '../../../services/stkn-bisv-invitation.service';
import { IImagesData } from '../../../interfaces/stkn-bisv.interface';

@Component({
  selector: 'byte-stkn-bisv-confirm-modal',
  templateUrl: './stkn-bisv-confirm-modal.component.html',
  styleUrls: ['./stkn-bisv-confirm-modal.component.scss']
})
export class StknBisvConfirmModalComponent {

  topIMGConfirm: IImagesData[] = TopIMGSConfirmation;
  bottomIMGConfirm: IImagesData[] = BottomIMGSConfirmation;

  constructor(
    private activeModal: NgbActiveModal,
    private invitationStknService : StknBisvInvitationService

  ) { }

  close(close?: boolean) {
    this.activeModal.close(close);
  }

  openExitModal(){
    this.close();
    this.invitationStknService.handlerOpenModal(EInvitationModal.MODAL_EXIT, false);
  }
  
}
