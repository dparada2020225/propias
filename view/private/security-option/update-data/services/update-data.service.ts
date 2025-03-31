import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { StorageService } from '@adf/security';
import { IResponseExpirationDate } from '../enum/update-data-status.interfaces';

@Injectable({
  providedIn: 'root',
})
export class UpdateDataService {
  constructor(private http: HttpClient, private parameterManagemen: ParameterManagementService, private storageService: StorageService) {}

  getExpirationDate() {
    return new Observable((observer) => {
      let resp: string = this.parameterManagemen.getParameter('codeInfo');

      if (!resp) {
        this.http.post<IResponseExpirationDate>('/v1/exposed/update-data/validate', null).subscribe({
          next: (result: IResponseExpirationDate) => {
            this.parameterManagemen.sendParameters({
              codeInfo: result.codeError,
            });
            observer.next(result.codeError);
            observer.complete();
          },
          error: (error) => {
              this.parameterManagemen.sendParameters({
                codeInfo : error.error.code
               });
               observer.error(error.error.code);
          }
        });
      }else {
        observer.next(JSON.parse(resp));
        observer.complete();
      }
    });
  }
}
