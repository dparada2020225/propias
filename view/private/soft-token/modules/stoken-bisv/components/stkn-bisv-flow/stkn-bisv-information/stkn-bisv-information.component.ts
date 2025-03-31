import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { finalize, Subject } from 'rxjs';
import { HttpStatusCode } from 'src/app/enums/http-status-code.enum';
import { EProfile } from 'src/app/enums/profile.enum';
import { TypeTokenEnum } from 'src/app/enums/token.enum';
import { ERequestTypeTransaction } from 'src/app/enums/transaction-header.enum';
import { Profile } from 'src/app/models/security-option-modal';
import { FindServiceCodeService } from 'src/app/service/common/find-service-code.service';
import { UtilService } from 'src/app/service/common/util.service';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { environment } from 'src/environments/environment';
import dataSteps from '../../../data/stoken-bisv-steps-info.json';
import { typeUsers } from '../../../data/stoken-bisv-type-users';
import { EModalsInformation, EStokenNavigationProtection, EStokenScreenNames, ESTokenSettingsProperty, ETypeToken, EUsertTypeSToken } from '../../../enums/stkn-bisv.enum';
import { IAssignStknBisvResponse } from '../../../interfaces/stkn-bisv-devel.interface';
import { IStepsStokenBISV, IUserDataStoken } from '../../../interfaces/stkn-bisv.interface';
import { StknBisvNotAllowedModalService } from '../../../services/definition/stkn-bisv-not-allowed-modal.service';
import { StknBisvInfoExecService } from '../../../services/execution/stkn-bisv-info-exec.service';
import { StknBisvDevelService } from '../../../services/transaction/DEVEL/stkn-bisv-devel.service';
import { StknBisvUtilsService } from '../../../services/utils/stkn-bisv-utils.service';
import { FeatureManagerService } from 'src/app/service/common/feature-manager.service';

@Component({
  selector: 'byte-stkn-bisv-information',
  templateUrl: './stkn-bisv-information.component.html',
  styleUrls: ['./stkn-bisv-information.component.scss']
})
export class StknBisvInformationComponent implements OnInit {

  steps: IStepsStokenBISV[] = dataSteps;
  element!: HTMLElement;
  typeModal: string = 'security';
  typeUser: string = '';
  userName: string = '';
  userDataQR!: IUserDataStoken;
  stokenPreLogin: boolean = false;
  allowedAccess: boolean = false;
  path: string = 'new-user';
  arrTypeUser: string[] = typeUsers;
  typeAlert!: string;
  messageAlert!: string;
  profile!: Profile;
  tokenValue!: string
  typeUserError: boolean = false;
  //searchUser: any;
  featureFlagStokenNewUser: boolean = true;
  typeToken: string = '';

  constructor(
    private parametersService: ParameterManagementService,
    private router: Router,
    private route: ActivatedRoute,
    private notAllowedModalService: StknBisvNotAllowedModalService,
    private util: UtilService,
    private location: Location,
    private stokenBisvUtils: StknBisvUtilsService,
    private findServiceCode: FindServiceCodeService,
    private infoExecutionService: StknBisvInfoExecService,
    private develService: StknBisvDevelService,
    private stknBisvUtilsService: StknBisvUtilsService,
    private featureManagerService: FeatureManagerService
  ) {


    this.userDataQR = this.parametersService.getParameter('userDataQR');
    const getstokenPreLogin = this.parametersService.getParameter('stokenPreLogin');
    if (getstokenPreLogin) {
      this.stokenPreLogin = getstokenPreLogin.stokenPreLog;
    }

    let isBisv = environment.profile === EProfile.SALVADOR;
    this.featureFlagStokenNewUser = this.findServiceCode.validateCustomFeature(ESTokenSettingsProperty.STOKEN_NEW_USER, isBisv);
  }


  ngOnInit(): void {
    if(!this.validateFeatureManagement()) return;
    this.getTypeToken();
    this.getPath();
    this.getUserProfile();
    this.handlerOpenNotAllowedModal();
    this.util.hideLoader();
  }

