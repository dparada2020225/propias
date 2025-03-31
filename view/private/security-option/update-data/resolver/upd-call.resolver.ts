import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, catchError, finalize, of } from 'rxjs';
import { IResponseExpirationDate } from '../enum/update-data-status.interfaces';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { FeatureManagerService } from 'src/app/service/common/feature-manager.service';
import { UpdateDataService } from '../services/update-data.service';

@Injectable({
  providedIn: 'root'
})
export class UpdCallResolver implements Resolve<any> {
  response!: IResponseExpirationDate

  constructor(
    private updateDataService: UpdateDataService,
    private parameterManager: ParameterManagementService,
    private featureManagerService: FeatureManagerService,
  ){}

  resolve(): Observable<any> {



    const clientType = this.parameterManager.getParameter('clientType');
    if (clientType === "N" && this.featureManagerService.updateDataAllow()) {
      return new Observable((observer) => {


        this.updateDataService.getExpirationDate().pipe(finalize(() => observer.complete()))
          .subscribe({
            next: (data) => {
              observer.next(data);
            },
            error: (error) => {
              observer.next(error);
            }
          });
      });
    }

    return new Observable((observer) => {


      of(false).pipe(finalize(() => observer.complete()))
        .subscribe({
          next: (data) => {
            this.response = {
              status: 0,
              handler: "",
              reference: "",
              codeError: "",
              descriptionError: ""
            }
            observer.next(this.response);
          },
        });
    });


  }
}
