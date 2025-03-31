import { AdfAlertModalComponent } from '@adf/components';
import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TypeTokenEnum } from 'src/app/enums/token.enum';
import { ModalTokenComponent } from 'src/app/view/private/token/modal-token/modal-token.component';
import { environment } from 'src/environments/environment';
import { ModalStokenComponent } from '../../components/stkn-bisv-flow/stkn-bisv-information/modals/modal-stoken/modal-stoken.component';
import { ModalVerificationComponent } from '../../components/stkn-bisv-flow/stkn-bisv-information/modals/modal-verification/modal-verification.component';
import { EModalsInformation, EUsertTypeSToken } from '../../enums/stkn-bisv.enum';

@Injectable({
  providedIn: 'root'
})
export class StknBisvInfoExecService {

  constructor(
    private modalService: NgbModal,
  ) { }

  openModal(modalName: string, allowCloseModal = true) {

    const modalComponent = this.modalsComponents(modalName);
    const classScssModal = this.classesScssForModals(modalName);

    if (!modalComponent || !classScssModal) return;

    const modalParams = this.modalServiceParamsToOpen(classScssModal, allowCloseModal);

    return this.modalService.open(modalComponent, modalParams);
  }

  private modalServiceParamsToOpen(classScss: string, allowCloseModal: boolean) {

    const paramsModalService = {
      centered: true,
      windowClass: `${environment.profile || 'byte-theme'} ${classScss}`,
      size: `lg`,
    };

    if (!allowCloseModal) {
      paramsModalService['backdrop'] = 'static';
      paramsModalService['keyboard'] = false;
    }

    return paramsModalService;

  }

  private modalsComponents(modalName: string) {
    const modals = {
      [EModalsInformation.NOT_ALLOWED_MODAL]: AdfAlertModalComponent,
      [EModalsInformation.SECURITY_MODAL]: ModalTokenComponent,
      [EModalsInformation.SOFT_TOKEN_MODAL]: ModalStokenComponent,
      [EModalsInformation.VERIFICATION_MODAL]: ModalVerificationComponent
    };

    return modals[modalName];

  };

  private classesScssForModals(modalName: string) {
    const classesScss = {
      [EModalsInformation.NOT_ALLOWED_MODAL]: 'alert-modal stoken-information',
      [EModalsInformation.SECURITY_MODAL]: 'alert-modal',
      [EModalsInformation.SOFT_TOKEN_MODAL]: 'stoken-modal',
      [EModalsInformation.VERIFICATION_MODAL]: 'stoken-modal'
    };

    return classesScss[modalName];
  }


  allowedAccessToMigration(typeToken: string): boolean {

    if(typeToken === TypeTokenEnum.FISICO) return true;
    if(typeToken === TypeTokenEnum.SMS) return true;
    if(typeToken === TypeTokenEnum.SOFT_TOKEN ) return true;

    return false;
  }

  allowedAccessToChangeDevice(typeToken: string): boolean{

    if(typeToken === TypeTokenEnum.SOFT_TOKEN_DEVEL) return true;
    if(typeToken === TypeTokenEnum.SOFT_TOKEN) return true;

    return false;

  }

}