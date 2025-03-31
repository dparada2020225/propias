import { StorageService } from '@adf/security';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService) {
  }

  getUserInfo() {
    return new Observable(observer => {

      let userInformation = this.storageService.getItem('userInformation');

      if (!userInformation) {
        this.httpClient.get('/v1/agreement/agreement/user')
          .subscribe({
            next: (result) => {
              this.storageService.addItem('userInformation', JSON.stringify(result));

              observer.next(result);
              observer.complete();
            },
            error: (error: HttpErrorResponse) => {
              observer.error(error);

            }
          });
      } else {
        observer.next(JSON.parse(userInformation));
        observer.complete();
      }
    });
  }
}