  validateFeatureManagement(){
    if(!this.featureManagerService.stknBisvAllow()){
      this.router.navigate(['/home'])
      return false;
    }
    return true;
  }
  private getTypeToken() {
    this.typeToken = this.stknBisvUtilsService.getTypeToken();
  }

  /**
 * Obtain the route identifier to know which flow it should take
 * Example: identifier = migration so the flow should take is migration
 * only when the user is not in preLogin (logged sucessfull)
 */

  getPath() {
    if (!this.stokenPreLogin) {
      const arrUrl = this.router.url.split('/');
      this.path = arrUrl[arrUrl.length - 1];
    }
  }

  /**
 * Get data from Search User resolver when user is logged sucessfull (not in preLogin)
 */


  /**
   * Get user profile from Security Option resolver, when the user is not in preLogin (logged sucessfull)
   * or get user profile from Security Option Exposed resolver when the user is in preLogin (exposed flow)
   */


  getUserProfile() {
    if (!this.stokenPreLogin) {
      this.profile = this.route.snapshot.data['securityOption']?.[2] ?? {}
    } else {
      this.profile = this.route.snapshot.data['securityOptionExposed']?.[2] ?? {}
    }


    this.parametersService.sendParameters({
      profile: this.profile
    })
  }


  /**
   * When the user is in preLogin (exposed flow) verification modal is show.
   * If the searchUser status has an error should show an alert information.
   * When the user is not in preLogin (logged sucessfull) determines wich modal should we show
   * depends the type user. Example: if the typeUser = 301 show security method Modal.
   *
   */


  openModal() {
    if (this.stokenPreLogin) {
      this.validateToken();
      return;
    }

    if (this.typeToken === TypeTokenEnum.SOFT_TOKEN_DEVEL) {
      this.softTokenModal();
      return;
    }

        this.securityMethodModal();
     

  }


  validateToken() {
    //const token = this.controlForInputToken.value;
    const userDataQR: IUserDataStoken = this.parametersService.getParameter('userDataQR');
    const typeToken = this.getTypeToke();
    const typeClient = this.stknBisvUtilsService.getClientType();
    const username = this.stknBisvUtilsService.getUserName();//validar con el valor de userDataQR

    this.develService.assignTokenTypeExposed(username,typeToken, typeClient,  this.profile.codeArea )
      .pipe(finalize(() => this.util.hidePulseLoader()))
      .subscribe({
        next: (data) => {

          const res: IAssignStknBisvResponse = {
            status: 200,
            message: data?.responseMessage ?? '',
            responseCode: data.responseCode,
            error: null
          }
          this.goTo();
          //this.activeModal.close(res)
        },
        error: (error: HttpErrorResponse) => {

          if (error.status === HttpStatusCode.INVALID_TOKEN) {
            this.showAlert('error', error.error.message)
            return;
          }

          const errorRes: IAssignStknBisvResponse = {
            status: error?.status ?? 500,
            message: error?.error?.message ?? 'Internal_server_error',
            responseCode: '',
            error: error?.error
          }
          this.goTo();
          //this.activeModal.close(errorRes);

        }
      })
  }

  getTypeToke() {
    const typeToken = this.parametersService.getParameter("typeToken");

    if (typeToken === ETypeToken.TYPE_EMPTY || typeToken === ETypeToken.TYPE_NULL || typeToken === ETypeToken.TYPE_UNDEFINED) {
      return ETypeToken.TYPE_VALIDATE;
    }

    return typeToken;
  }
  /**
  * Use only whe the user is in preLogin (exposed flow)
  * Should call handlerValidationToken when the result promess is diferent to 'close'
  */


  modalVerification() {
      const modalRef = this.infoExecutionService.openModal(EModalsInformation.VERIFICATION_MODAL, true);
      if (!modalRef) return;
      this.handlerModalRef(modalRef);

    
  }

  /**
  * Use only when the user is not in preLogin (logged sucessfull)
  * and the user is associate to soft token.
  * Should call handlerValidationToken when the result promess is diferent to 'close'
  */


