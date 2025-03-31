import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { BusinessNameService } from '../../../../service/shared/business-name.service';
import { ParameterManagementService } from '../../../../service/navegation-parameters/parameter-management.service';
import { environment } from '../../../../../environments/environment';
import { finalize } from 'rxjs/operators';
import { TermDepositService } from '../../services/term-deposit.service';
import { OnResize } from '../../../shared/classes/on-risize';
import { ProjectionsService } from '../../services/projections.service';

const PRODUCT = '3';
const ENTRY_TYPE = 'DEBIT';


@Component({
  selector: 'byte-term-deposit',
  templateUrl: './term-deposit.component.html',
  styleUrls: ['./term-deposit.component.scss']
})
export class TermDepositComponent extends OnResize {
  account!: string;
  accountControl: FormControl = new FormControl();
  empty = true;
  entryType = ENTRY_TYPE;
  information: any = {};
  isLoading!: boolean;
  product = PRODUCT;
  service!: string;
  businessName = "";

  constructor(
    private activatedRouter: ActivatedRoute,
    private location: Location,
    private router: Router,
    private termDepositService: TermDepositService,
    private spinner: NgxSpinnerService,
    private businessNameService: BusinessNameService,
    private parameterManagement: ParameterManagementService,
    private projectionsService: ProjectionsService,
  ) {
    super();
    this.initDefinition();
  }

  initDefinition() {
    this.businessName = this.businessNameService.getBusiness(environment['profile']);

    this.activatedRouter.queryParams.subscribe(() => {
      this.account = this.businessNameService.accountNumber  ?? this.parameterManagement.getParameter('account');
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

    this.termDepositService.getDataByAccount($event)
      .pipe(finalize(() => {
      this.spinner.hide('main-spinner').then(() => {});
      this.isLoading = false;
    }))
      .subscribe({
        next: (response) => {
          this.buildInformation(response)
        },
        error: () => {
          this.empty = true;
          this.information = {};
        }
      })
  }

  buildInformation(data: any) {
    this.empty = false;
    this.information = data;

    this.projectionsService.buildInformationHelper(this.information);

  }

  goBack() {
    this.location.back();
  }
}
