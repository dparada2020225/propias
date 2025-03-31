import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { OnResize } from 'src/app/modules/shared/classes/on-risize';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';

/**
 * PRODUCTS: 06
 */
@Component({
  selector: 'credit-card-section',
  templateUrl: './credit-card-section.component.html',
  styleUrls: ['./credit-card-section.component.scss', './../default-product-section/default-product-section.component.scss'],
})
export class CreditCardSectionComponent extends OnResize {
  @Input() product: any;
  @Input() singleProduct!: boolean;

  constructor(private parameterManagement: ParameterManagementService, private router: Router) {
    super();
  }

  goToPayment(account: any) {
    console.error('En este método aún no está implementado');
  }

  goToStatements(account: any) {
    console.error('En este método aún no está implementado');
  }

  goToBalance(account: any) {
    const parameter = { product: this.product.product };
    this.parameterManagement.sendParameters(parameter);
    this.router.navigate(['/account-balance']);
  }
}