  softTokenModal() {
    const modalRef = this.infoExecutionService.openModal(EModalsInformation.SOFT_TOKEN_MODAL, true);

    if (!modalRef) return;
    this.handlerModalRef(modalRef);
  }

  handlerModalRef(modalRef: NgbModalRef) {
    modalRef.result.then((result) => {
      const dataRes = result ?? 'close'

      if (dataRes !== 'close') {
        this.util.showLoader();
        this.handlerValidateToken(result)
      }
    }, (error) => {
      console.log(error);
    })
  }

  /**
   * Handler validate token is call by the result promess on every modal works with token
   * and determines if should an alert or call goTo
   * @param data Object type IGenerateChangeQr, include status, data, message, error.
   *
   */

  handlerValidateToken(data: any) {

    if (data?.status === 200 && data?.responseCode === '204' && this.path === 'new-user') {
      this.goTo();
      return;
    }

    if (data?.status === 200 && data?.responseCode === '001' && this.path === 'migration') {
      this.goTo();
      return;
    }

   if (data?.status === 200 && data?.data?.code === '0' && this.path === 'change-device') { //Esta es la validacion original con la cual debe validarse
    //if (data?.status === 200  && this.path === 'change-device') {
      this.goTo();
      return;
    }


    this.showAlert('error', data?.message ?? 'Internal_server_error');
    this.util.hideLoader();

  }

  /**
  * If the user is in preLogin (exposed flow) will navigate to qrCode screen.
  * and if the user is not in preLogin (logged sucessfull) will navigate to qrCode screen
  * depends the route identifier to know which flow it should take
  */


  goTo() {
    this.parametersService.sendParameters({
      navigationProtectedParameter: EStokenNavigationProtection.QRCODE,
      pathToNavigate: this.path,
    });

    this.stokenBisvUtils.stokenRoutes(this.stokenPreLogin, this.path, EStokenScreenNames.QR);

  }

  /**
   * If the user is in preLogin (exposed flow) will make a log out.
   * if the user is not in preLogin (logged sucessfull) will navigate to home
   */


  back() {

    (this.stokenPreLogin)
      ? this.stokenBisvUtils.logOut()
      : this.router.navigate(['/home'])
        .catch((error) => this.location.back());

  }

  /**
   * NOT ALLOWED MODAL ONLY WILL SHOW WHEN THE USER IS PRIVATE HOME (LOGGED SUCESSFULL)
   * Obtains the type user and determines if the option is allow for him.
   * Example: If the user is 305 and want access to migration option, should show the information modal
   */


  handlerOpenNotAllowedModal() {
    if (this.stokenPreLogin) {
      this.allowedAccess = true;
      return;
    }

    const typeToken = this.parametersService.getParameter('typeToken');
    let informationModal = '';
    switch (this.path) {
      case 'migration':
      case 'new-device':
        this.allowedAccess = this.infoExecutionService.allowedAccessToMigration(typeToken);
        informationModal = 'alert-migration';
        break;
      case 'change-device':
        this.allowedAccess = this.infoExecutionService.allowedAccessToChangeDevice(typeToken);
        informationModal = 'alert-change-device';
        break;
      default:
        this.allowedAccess = false;
        break;
    }

    if (!this.allowedAccess) this.notAllowedModal(informationModal);

  }

  /**
  * Should call by openInformationModal(). Should create and open the information modal
  * @param informationModal message to show in modal
  */


  notAllowedModal(informationModal: string) {

    const modalRef = this.infoExecutionService.openModal(EModalsInformation.NOT_ALLOWED_MODAL, false)

    if (!modalRef) return;

    modalRef.componentInstance.data = this.notAllowedModalService.buildAlertInformation(informationModal);

    modalRef.result.then(() => {
      this.router.navigate(['/home'])
        .catch((error) => console.error(error));
    })
      .catch((error) => console.error(error));


  }


  showAlert(type: string, message: string) {
    this.typeAlert = type;
    this.messageAlert = message;
  }

