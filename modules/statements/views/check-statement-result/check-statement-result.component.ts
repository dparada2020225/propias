import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import 'imask/esm/masked/number';
import moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize, first } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { EInputType, MaskOptionsBuilder } from '@adf/components';
import { CheckStatementExcelService } from '../../services/check-statement-excel.service';
import { CheckStatementPrintService } from '../../services/check-statement-print.service';
import { StyleManagementService } from 'src/app/service/common/style-management.service';
import { TokenizerAccountsService } from 'src/app/service/token/tokenizer-accounts.service';
import { BusinessNameService } from 'src/app/service/shared/business-name.service';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { StatementsService } from 'src/app/service/shared/statements.service';
import { Option } from 'src/app/models/security-option-modal';
import { CheckStatementDetailModalComponent } from '../check-statement-detail-modal/check-statement-detail-modal.component';
import { CheckStatementDetailNotesModalComponent } from '../check-statement-detail-notes-modal/check-statement-detail-notes-modal.component';
import { statementsTitleByProduct } from '../../interfaces/statements.interface';
import { EProfile } from '../../../../enums/profile.enum';
import { StatementsUtilsService } from '../../services/statements-utils.service';
import { UtilService } from '../../../../service/common/util.service';
import { HttpErrorResponse } from '@angular/common/http';



const OPTIONS_SEARCH = [
  {
    name: 'label.statements.default',
    value: 'default'
  },
  {
    name: 'label.statements.transaction',
    value: 'transaction'
  },
  {
    name: 'label.statements.reference',
    value: 'reference'
  },
  {
    name: 'label.statements.value',
    value: 'value'
  },
];

const OPTIONS_VALUES = [
  {
    name: 'label.statements.to-select',
    value: 'default'
  },
  {
    name: 'label.statements.equals-than',
    value: 'equalsThan'
  },
  {
    name: 'label.statements.greather-than',
    value: 'greatherThan'
  },
  {
    name: 'label.statements.lower-than',
    value: 'lowerThan'
  },
  {
    name: 'label.statements.greather-or-equals-than',
    value: 'greatherOrEqualsThan'
  },
  {
    name: 'label.statements.lower-or-equals-than',
    value: 'lowerOrEqualsThan'
  },
];

/**
 * @author Sebastian Chicoma S.
 *
 * Componente utilizado para mostrar el result de búsqueda de la pantalla Estado de cuentas (Cheques)
 */
@Component({
  selector: 'byte-check-statement-result',
  templateUrl: './check-statement-result.component.html',
  styleUrls: ['./check-statement-result.component.scss']
})
export class CheckStatementResultComponent implements OnInit {

  emptyResult = false;
  filters: any;
  information: any;
  options = OPTIONS_SEARCH;
  transactions: any[] = [];
  transactionsInOperations: any[] = [];
  mapTransactions = {};
  type = 'custom';
  values = OPTIONS_VALUES;
  businessName = "";
  timestamp = new Date().getTime();
  typeText: EInputType = EInputType.TEXT;

  operations: any[] = [];
  amounts = {
    'debit': { description: 'label.statements.debits', transactionAmount: 0, amount: 0 },
    'credit': { description: 'label.statements.credits', transactionAmount: 0, amount: 0 },
    'paid-checks': { description: 'label.statements.paid-checks', transactionAmount: 0, amount: 0 }
  };
  datos: any;
  accounts!: Array<any>;
  reference = '';
  search = 'default';
  transaction = 'default';
  valueOption = 'default';
  valueSearch = '';
  product!: string;
  title!: string;
  authorization = "";
  profile: string = environment.profile;
  initialDate;
  finalDate;
  account;

  imaskOptionsForValue = new MaskOptionsBuilder()
    .mask({
      mask: Number, radix: '.',
      mapToRadix: [',']
    }).build()

  imaskOptionsForReference = new MaskOptionsBuilder()
    .mask({
      mask: /^\d+$/
    }).build()



