import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TypeTokenEnum } from 'src/app/enums/token.enum';
import { EStokenBisvQrCodesDEVEL, EStokenBisvValidationMemerbership, EStokenNavigationProtection, EStokenRoutesNewUser } from 'src/app/view/private/soft-token/modules/stoken-bisv/enums/stkn-bisv.enum';
import { ParameterManagementService } from '../../navegation-parameters/parameter-management.service';
import { Subject } from 'rxjs';
import { StknBisvDevelService } from 'src/app/view/private/soft-token/modules/stoken-bisv/services/transaction/DEVEL/stkn-bisv-devel.service';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StknBisvHandlerService {

  constructor(private router: Router,
    private develServices: StknBisvDevelService,
    private parameterManager: ParameterManagementService
  ) { }
  handlerStoken(typeToken: string, username: string, clientType: string, tokenControl: string){
    if(typeToken === TypeTokenEnum.NEW_USER){
      this.handlerNewUser(typeToken, tokenControl);
      return;
    }
   return this.validateStokenAfiliationDevel(username, clientType);
  }

  private handlerNewUser(typeToken: string, tokenControl: string){
    this.parameterManager.sendParameters({
        stokenPreLogin: { stokenPreLog: true },
        newUserValidation: { typeToken: typeToken,
        tokenControl: tokenControl
       }
    })

    this.router.navigate([EStokenRoutesNewUser.WELCOME_SCREEN]).catch(error=> console.log(error))

  }


  private validateStokenAfiliationDevel(userName: string, clientType: string) {
    const serviceResponse: Subject<any> = new Subject();
    const obs = serviceResponse.asObservable();

    this.develServices.validateStokenAfiliation()
      .subscribe({
        next: (res) => {
          if (res.estado === EStokenBisvValidationMemerbership.INACTIVE) {
            const errorOnValidateQrService = this.retakeTheLastStepAffiliation(userName, clientType);

            if (errorOnValidateQrService) {
              errorOnValidateQrService.subscribe({
                error: error => serviceResponse.error(error)
              });
              return;
            }
          } else {
            serviceResponse.next({
              status: 200,
              message: '',
              userName: res.usuario,
              stokenStatus: res.estado,
              typeStoken: 'DEVEL',
              error: null
            })
          }
        },
        error: (error: HttpErrorResponse) => {
          serviceResponse.error({
            status: error?.error?.status ?? 500,
            message: error?.error?.message ?? 'Soft_Token_Services_Error',
            userName: null,
            stokenStatus: null,
            typeStoken: 'DEVEL',
            error: error?.error
          })
        }
      });

    return obs;
  }
  private retakeTheLastStepAffiliation(userName: string, clientType:string) {
    const serviceResponse: Subject<any> = new Subject();
    const obs = serviceResponse.asObservable();

    this.develServices.validateStatusQRExposed(userName, clientType)
      .subscribe({
        next: res => { },
        error: (error: HttpErrorResponse) => {
          const unhandlerError = this.handlerErrorValidateQR(error);

          if (unhandlerError) {
            serviceResponse.error(unhandlerError);
          }
        }
      });

    return obs;
  }

  private handlerErrorValidateQR(error: HttpErrorResponse) {

    if (error?.status !== 400) {
      return {
        status: error?.error?.status ?? 500,
        message: error?.error?.message ?? 'Soft_Token_Services_Error',
        userName: null,
        stokenStatus: null,
        typeStoken: 'DEVEL',
        error: error?.error
      }
    }

    console.log(error);

    switch (error?.error?.code) {
      case EStokenBisvQrCodesDEVEL.QR_SYNCHRONIZED_SUCCESS:
        this.addParametersToStorage(true, true);
        this.router.navigate([EStokenRoutesNewUser.TOKEN_APPROVE_SCREEN])
          .catch(() => { });
        return;
      case EStokenBisvQrCodesDEVEL.ERROR_CHECKING_QR_STATUS:
      case EStokenBisvQrCodesDEVEL.QR_EXPIRED:
      case EStokenBisvQrCodesDEVEL.ERROR_SERVICE_INITAL:
      case EStokenBisvQrCodesDEVEL.QR_ASSIGNED_TO_DEVICE:
        this.addParametersToStorage(false, true);
        this.router.navigate([EStokenRoutesNewUser.WELCOME_SCREEN])
          .catch(() => { });
        return;
      default:
        return {
          status: error?.error?.status ?? 500,
          message: error?.error?.message ?? 'Soft_Token_Services_Error',
          userName: null,
          stokenStatus: null,
          typeStoken: 'DEVEL',
          error: error?.error
        }
    }

  }

  private addParametersToStorage(addNavigationParameter: boolean, stokenPreLog: boolean) {

    const dataStoken = {
      showIncompleteAfiliationModal: true,
      logOutUsingReturnBtnOnTokenApprove: true,
      navigationProtectedParameter: EStokenNavigationProtection.WELCOME,
      stokenPreLogin: { stokenPreLog },
    };

    if (addNavigationParameter) {
      dataStoken['navigationProtectedParameter'] = EStokenNavigationProtection.NEW_DEVICE;
    }

    this.parameterManager.sendParameters(dataStoken);;
  }

}
