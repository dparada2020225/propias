import {Location} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NgxSpinnerService} from 'ngx-spinner';
import {finalize} from 'rxjs/operators';
import {Product} from 'src/app/enums/product.enum';
import {UtilService} from 'src/app/service/common/util.service';
import {ParameterManagementService} from 'src/app/service/navegation-parameters/parameter-management.service';
import {StatementsService} from 'src/app/service/shared/statements.service';
import {environment} from 'src/environments/environment';
import {CheckStatementExcelService} from '../../services/check-statement-excel.service';
import {CheckStatementPrintService} from '../../services/check-statement-print.service';
import {StatementsUtilsService} from '../../services/statements-utils.service';
import {
  CheckStatementFilterModalComponent
} from '../check-statement-filter-modal/check-statement-filter-modal.component';

const VISUALIZATIONS = [
  { name: 'label.visualization.on-screen', value: 'SCR' },
  { name: 'label.visualization.csv-file', value: 'CSV' },
  { name: 'label.visualization.excel-file', value: 'XLS' },
  { name: 'label.visualization.pdf-file', value: 'PDF' },
];

const TITLES_BY_PRODUCT = {
  [Product.CHECK]: 'cheques',
  [Product.SAVINGS]: 'ahorros',
  [Product.FIX_TERM]: 'investment',
  [Product.LOAN]: 'loans',
  [Product.LOAN_ADMINISTRATED]: 'loans',
  [Product.CREDIT_CARD]: 'cards',
};

/**
 * @author Sebastian Chicoma S.
 *
 * Componente utilizado para la pantalla de estado de cuentas (Cheques)
 */
@Component({
  selector: 'byte-check-statement',
  templateUrl: './check-statement.component.html',
  styleUrls: ['./check-statement.component.scss'],
})
export class CheckStatementComponent implements OnInit {

  get movementTypeForm() {
    return this.form.controls['movementType'] as FormControl;
  }

  get visualizationForm() {
    return this.form.controls['visualization'] as FormControl;
  }

  get accountForm() {
    return this.form.controls['account'] as FormControl;
  }

  profile = environment.profile;
  account: string;
  service!: string;
  entryType = 'DEBIT';
  product: string;
  mapTransactions = {};
  title!: string;
  operations = [];
  amounts = {
    debit: { description: 'label.statements.debits', transactionAmount: 0, amount: 0 },
    credit: { description: 'label.statements.credits', transactionAmount: 0, amount: 0 },
    'paid-checks': { description: 'label.statements.paid-checks', transactionAmount: 0, amount: 0 },
  };
  datos: any;

  accounts!: Array<any>;
  availableDownload!: boolean;
  information: any;
  form: FormGroup;
  isLoading = true;
  movementTypes: Array<any> = [];
  visualizations: Array<any> = VISUALIZATIONS;
  formatType!: string;
  timestamp = new Date().getTime();

  constructor(
    private activatedRouter: ActivatedRoute,
    private formBuilder: FormBuilder,
    private location: Location,
    private modalService: NgbModal,
    private pdf: CheckStatementPrintService,
    private reporter: CheckStatementExcelService,
    private router: Router,
    private statementsService: StatementsService,
    private spinner: NgxSpinnerService,
    private parameterManagement: ParameterManagementService,
    private util: UtilService,
    private statementsUtils: StatementsUtilsService,
  ) {
    this.parameterManagement.getSharedParameter().subscribe((data: any) => {
      if (data?.account && data?.product) {
        this.account = data?.account ?? this.parameterManagement.getParameter('account');
        this.product = (data['product'] ?? this.parameterManagement.getParameter('product')) || Product.CHECK;

        this.title = TITLES_BY_PRODUCT[this.product];
      }
    });

    this.account = this.parameterManagement.getParameter('account');
    this.product = this.parameterManagement.getParameter('product');

    this.service = this.parameterManagement.getMenuEquivalence(router) ?? '';
    this.spinner.show('main-spinner').then(() => {});

    this.form = this.formBuilder.group({
      movementType: ['A', Validators.required],
      visualization: ['SCR', Validators.required],
      account: ['', Validators.required],
    });

    this.movementTypes.push({ name: 'label.movement-type.all-types', value: 'A' });

    for (const obj of this.activatedRouter.snapshot.data['mnemonicStatementResolver'] || []) {
      const code = obj.code.trim();
      this.movementTypes.push({ name: obj.description, value: code });
    }
  }