  /**
  * Use only when the user is not in preLogin (logged sucessfull)
  * and the user is type token F or S.
  * Should call handlerValidationToken when the result promess is true
  */


  securityMethodModal() {
    const modal = this.infoExecutionService.openModal(EModalsInformation.SECURITY_MODAL, true);
    if (!modal) return;

    modal.componentInstance.tokenType = this.util.getTokenType();
    modal.componentInstance.typeTransaction = ERequestTypeTransaction.AUTHENTICATION;
    modal.componentInstance.executeService = this.handlerGenerateQRExecute.bind(this);

    modal.dismissed.subscribe((a) => {
      return;
    });

    modal.result
      .then((result) => {
        if (!result) {
          return;
        }
        this.handlerValidateToken(result);
      })
      .catch((error) => { });
  }

  /**
   * Only called by the securityMethodModal().
   * This method generate code QR from the generateQR service if the response status is 200.
   * Should show an alert in the modal if is a invalid token and the response status is 498
   * Should show an alert in the screen if generateQR service response status diferent to 200 or 498
   *
   * @returns observable type IGenerateChangeQr
   */



  handlerGenerateQRExecute() {
    this.util.showLoader();
    this.tokenValue = this.parametersService.getParameter('tokenMethodSecurity')
    const serviceResponse: Subject<IAssignStknBisvResponse> = new Subject();
    const typeToken = this.parametersService.getParameter("typeToken");
    const obs = serviceResponse.asObservable();
    const typeClient = this.stknBisvUtilsService.getClientType();
    this.develService.generateCodeQR(typeClient, this.tokenValue)
      // .pipe(finalize(() => this.util.hideLoader()))
      .subscribe({
        next: (res) => {
          const resQr = {
            status: 200,
            message: res.responseMessage,
            responseCode: res.responseCode,
            error: null
          };
          serviceResponse.next(
           resQr
          )
          this.parametersService.sendParameters({
            codeQrStknBisv: resQr
          })

        },
        error: (error: HttpErrorResponse) => {

          if (error.status === HttpStatusCode.INVALID_TOKEN) {
            serviceResponse.next({
              status: error?.error?.status ?? 500,
              message: error?.error?.message ?? 'Internal_server_error',
              responseCode: '',
              error
            })
            return;
          }

          serviceResponse.next({
            status: error?.error?.status ?? 500,
            message: error?.error?.message ?? 'Internal_server_error',
            responseCode: '',
            error
          })

        }
      })

    return obs;
  }


  /**
   * If the user is typeToken F or S and status 305,
   * will navigate to approve token screen (validate OTP)
   */
//funcionaba solo cuando era tipo T
  goToValidateOTP() {
    let breakProcess: boolean = false;
    const typeToken = this.parametersService.getParameter('typeToken');
    this.parametersService.sendParameters({
      navigationProtectedParameter: EStokenNavigationProtection.NEW_DEVICE,
      pathToNavigate: this.path,
      showBtnBack: "no_show"
    });

    if (!this.stokenPreLogin && this.path === 'migration') {
      if (typeToken === ETypeToken.TYPE_SMS || typeToken === ETypeToken.TYPE_F) {
        breakProcess = true;
        this.router.navigate([`/soft-token/${this.path}/approve-stoken`])
          .finally(() => this.util.showLoader())

      }


    };

    return breakProcess;

  }

  showBtnBack() {
    const typeToken = this.parametersService.getParameter('typeToken');
    const showBtnBack = this.parametersService.getParameter('showBtnBack') ?? 'show';
    if ((typeToken === ETypeToken.TYPE_NEW_USER_STOKEN ||typeToken === ETypeToken.TYPE_SMS ||typeToken === ETypeToken.TYPE_F ||typeToken === ETypeToken.TYPE_STOKEN_DEVEL)&& this.featureFlagStokenNewUser) {
      return showBtnBack === 'no_show';
    } else {
      return showBtnBack === 'show';
    }
  }


}
