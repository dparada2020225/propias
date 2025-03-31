import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AverageBalancePrintService } from 'src/app/service/prints/average-balance-print.service';
import { AccountBalanceService } from 'src/app/service/private/account-balance/account-balance.service';
import { ErrorMessageService } from 'src/app/service/shared/error-message.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';

@Component({
  selector: 'byte-average-balance',
  templateUrl: './average-balance.component.html',
  styleUrls: ['./average-balance.component.scss'],
})
export class AverageBalanceComponent implements OnInit {
  accountBalance_json: any;
  proof: any;
  currencySymbol!: string;
  accountNo!: string;
  accountName!: string;
  state!: string;
  sub!: string;
  messageError: any;
  errorMessage: any;
  authorization = '';

  @Input() accountAverage;
  //RES de peticion
  datos: any;
  accountNameTwo: any;
  timestamp = new Date().getTime();

  constructor(
    public activeModal: NgbActiveModal,
    private accountService: AccountBalanceService,
    private error: ErrorMessageService,
    private pdf: AverageBalancePrintService,
    private spinner: NgxSpinnerService,
  ) {}

  ngOnInit(): void {
    /*
     * Metodo que se encarga de obtener la informacion del saldo promedio de la cuenta seleccionada.
     * se hace uso del servicio accountBalanceService el cual solicita el numero de cuenta que se obtiene con el
     * accountAverage el cual viene del componente padre mediante el @Input() y de esa forma llenar la data
     */
    this.accountService.getAccountBalance(this.accountAverage)
      .pipe(finalize(() => this.spinner.hide()))
      .subscribe({
        next: (data) => {
          this.authorization = data.reference;
          this.datos = data;
          this.accountNameTwo = data['accountDetail']['account'];
          this.accountBalance_json = data;
          this.currencySymbol = this.accountBalance_json['currencySymbol'];
          this.sub = this.accountBalance_json['subProduct'];

          const accountDetailResponse = this.accountBalance_json['accountDetail'];
          this.accountNo = accountDetailResponse['account'];
          this.accountName = accountDetailResponse['accountName'];
          this.state = accountDetailResponse['state'];
          this.proof = data['averageBalances'];
        },
        error: (error: HttpErrorResponse) => {
          this.messageError = error;
          this.errorMessage = this.error.getTranslateKey(error);
        }
      })
  }

  downloadPdf() {
    this.pdf.pdfGenerate(this.datos, this.authorization, `saldos_promedios_${this.accountNameTwo}_${this.timestamp}`, 268);
  }
}
