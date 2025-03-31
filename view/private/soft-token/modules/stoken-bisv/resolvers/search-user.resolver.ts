import { StorageService } from '@adf/security';
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, finalize } from 'rxjs';
import { SearchUserService } from 'src/app/view/private/soft-token/modules/stoken-bisv/services/transaction/HID/search-user.service';

@Injectable({
  providedIn: 'root'
})
export class SearchUserResolver implements Resolve<boolean> {

  constructor(
    private searchUserService: SearchUserService,
    private storage: StorageService,
    private spinner: NgxSpinnerService,
  ) { }

  resolve(): Observable<any> {
    this.spinner.show('main-spinner')
      .catch((error) => {});

    const username = this.storage.getItem("currentUser");

    return new Observable((observer) => {
      this.searchUserService.getUserStatus(username).pipe(finalize(() => observer.complete()))
        .subscribe({
          next: (data) => {
            const resData = {
              code: data.code,
              message: data.message,
              status: data.status,
              username: username,
            }
            observer.next(resData);
          },
          error: (error) => {
            //cambiar cuando no sea cambio de dispositivo real esta en notas
            const errorData = {
              code: '301',
              message: 'stoken-error-searchUser',
              status:  200,
              username: username
            }
            observer.next(errorData);
          }
        });
    });
  }
}