  constructor(
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private modalService: NgbModal,
    private pdf: CheckStatementPrintService,
    private reporter: CheckStatementExcelService,
    private spinner: NgxSpinnerService,
    private statementsService: StatementsService,
    private translateService: TranslateService,
    private parameterManagement: ParameterManagementService,
    private businessNameService: BusinessNameService,
    private tokenizerEncrypt: TokenizerAccountsService,
    private styleManagement: StyleManagementService,
    private statementUtils: StatementsUtilsService,
    private utils: UtilService,
  ) {
    this.getInitialState();
    this.parseTransactions();

    if (!this.statementsService.data) {
      this.getDataToBuildInformation();
      return;
    } else {
      const data = this.statementsService.data.data;
      this.authorization = data.authorizationNumber ? data.authorizationNumber : '';
      this.buildInformation(this.statementsService.data.filters);
    }

    if (!this.product) {
      this.product = this.parameterManagement.getParameter('product');
    }

    this.title = statementsTitleByProduct[this.product] || this.product;
  }

  ngOnInit(): void {
    this.statementsService.getMenmonics('NOTES')
      .pipe(first(), finalize(() => this.calculate()))
      .subscribe((result: any) => {
        for (const obj of result) {
          const code = obj.code.trim();

          this.mapTransactions[code] = 'NOTES';
          this.transactions.push({ name: obj.description, value: code });
        }
      });

    this.statementsService.getMenmonics('DEPOSIT_DETAIL')
      .pipe(first(), finalize(() => this.calculate()))
      .subscribe((result: any) => {
        for (const obj of result) {
          const code = obj.code.trim();

          this.mapTransactions[code] = 'DEPOSIT_DETAIL';
          this.transactions.push({ name: obj.description, value: code });
        }
      });
  }

  getInitialState() {
    this.parameterManagement.getSharedParameter()
      .subscribe({
        next: (data: any) => {
          if (!data) { return; }

          this.product = data['product'];
          this.initialDate = data['initialDate'];
          this.finalDate = data['finalDate'];
          this.account = data['account'];
        },
        error: () => {},
      });


    this.account = this.parameterManagement.getParameter('account');
    this.product = this.parameterManagement.getParameter('product');
    this.initialDate = this.parameterManagement.getParameter('initialDate');
    this.finalDate = this.parameterManagement.getParameter('finalDate');

    this.businessName = this.businessNameService.getBusiness(environment['profile']);
  }

  parseTransactions() {
    const checkTransaction: any[] = this.activatedRoute.snapshot.data['mnemonicsForCheckTransactions'] || [];

    this.transactions = checkTransaction.map(code => {
      const currentCode = code.code.trim();
      this.mapTransactions[currentCode] = 'CHECK_TRANSACTIONS';
      return { name: code.description, value: currentCode };
    })

  }

  getDataToBuildInformation() {
    this.showSpinner();

    const params = this.account ? this.account : this.parameterManagement.getParameter('account');

    if (!params) {
      this.hiddenSpinner();
      return;
    }

    const validatedParameter = {
      account: this.tokenizerEncrypt.tokenizer(params),
      initialDate: this.initialDate ?? '0',
      finalDate: this.finalDate ?? 0,
      minimumRange: 0,
      maximumRange: 0,
    };

    this.statementsService.getData(validatedParameter)
      .pipe(finalize(() => this.hiddenSpinner()))
      .subscribe({
        next: (result: any) => {
          this.authorization = result.authorizationNumber ? result.authorizationNumber : '';
          if (result && !result.operations) {
            result.operations = [];
          }

          this.statementsService.data = { data: result };

          const date = {
            initialDate: this.initialDate ? this.initialDate : this.parameterManagement.getParameter('initialDate'),
            finalDate: this.finalDate ? this.finalDate : this.parameterManagement.getParameter('finalDate')
          };
          this.buildInformation(date);
        },
        error: () => {
          this.emptyResult = true;
        }
      })
  }

