import { Component } from '@angular/core';
import { ParameterManagementService } from '../../../../service/navegation-parameters/parameter-management.service';
import { BusinessNameService } from '../../../../service/shared/business-name.service';
import { TranslateService } from '@ngx-translate/core';
import { ProjectionsExcelService } from '../../services/projections-excel.service';
import { ProjectionsPrintService } from '../../services/projections-print.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProjectionsService } from '../../services/projections.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { FormControl } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { Location } from '@angular/common';
import { OnResize } from '../../../shared/classes/on-risize';

const PRODUCT = '3';
const ENTRY_TYPE = 'DEBIT';

@Component({
  selector: 'byte-projections',
  templateUrl: './projections.component.html',
  styleUrls: ['./projections.component.scss']
})
export class ProjectionsComponent extends OnResize {
  account!: string;
  accountControl: FormControl = new FormControl();
  empty = true;
  entryType = ENTRY_TYPE;
  information!: any;
  isLoading!: boolean;
  product = PRODUCT;
  service!: string;
  businessName = "";
  authorization = "";
  timestamp = new Date().getTime();

  constructor(
    private activatedRouter: ActivatedRoute,
    private location: Location,
    private router: Router,
    private projectionsService: ProjectionsService,
    private spinner: NgxSpinnerService,
    private pdf: ProjectionsPrintService,
    private reporter: ProjectionsExcelService,
    private translate: TranslateService,
    private businessNameService: BusinessNameService,
    private parameterManagement: ParameterManagementService
  ) {
    super();
    this.businessName = this.businessNameService.getBusiness(environment['profile']);

    this.activatedRouter.queryParams.subscribe(() => {
      this.account = businessNameService.accountNumber ?? this.parameterManagement.getParameter('account');
      this.service = this.parameterManagement.getMenuEquivalence(this.router) as string;

      if (this.service) {
        this.spinner.show('main-spinner').then(() => {});
        this.isLoading = true;
      }
    });
  }

  onChangeAccount($event) {
    if (!this.isLoading) {
      this.spinner.show('main-spinner').then(() => {});
      this.isLoading = true;
    }

    this.projectionsService.getDataByAccount($event.account)
      .pipe(finalize(() => {
        this.spinner.hide('main-spinner').then(() => {});
        this.isLoading = false;
      }))
      .subscribe({
        next: (response: any) => {
          this.authorization = response.reference ? response.reference : '';
          this.buildInformation(response, $event);
        },
        error: () => {
          this.empty = true;
          this.information = {};
        }
      });
  }

  buildInformation(data: any, account: any) {
    this.empty = false;
    this.information = data;

    // construir accountDetail
    this.information.accountDetail = {
      accountName: this.information.name,
      account: this.information.mask,
      accountAlias: this.information.alias || account.alias,
      status: account.enabled ? 'application.status.active' : 'application.status.inactive',
      currency: this.translate.instant(`currency_${account.currency}`),
    }

    if (!this.information.movements) {
      this.information.movements = [];
    }

    this.information.movements.forEach(element => {
      element.currency = account.currency;
    });

    if (this.information.total) {
      this.information.total.currency = account.currency;
    }

    this.projectionsService.buildInformationHelper(this.information);
  }

  goBack() {
    this.location.back();
  }

  exportAs(type: string) {
    switch (type) {
      case 'csv':
        this.reporter.generate(this.information.movements, this.information, `Proyecciones_${this.information['accountDetail']['account']}_${this.timestamp}`, 'csv');
        break;
      case 'xlsx':
        this.reporter.generate(this.information.movements, this.information, `Proyecciones_${this.information['accountDetail']['account']}_${this.timestamp}`);
        break;
      case 'pdf':
        this.pdf.pdfGenerate(this.information, this.authorization, 'Proyecciones', 248);
        break;
      default:
        console.warn("report type not defined");
    }
  }

}
