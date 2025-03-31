import { Injectable } from '@angular/core';
import { HomePrivateService } from '../home-private.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthenticationService, StorageService } from '@adf/security';
import { UtilService } from '../../common/util.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { lastValueFrom } from 'rxjs';
import { ETypeToken } from 'src/app/view/private/soft-token/modules/stoken-bisv/enums/stkn-bisv.enum';

@Injectable({
  providedIn: 'root',
})
export class RcExecuteFlowService {
  constructor(
    private homePrivateService: HomePrivateService,
    private modalService: NgbModal,
    private authenticationService: AuthenticationService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private utils: UtilService,
    private storageService: StorageService
  ) {}

  async execute(URL: string) {
   
    this.utils.showLoader();
    this.homePrivateService.getTokenForRegionalConnection().subscribe({
      next: async (response) => {
        const { authenticateUserResult, country, installation, bank } = response;
        if (authenticateUserResult.token == '') {
          this.handleLogOut(true);
        }
        
        const userInfo = JSON.parse(this.storageService.getItem('userInformation'));
        const getTypeToken = this.utils.getTokenType();

        let typeToken;
        switch (getTypeToken) {
          case ETypeToken.TYPE_F: typeToken = 1;break;
          case ETypeToken.TYPE_SMS: typeToken = 2;break;
          case ETypeToken.TYPE_STOKEN: typeToken = 3;break;
          default: typeToken = 0;break;
        }

        await this.handleLogOut(false);

        this.homePrivateService.redirectToReginalConnection(URL, {
          Pais: Number(country),
          Banco: Number(bank),
          Instalacion: Number(installation),
          Usuario: userInfo.username,
          TipoUsuario: userInfo.userType == 'J' ? 2 : 1,
          TipoToken: typeToken,
          Token: authenticateUserResult.token || ''
        });
        
      },
      error: (error: HttpErrorResponse) => {
        this.handleLogOut(true);
      },
    });
    
  }

  async validateRegionalConnectionStatus(URL: string) {
    try {      
      await fetch(URL, {
        mode: 'no-cors'
      });
      return true;
    } catch (e) {
      console.log(e);
      this.setLoginStatus()
      return false;
    }
  }

  setLoginStatus() {
    this.homePrivateService.regionalConnectionLoginStatus('Error al establecer conexion con Conexion Regional').subscribe({
      next: () => {
        this.handleLogOut(true);
      },
      error: () => {
        this.handleLogOut(true);
      }
    })
  }

  private handleLogOut(err: boolean) {
    return new Promise((resolve) => {
      const authService = this.authenticationService.logout(err ? 'regional-connection-error' : undefined);
      lastValueFrom(authService).finally(() => {
        this.utils.hideLoader();
        resolve(true);
      });
    })
    
  }

}
