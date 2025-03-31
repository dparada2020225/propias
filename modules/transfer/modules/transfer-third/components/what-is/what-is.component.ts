import {Component, OnInit} from '@angular/core';
import {UtilService} from "../../../../../../service/common/util.service";
import {ActivatedRoute, Router} from "@angular/router";
import {IFlowError} from "../../../../../../models/error.interface";
import {IIsSchedule} from "../../../../../../models/isSchedule.interface";
import {environment} from "../../../../../../../environments/environment";
import {ValidationTriggerTimeService} from "../../../../../../service/common/validation-trigger-time.service";
import {EThirdTransferUrlNavigationCollection} from "../../enums/third-transfer-navigate-parameters.enum";
import {TableOption} from "../../../../interface/table.enum";

enum typeView {
  INFORMATION = 'information',
  QUESTION = 'question',
}

@Component({
  selector: 'byte-what-is',
  templateUrl: './what-is.component.html',
  styleUrls: ['./what-is.component.scss'],
})
export class WhatIsComponent implements OnInit {

  view: string = typeView.INFORMATION;
  menuOptionsLicenses: string[] = [];
  typeAlert: string | undefined;
  messageAlert!: string | undefined;

  get showButtonGoToTransfer(): boolean {
    return this.menuOptionsLicenses?.includes(TableOption.TRANSFER);
  }

  constructor(
    private util: UtilService,
    private activatedRoute: ActivatedRoute,
    private validationTriggerTime: ValidationTriggerTimeService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.util.hideLoader();
    this.validateThirdTransferSchedule();
    this.getPermissionsToTransfer()
  }

  getPermissionsToTransfer() {
    const menuOptions = this.activatedRoute.snapshot.data['menuOptionsLicenses'];

    if (menuOptions.hasOwnProperty('error')) {
      this.showAlert('error', (menuOptions as IFlowError).message);
      return;
    }

    this.menuOptionsLicenses = this.util.getLicensesTransactions(menuOptions);
  }

  validateThirdTransferSchedule() {
    const schedule: IIsSchedule | IFlowError = this.activatedRoute.snapshot.data['scheduleService'];
    this.validationTriggerTime.validate(environment.profile, schedule);
  }

  selectView(step: string): void {
    if (Object.values(typeView).includes(step as typeView)) {
      this.view = step;
    } else {
      this.view = 'information';
    }
  }

  navigateToTransferThird(): void {
    if (!this.validationTriggerTime.isAvailableSchedule) {
      this.validationTriggerTime.openModal();
      return;
    }

    this.router.navigate([EThirdTransferUrlNavigationCollection.HOMESV]).then(() => {
    });
  }


  validationAlert(): boolean {
    return !!(this.typeAlert && this.messageAlert);
  }

  showAlert(type: string, message: string) {
    this.typeAlert = type;
    this.messageAlert = message;
  }

}