  buildInformation(filters: any): void {
    if (this.statementsService.data) {
      this.filters = filters;

      if (this.filters.type === 'month') {
        const date = moment(this.filters.initialDate, 'DDMMYYYY');
        const month = this.translateService.instant(`month-${date.format('M')}`);
        this.filters.filtersValueInView = `${month} ${date.format('YYYY')}`;
      } else if (this.filters.type === 'custom') {
        const startDate = moment(this.filters.initialDate, 'DDMMYYYY');
        const endDate = moment(this.filters.finalDate, 'DDMMYYYY');
        this.filters.filtersValueInView = `${startDate.format('DD/MM/YYYY')} - ${endDate.format('DD/MM/YYYY')}`;
      }

      this.information = this.statementsService.data.data;
      this.operations = this.statementsService.data.data.operations;

      this.operations.forEach((operation: any) => {
        switch (this.profile) {
          case EProfile.SALVADOR:
            operation.dateTime = operation.operationDate + ' ' + operation.operationTime;
            operation.descToPrint = operation.description + ' ' + operation.channel
            break;
          case EProfile.PANAMA:
            operation.dateTime = operation.operationDate;
            operation.descToPrint = (operation.beneficiary.length > 0) ? operation.beneficiary : operation.description;
            break;
          default:
            operation.dateTime = operation.operationDate;
            operation.descToPrint = operation.description;
            break;
        }
      })
      this.calculate();

      this.emptyResult = !this.operations.length;
    } else {
      this.emptyResult = true;
    }
  }

  /**
   * Itera los movimientos para saber si pertenecen acredito, débito o cheques pagados
   */
  calculate() {
    this.amounts['debit'].transactionAmount = 0;
    this.amounts['debit'].amount = 0;
    this.amounts['credit'].transactionAmount = 0;
    this.amounts['credit'].amount = 0;
    this.amounts['paid-checks'].transactionAmount = 0;
    this.amounts['paid-checks'].amount = 0;

    this.operations.forEach((operation: any) => {
      const credit = parseFloat(operation.credit.replace(/,/g, ''));
      const debit = parseFloat(operation.debit.replace(/,/g, ''));

      operation.disabledDetails = true;

      if (this.mapTransactions[operation.transaction] === 'CHECK_TRANSACTIONS') {
        this.amounts['paid-checks'].transactionAmount++;
        this.amounts['paid-checks'].amount += debit;
      } else {

        // Si el tipo de transacción es de NOTES o DEPOSIT_DETAIL, la opción de ver detalles se habilita
        if (this.mapTransactions[operation.transaction] === 'DEPOSIT_DETAIL'
          || this.mapTransactions[operation.transaction] === 'NOTES') {
          operation.disabledDetails = false;
        }

        this.statementUtils.calcAmountOnOperations(debit, credit, this.amounts, operation);
      }
      this.information['summary'] = this.amounts;
    });
  }

  openDetail(operation: any) {
    if (this.mapTransactions[operation.transaction] === 'DEPOSIT_DETAIL') {
      this.getDetailForDepositDetail(operation);
      return;
    }

    if (this.mapTransactions[operation.transaction] === 'NOTES') {
      this.getDetailForNotes(operation);
    }
  }

  getDetailForDepositDetail(operation: any) {
    const account = this.information.account;
    const date = operation.operationDate.replace(/-/g, '');
    const time = operation.operationTime.replace(/:/g, '');
    const reference = operation.ref;
    const sequence = operation.sequency;

    this.utils.showPulseLoader();
    this.statementsService.getDetailForDeposits(account, date, time, reference, sequence)
      .pipe(finalize(() => this.utils.hidePulseLoader()))
      .pipe(first())
      .subscribe((result) => {
        this.openModal(CheckStatementDetailModalComponent, result, operation, result?.ref ? result.ref : '');
      });
  }

