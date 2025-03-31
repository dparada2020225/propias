import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditCardSectionComponent } from './credit-card-section.component';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { Router } from '@angular/router';

describe('CreditCardSectionComponent', () => {
  let component: CreditCardSectionComponent;
  let fixture: ComponentFixture<CreditCardSectionComponent>;
  let ParameterManagement: jasmine.SpyObj<ParameterManagementService>
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const ParameterManagementSpy = jasmine.createSpyObj("ParameterManagementService", ["sendParameters"] )
    const routerSpy = jasmine.createSpyObj("Router", ["navigate"] )
    await TestBed.configureTestingModule({
      declarations: [ CreditCardSectionComponent ],
      providers: [
        {
          provide: ParameterManagementService,
          useValue:ParameterManagementSpy
        },
        {
          provide: Router,
          useValue:routerSpy
        }
      ],
      imports:[
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
        RouterTestingModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditCardSectionComponent);
    component = fixture.componentInstance;
    component.product = {
      name: 'CreditCard',
      product: 'test'
    }
    ParameterManagement= TestBed.inject(ParameterManagementService) as jasmine.SpyObj<ParameterManagementService>
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call console.error when goToPayment is called', () => {
    spyOn(console, 'error');
    component.goToPayment({});
    expect(console.error).toHaveBeenCalledWith('En este método aún no está implementado');
  });

  it('should call console.error when goToStatements is called', () => {
    spyOn(console, 'error');
    component.goToStatements({});
    expect(console.error).toHaveBeenCalledWith('En este método aún no está implementado');
  });

  it('should call parameterManagement.sendParameters and router.navigate when goToBalance is called', () => {
    component.goToBalance({});
    expect(router.navigate).toHaveBeenCalledWith(['/account-balance']);
    expect(ParameterManagement.sendParameters).toHaveBeenCalledWith({product: 'test'});
  });
});
