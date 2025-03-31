import { AdfAlertModalComponent } from '@adf/components';
import { Injectable } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UtilService } from 'src/app/service/common/util.service';
import { ParameterManagementService } from '../../../../../../service/navegation-parameters/parameter-management.service';
import { StknBisvConfirmModalComponent } from '../components/stkn-bisv-invitation/stkn-bisv-confirm-modal/stkn-bisv-confirm-modal.component';
import { StknBisvInfoModalComponent } from '../components/stkn-bisv-invitation/stkn-bisv-info-modal/stkn-bisv-info-modal.component';
import { StknBisvQrModalComponent } from '../components/stkn-bisv-invitation/stkn-bisv-qr-modal/stkn-bisv-qr-modal.component';
import { StknBisvValidateModalComponent } from '../components/stkn-bisv-invitation/stkn-bisv-validate-modal/stkn-bisv-validate-modal.component';
import { EInvitationModal } from '../enums/stkn-bisv.enum';
import { StknBisvExitModalService } from './definition/stkn-bisv-exit-modal.service';
import { StknBisvQrWarningModalService } from './definition/stkn-bisv-qr-warning-modal.service';
import { StknBisvDevelService } from './transaction/DEVEL/stkn-bisv-devel.service';
import { StknBisvUtilsService } from './utils/stkn-bisv-utils.service';
import { StknBisvHelpModalComponent } from '../components/stkn-bisv-help-modal/stkn-bisv-help-modal.component';
import { FeatureManagerService } from 'src/app/service/common/feature-manager.service';

@Injectable({
  providedIn: 'root'
})
export class StknBisvInvitationService {

  allowCloseModal: boolean = true;
  private userAlreadyCloseTheInvitation: boolean = false;

  constructor(
    private stknBisvUtilsService: StknBisvUtilsService,
    private modalService: NgbModal,
    private utils: UtilService,
    private exitModalSTKNService: StknBisvExitModalService,
    private qrWarningModalService: StknBisvQrWarningModalService,
    private stokenBisvDevelServices: StknBisvDevelService,
    private parameterManagementService: ParameterManagementService,
    private featureManagerService: FeatureManagerService
  ) { }


  showInvitationModal() {
    const featureManager = this.featureManagerService.stknBisvAllow();
    if (!featureManager) return;
    
    const allowUseStokenBISV = this.stknBisvUtilsService.allowUseStokenBISV();

    if (!allowUseStokenBISV) return;
    if (this.showInvitationOnlyOneTimeAfterLogin()) return;

    this.clearPropertyOnStorageIfUserIsNotInGracePeriod();
    this.checkIfUserIsInGracePeriod();
  }

  handlerOpenModal(modalName: string, userIsInGracePeriod: boolean) {

    const modal = this.modalsByName(modalName);
    const classByName = this.classByModalName(modalName);

    if (!modal || !classByName) return;

    this.openModal(modal, modalName, classByName, userIsInGracePeriod)

  }

  private addToStorageIfUserIsNotInGracePeriod() {
    this.parameterManagementService.sendParameters({
      userIsInGracePeriodStokenBisv: { hasGracePeriod: false }
    })
  }

  private addToStorageUserAlreadyCloseTheInvitation() {
    this.parameterManagementService.sendParameters({
      userAlreadyCloseTheInvitation: true
    })
  }

  private clearPropertyOnStorageIfUserIsNotInGracePeriod() {
    this.parameterManagementService.sendParameters({
      userIsInGracePeriodStokenBisv: undefined
    })
  }


  openModal(modal: any, modalName: string, classByName: string, userIsInGracePeriod: boolean) {
    
    if(this.verifyIfWarningModalIsOpen(modalName)) return;
    
    const modalRef = this.modalService.open(modal, {
      centered: true,
      windowClass: `${this.utils.getProfile() || 'byte-theme'} ${classByName}`,
      size: `lg`,
      backdrop: 'static',
      keyboard: userIsInGracePeriod
    });

    if(modalName === EInvitationModal.MODAL_QR_WARNING){
      this.addToStorageIfmodalWarningQRIsAlreadyOpen();
    }


    this.useModalRefByModal(modalRef, modalName, userIsInGracePeriod);


  }

