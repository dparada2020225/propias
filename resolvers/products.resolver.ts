import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { HomePrivateService } from '../service/private/home-private.service';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProductsResolver implements Resolve<any> {
  constructor(private spinner: NgxSpinnerService, private homePrivateService: HomePrivateService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.spinner.show('main-spinner');

    return new Observable((observer) => {
      this.homePrivateService
        .getAvailableProducts()
        .pipe(finalize(() => observer.complete()))
        .subscribe({
          next: (response) => {
            observer.next(response);
          },
          error: (error: HttpErrorResponse) => {
            console.error(error);
            observer.next([]);
          }
        })
    });
  }
}
