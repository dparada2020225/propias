import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ReservationDetailPrintService } from 'src/app/service/prints/reservation-detail-print.service';
import { AccountBalanceService } from 'src/app/service/private/account-balance/account-balance.service';
import { ErrorMessageService } from 'src/app/service/shared/error-message.service';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'byte-reservation-detail',
  templateUrl: './reservation-detail.component.html',
  styleUrls: ['./reservation-detail.component.scss']
})
export class ReservationDetailComponent implements OnInit {

  numberAccount: any;
  nameAccount: any;
  type: any;
  currency: any;
  movements: any;
  total: any;
  messageError: any;
  errorMessage: any;
  authorization = "";

  @Input() reservationType;
  @Input() accountReservation;
  @Input() aliasName;
  datos: any;
  accountName: any;
  timestamp = new Date().getTime();


  constructor(
    public activeModal: NgbActiveModal,
    private accountService: AccountBalanceService,
    private pdf: ReservationDetailPrintService,
    private error: ErrorMessageService
  ) {
  }

  ngOnInit(): void {

    /*
    * Metodo con el cual se obtiene la informacion de las reservaciones hechas segun el numero de cuenta y el tipo de reserva
    * Las cuales vienen desde el componente padre haciendo uso de @Input() que es account-balance.
    */
    this.accountService.getDetailReservation(this.accountReservation, this.reservationType)
      .subscribe({
        next: (data) => {
          this.authorization = data.ref;
          this.datos = data;
          this.accountName = data['mask'];
          this.numberAccount = data['mask'];
          this.nameAccount = data['name'];
          this.type = data['type'];
          this.currency = data['currency'];
          this.movements = data['movement'];
          this.total = data['total'];
        },
        error: (error: HttpErrorResponse) => {
          this.messageError = error;
          this.errorMessage = this.error.getTranslateKey(error);
        }
      });
  }

  downloadPdf() {
    this.pdf.pdfGenerate(this.datos, this.authorization, `cheques_en_reserva_${this.accountName}_${this.timestamp}`, 268);
  }
}
