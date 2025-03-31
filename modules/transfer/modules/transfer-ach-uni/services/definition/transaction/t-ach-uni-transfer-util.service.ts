import { AdfFormatService } from '@adf/components';
import { Injectable } from '@angular/core';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { EProductFromCode, Product } from 'src/app/enums/product.enum';
import { IUserDataTransaction } from 'src/app/models/util-work-flow.interface';
import { UtilService } from 'src/app/service/common/util.service';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class TAchUniTransferUtilService {

  constructor(
    private util: UtilService,
    private parameterManagementService: ParameterManagementService,
    private adfFormat: AdfFormatService,
    private translate: TranslateService) {}

    getProduct(productName: string) {
      return Product[this.parseProductFromAccount(productName)];
    }

    parseProductFromAccount(productName: string) {
      return String(productName || EProductFromCode['01']).toUpperCase();
    }
}