  getDetailForNotes(operation: any) {
    const account = this.information.account;
    const date = operation.operationDate.replace(/-/g, '');
    const reference = operation.ref;
    const currency = this.information.currency;
    const agency = operation.agency;
    const sequence = operation.sequency;

    this.utils.showPulseLoader();
    this.statementsService.getDetailForNotes(account, date, reference, currency, agency, sequence)
      .pipe(finalize(() => this.utils.hidePulseLoader()))
      .pipe(first())
      .subscribe({
        next: (result) => {
          this.openModal(CheckStatementDetailNotesModalComponent, result, operation, result.ref ? result.ref : '');
        },
        error: (error: HttpErrorResponse) => {
          console.log(error);
        }
      })
  }

  openModal(Component: any, information: any, operation: any, reference: any) {
    const modalRef = this.modalService.open(Component, {
      centered: true, windowClass: `custom-modal`, size: 'xl'
    });

    modalRef.componentInstance.information = information;
    modalRef.componentInstance.generalInformation = this.information;
    modalRef.componentInstance.operation = operation;
    modalRef.componentInstance.authorization = reference;
  }



  goBack() {
    this.location.back();
  }

  onChangeSearch($event) {
    if ($event === 'default') {
      this.filter();
    } else if ($event === 'transaction') {
      if (!this.transactionsInOperations.length) {
        // solo presentar las transacciones que están en la lista de movimientos
        const set = new Set([]);
        this.operations.forEach((operation: any) => set.add(operation.transaction as never));
        const values = Array.from(set);
        this.transactionsInOperations = this.transactions.filter(obj => values.includes(obj.value as never));

        if (this.transactionsInOperations.length === 0) {
          let option: Option = new Option();
          option.value = 'default';
          option.name = 'No existe trx. configurada para filtrar';
          this.transactionsInOperations.push(option);
        }
        if (this.transactionsInOperations[0].value !== 'default') {
          let option: Option = new Option();
          option.value = 'default';
          option.name = 'label.statements.to-select';
          this.transactionsInOperations.unshift(option);
        }
      }
    }
  }

  filter() {
    if (this.search === 'transaction') {
      // filter by transaction
      this.operations = (this.statementsService.data.data.operations as Array<any>).filter(obj => {
        return obj.transaction === this.transaction;
      });
    } else if (this.search === 'reference') {
      // filter by reference

      this.operations = (this.statementsService.data.data.operations as Array<any>).filter(obj => {
        return obj.ref.indexOf(this.reference) !== -1;
      });
    } else if (this.search === 'value') {

      // filter by value (credit or debit)
      this.operations = (this.statementsService.data.data.operations as Array<any>).filter(obj => {

        const credit = Number(obj.credit.replace(/,/g, ''));
        const debit = Number(obj.debit.replace(/,/g, ''));
        const value = Number(this.valueSearch);

        const total = credit + debit;

        switch (this.valueOption) {
          case 'equalsThan':
            return value === total;
          case 'greatherThan':
            return value < total;
          case 'lowerThan':
            return value > total;
          case 'greatherOrEqualsThan':
            return value <= total;
          case 'lowerOrEqualsThan':
            return value >= total;
          default:
            return true;
        }

      });

    } else {
      if (this.statementsService.data) {
        this.operations = this.statementsService.data.data.operations;
      }
    }
  }

  exportAs(type: string) {


    switch (type) {
      case 'csv':
        this.reporter.generate(this.operations, this.information, `estado_de_cuenta_${this.information['account']}_${this.timestamp}`, 'csv');
        break;
      case 'xlsx':
        this.reporter.generate(this.operations, this.information, `estado_de_cuenta_${this.information['account']}_${this.timestamp}`);
        break;
      case 'pdf':
        let informationPrint = { ...this.information };
        informationPrint['operations'] = this.operations;

        this.pdf.pdfGenerate(informationPrint, this.authorization, `estado_de_cuenta_${this.information['account']}_${this.timestamp}`, 248);

        break;
      default:
        console.warn("report type not defined");
    }
  }

  showSpinner() {
    this.spinner.show('main-spinner').then(() => {});
  }

  hiddenSpinner() {
    this.spinner.hide('main-spinner').then(() => {});
  }

  corporateImageApplication(): boolean{
    return  this.styleManagement.corporateImageApplication();
  }
}