  ngOnInit() {
    this.title = TITLES_BY_PRODUCT[this.product];
    this.util.scrollToTop();
  }

  onChangeAccount() {
    this.spinner.hide('main-spinner').then(() => {})
  }

  openFilterModal(type: string) {
    const modal = this.modalService.open(CheckStatementFilterModalComponent, {
      centered: true,
      windowClass: `custom-modal ${type === 'month' ? 'filter-by-month' : 'filter-by-day'}`,
    });

    modal.componentInstance.type = type;
    modal.componentInstance.account = this.form.value.account;
    modal.componentInstance.movementType = this.form.value.movementType;
    modal.result.then((result) => {
      if (this.form.value.visualization !== 'SCR') {
        this.availableDownload = true;
        this.formatType = this.form.value.visualization;
        this.information = result.data;
        this.statementsService
          .getMenmonics('CHECK_TRANSACTION')
          .pipe(finalize(() => {
            this.calculate(this.information['operations']);
            this.util.hideLoader();
          }))
          .subscribe((data: any) => {
            for (const obj of data) {
              this.mapTransactions[obj.code] = 'CHECK_TRANSACTIONS';
            }
          });
      } else {
        this.statementsService.data = result;

        if (this.statementsService.data.data && !this.statementsService.data.data.operations) {
          this.statementsService.data.data.operations = [];
        }

        const initialDate = result.filters.initialDate;
        const finalDate = result.filters.finalDate;
        if (!this.product) {
          this.product = this.parameterManagement.getParameter('product');
        }
        const product = this.product;

        let parameters = {
          account: result.data.account,
          initialDate: initialDate,
          finalDate: finalDate,
          product: product,
        };
        this.parameterManagement.sendParameters(parameters);
        this.router.navigate(['/statements/result']).finally(() => this.spinner.hide('main-spinner'));
      }
    }).catch(error => error);
  }

  return(direct?: boolean) {
    if (direct) {
      this.location.back();
    } else {
      this.availableDownload = false;

      setTimeout(() => {
        this.form.setValue(this.form.value);
      });
    }
  }

  calculate(operations: Array<any>) {

    operations.forEach((operation) => {
      const credit = parseFloat(operation.credit.replace(/,/g, ''));
      const debit = parseFloat(operation.debit.replace(/,/g, ''));

      if (this.mapTransactions[operation.transaction] === 'CHECK_TRANSACTIONS') {
        this.amounts['paid-checks'].transactionAmount++;
        this.amounts['paid-checks'].amount += debit;

        operation.disabledDetails = true;
      } else {
        this.statementsUtils.calcAmountOnOperations(debit, credit, this.amounts, operation);
      }
      this.information['summary'] = this.amounts;

      switch (this.profile) {
        case 'bisv':
          operation.dateTime = operation.operationDate + ' ' + operation.operationTime;
          operation.descToPrint = operation.description + ' ' + operation.channel;
          break;
        case 'bipa':
          operation.dateTime = operation.operationDate;
          operation.descToPrint = operation.beneficiary.length > 0 ? operation.beneficiary : operation.description;
          break;
        default:
          operation.dateTime = operation.operationDate;
          operation.descToPrint = operation.description;
          break;
      }
    });
  }

  download() {
    let data = [];

    if (this.information && this.information.operations) {
      data = this.information.operations;
    }

    switch (this.form.value.visualization) {
      case 'CSV':
        this.reporter.generate(data, this.information, `estado_de_cuenta_${this.information['account']}_${this.timestamp}`, 'csv');
        break;
      case 'XLS':
        this.reporter.generate(data, this.information, `estado_de_cuenta_${this.information['account']}_${this.timestamp}`);
        break;
      case 'PDF':
        this.pdf.pdfGenerate(
          this.information,
          this.information.authorizationNumber,
          `estado_de_cuenta_${this.information['account']}_${this.timestamp}`,
          248
        );
        break;
      default:
        console.warn('Reporter type not defined');
    }
  }

  getProductEquivalencesForTranslate(product: Product | string) {
    switch (product) {
      case Product.CHECK:
        return 'label.home.checks';
      case Product.SAVINGS:
        return 'label.home.savings';
      default:
        return '';
    }
  }
}