  private verifyIfWarningModalIsOpen(modalName: string): boolean{

    const modalWarningQRAlreadyOpen = this.parameterManagementService?.getParameter('modalWarningQRAlreadyOpen');

    if (modalName === EInvitationModal.MODAL_QR_WARNING && modalWarningQRAlreadyOpen) return true;

    return false;
  }


  useModalRefByModal(modalRef: NgbModalRef, modalName: string, userIsInGracePeriod: boolean) {

    switch (modalName) {
      case EInvitationModal.MODAL_INFORMATION:
        modalRef.componentInstance.showRememberLaterBtn = userIsInGracePeriod;
        modalRef.componentInstance.allowCloseModal = userIsInGracePeriod;

        modalRef.result.then((data) => {
          if (data === 'close') {
            this.addToStorageUserAlreadyCloseTheInvitation();
          }
        }).catch((error) => {
          if (error === 0 || error === '0') {
            this.addToStorageUserAlreadyCloseTheInvitation();
          }
        });

        return;
      case EInvitationModal.MODAL_EXIT:
        modalRef.componentInstance.data = this.exitModalSTKNService.buildAlertToLogOut();
        modalRef.result.then(() => {
          this.stknBisvUtilsService.logOut();
        })
          .catch(() => { })
        return;
      case EInvitationModal.MODAL_QR_WARNING:
        modalRef.componentInstance.data = this.qrWarningModalService.buildAlertWarningQR();
        modalRef.result.then((result) => {
          if (result) {
            this.parameterManagementService.sendParameters({
              modalWarningQRAlreadyOpen: undefined
            })
          }
        })

        return;
      case EInvitationModal.MODAL_QR:
      case EInvitationModal.MODAL_TOKEN:
        modalRef.componentInstance.allowCloseModal = userIsInGracePeriod;
        modalRef.result.then((data) => {
          if (data === 'close') {
            this.addToStorageUserAlreadyCloseTheInvitation();
          }
        }).catch((error) => {
          if (error === 0 || error === '0') {
            this.addToStorageUserAlreadyCloseTheInvitation();
          }
        });

        return;

    }

  }

  modalsByName(modalName: string) {

    const modals = {
      [EInvitationModal.MODAL_INFORMATION]: StknBisvInfoModalComponent,
      [EInvitationModal.MODAL_QR]: StknBisvQrModalComponent,
      [EInvitationModal.MODAL_TOKEN]: StknBisvValidateModalComponent,
      [EInvitationModal.MODAL_TOKEN_HELP]: StknBisvHelpModalComponent,
      [EInvitationModal.MODAL_CONFIRMATION]: StknBisvConfirmModalComponent,
      [EInvitationModal.MODAL_EXIT]: AdfAlertModalComponent,
      [EInvitationModal.MODAL_QR_WARNING]: AdfAlertModalComponent
    };

    return modals[modalName];

  }

  classByModalName(modalName: string) {

    const classesByModal = {
      [EInvitationModal.MODAL_TOKEN_HELP]: 'stoken-HelpModal',
      [EInvitationModal.MODAL_CONFIRMATION]: 'stkn-bisv-confirm-modal',
      [EInvitationModal.MODAL_EXIT]: 'alert-modal stoken-exit-modal',
      [EInvitationModal.MODAL_QR_WARNING]: 'alert-modal stoken-information',
    }

    return classesByModal[modalName] ?? 'stoken-bisv-invitation';
  }

  checkIfUserIsInGracePeriod() {

    this.stokenBisvDevelServices.consultGracePeriod()
      .subscribe({
        next: (res) => {
          if (res.hasGracePeriod === false) {
            this.addToStorageIfUserIsNotInGracePeriod();
          }

          this.handlerOpenModal(EInvitationModal.MODAL_INFORMATION, res.hasGracePeriod)
        },
        error: (error) => console.log(error)
      })

  }

  
  showInvitationOnlyOneTimeAfterLogin() {
    return this.parameterManagementService?.getParameter('userAlreadyCloseTheInvitation');
  }
  private addToStorageIfmodalWarningQRIsAlreadyOpen() {
    this.parameterManagementService.sendParameters({
      modalWarningQRAlreadyOpen: true
    })
  }

}

