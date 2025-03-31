import { AdfAlertModalComponent } from '@adf/components';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { UtilService } from 'src/app/service/common/util.service';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { environment } from 'src/environments/environment';
import { EStokenBisvQrCodesDEVEL, EStokenNavigationProtection, EStokenScreenNames } from '../../../enums/stkn-bisv.enum';
import { IUserDataStoken } from '../../../interfaces/stkn-bisv.interface';
import { StknBisvQrWarningModalService } from '../../../services/definition/stkn-bisv-qr-warning-modal.service';
import { StknBisvDevelService } from '../../../services/transaction/DEVEL/stkn-bisv-devel.service';
import { StknBisvUtilsService } from '../../../services/utils/stkn-bisv-utils.service';

@Component({
  selector: 'byte-stkn-bisv-qr-screen',
  templateUrl: './stkn-bisv-qr-screen.component.html',
  styleUrls: ['./stkn-bisv-qr-screen.component.scss']
})
export class StknBisvQrScreenComponent implements OnInit {

  qrCode!: string;
  userDataQR!: IUserDataStoken;
  stokenPreLogin: boolean = false;
  qrCodeError: boolean = false;
  path: string = '';
  typeAlert!: string;
  messageAlert!: string;
  currentUserName: string = '';
  clientType: string = '';

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private parameterManager: ParameterManagementService,
    private spinner: NgxSpinnerService,
    private qrcodeWarningModalService: StknBisvQrWarningModalService,
    private stokenBisvUtils: StknBisvUtilsService,
    private develService: StknBisvDevelService,
    private utils: UtilService

  ) {
    const getStokenPreLogin = this.parameterManager.getParameter('stokenPreLogin');

    if (getStokenPreLogin) {
      this.stokenPreLogin = getStokenPreLogin.stokenPreLog;
    }



  }

  ngOnInit(): void {
     
    this.utils.showLoader();
    history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', () => {
      history.pushState(null, '', window.location.href);
    });

    this.currentUserName = this.stokenBisvUtils.getUserName();
    this.clientType = this.stokenBisvUtils.getClientType();
    this.getPath();
    this.requestQr();
  }


  /**
* If the user is in preLogin (exposed flow) will navigate to approve soft token screen.
* and if the user is not in preLogin (logged sucessfull) will navigate to approve soft token screen
* depends the route identifier to know which flow it should take
*/


  goTo() {

    this.parameterManager.sendParameters({
      navigationProtectedParameter: EStokenNavigationProtection.NEW_DEVICE,
    });

    this.stokenBisvUtils.stokenRoutes(this.stokenPreLogin, this.path, EStokenScreenNames.TOKEN_APPROVE);

  }

  /**
  * Check if the user correctly scanned their qr code
  * to do this call searchUser service
  */

  private handlerVerifyIfQRHasBeenScann() {

    return this.stokenPreLogin
      ? this.develService.validateStatusQRExposed(this.currentUserName, this.clientType)
      : this.develService.validateStatusQR(this.currentUserName, this.clientType);


  }


  verifyIfQRHasBeenScann() {

    const serviceToVerifyStatus = this.handlerVerifyIfQRHasBeenScann();

    this.utils.showLoader();
    serviceToVerifyStatus
      .subscribe({
        next: res => { },
        error: (error: HttpErrorResponse) => this.handlerErrorFromVerifyIfQRHasBeenScann(error)
      })

  }

  handlerErrorFromVerifyIfQRHasBeenScann(error: HttpErrorResponse) {

    if (error?.error?.code === EStokenBisvQrCodesDEVEL.QR_SYNCHRONIZED_SUCCESS) {
      this.goTo();
      return;
    }


    this.showAlert('error', error?.error?.message ?? 'Error getting QR status');
    this.openInformationModal();
    this.utils.hideLoader();


  }

  /**
 * Only called by handlerUserStatus()
 * This modal should be show before the user click the continue button
 */


  openInformationModal() {
    const modalRef = this.modalService.open(AdfAlertModalComponent, {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      windowClass: `${environment.profile || 'byte-theme'} alert-modal stoken-information`,
      size: `lg`,
    });

    modalRef.componentInstance.data = this.qrcodeWarningModalService.buildAlertWarningQR();

  }


  handleErrorCode(error: HttpErrorResponse) {
    this.qrCodeError = true;
    this.showAlert('error', error?.error?.message ?? 'Soft_token_services_error');
    this.hideSpinner();
  }

  hideSpinner() {
    this.spinner.hide("main-spinner")
      .catch((error) => { });
  }

  showSpinner() {
    this.spinner.show("main-spinner")
      .catch((error) => { });
  }

  showAlert(type: string, message: string) {
    this.typeAlert = type;
    this.messageAlert = message;
  }

  getPath() {
    const getStokenPreLogin = this.parameterManager.getParameter('pathToNavigate');
    this.path = getStokenPreLogin;
  }

  back() {
    this.showSpinner();
    this.resetStorage();
    this.stokenBisvUtils.logOut();
  }

  resetStorage() {
    this.parameterManager.sendParameters({
      navigationProtectedParameter: null,
      navigateStateParameters: null,
    });
  }

  private handlerRequestQr() {
    const clientType = this.stokenBisvUtils.getClientType();
    const codeQrStknBisv = this.parameterManager.getParameter('codeQrStknBisv');
    if(!this.stokenPreLogin && !codeQrStknBisv){
      return this.develService.generateCodeQR(clientType);
    }

    if(!this.stokenPreLogin && codeQrStknBisv.status === 200 && !codeQrStknBisv.error){
      this.generateQRFromBase64(codeQrStknBisv.message);
      this.parameterManager.sendParameters({
        codeQrStknBisv: null
      });
      return false;
    }
    if(!this.stokenPreLogin &&  codeQrStknBisv.status !== 200 && codeQrStknBisv.error){
      this.handleErrorCode(codeQrStknBisv.error)
      this.parameterManager.sendParameters({
        codeQrStknBisv: null
      });
      return false;
    }
    if(this.stokenPreLogin){
      return this.develService.generateCodeQRExposed(this.currentUserName, clientType)
      
    }
return false;
    /*return this.stokenPreLogin
      ? this.develService.generateCodeQRExposed(this.currentUserName, clientType)
      : this.develService.generateCodeQR(clientType);*/

  }

  requestQr() {
    const serviceToRequestQr = this.handlerRequestQr();
    if(!serviceToRequestQr) return;

    serviceToRequestQr
      .subscribe({
        next: res => this.generateQRFromBase64(res.responseMessage),
        error: error => this.handleErrorCode(error)
      })
  }

  private generateQRFromBase64(code: string) {
    this.qrCode = this.stokenBisvUtils.generateSRCfromBase64(code) ?? ''
  }

  clickOnRetryMessage(retry: boolean) {

    if (!retry) return;

    this.ngOnInit();
  }


}
