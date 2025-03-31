import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StorageService } from '@adf/security';
import { ActivatedRoute } from '@angular/router';
import { Idle } from '@ng-idle/core';
import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { SmartCoreService } from 'src/app/service/common/smart-core.service';
import { MenuService } from 'src/app/service/shared/menu.service';
import { LocalStorageServiceMock } from 'src/assets/mocks/public/mockLocalStorageServiceMock';
import { ISignatoryEmbbededParams } from '../../../modules/transaction-manager/modules/signature-tracking/interfaces/signature-tracking.interface';
import { EmbeddedObComponent } from './embedded-ob.component';

describe('EmbeddedObComponent', () => {
  let component: EmbeddedObComponent;
  let fixture: ComponentFixture<EmbeddedObComponent>;

  let menuService: jasmine.SpyObj<MenuService>;
  let idle: jasmine.SpyObj<Idle>;
  let smartCore: jasmine.SpyObj<SmartCoreService>;
  let translate: jasmine.SpyObj<TranslateService>;

  beforeEach(async () => {

    const menuServiceSpy = jasmine.createSpyObj('MenuService', ['closeMenu'])
    const idleSpy = jasmine.createSpyObj('Idle', ['watch'])
    const smartCoreSpy = jasmine.createSpyObj('SmartCoreService', ['personalizationOperation'])
    const translateSpy = jasmine.createSpyObj('TranslateService', ['instant'])

    await TestBed.configureTestingModule({
      declarations: [EmbeddedObComponent],
      providers: [
        EmbeddedObComponent,
        LocalStorageServiceMock,
        { provide: MenuService, useValue: menuServiceSpy },
        { provide: Idle, useValue: idleSpy },
        { provide: StorageService, useClass: LocalStorageServiceMock },
        { provide: SmartCoreService, useValue: smartCoreSpy },
        { provide: TranslateService, useValue: translateSpy },
        {
          provide: ActivatedRoute, useValue: {
            snapshot: {
              data: {
                service: 'test'
              }
            }
          }
        }
      ],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(EmbeddedObComponent);
    component = fixture.componentInstance;

    menuService = TestBed.inject(MenuService) as jasmine.SpyObj<MenuService>;
    idle = TestBed.inject(Idle) as jasmine.SpyObj<Idle>;
    smartCore = TestBed.inject(SmartCoreService) as jasmine.SpyObj<SmartCoreService>;
    translate = TestBed.inject(TranslateService) as jasmine.SpyObj<TranslateService>;
    component.signatoryParams = dataMock;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add click event to iframe body', () => {
    const iframe = document.createElement('iframe');
    iframe.id = 'frame';
    document.body.appendChild(iframe);

    component.ngAfterViewInit();

    expect(iframe.contentWindow!.document.body.onclick).toBeDefined();
  });

  it('should return an empty string if signatoryParams or reference is not defined', () => {
    expect(component.handleValidateSignatoryTrackingParams).toEqual('');
  });

  it('should return the correct tracking params if signatoryParams is defined', () => {
    component.signatoryParams = {
      reference: '12345',
      currentTabPosition: '2',
      action: 'submit'
    };
    expect(component.handleValidateSignatoryTrackingParams).toEqual('&trxID-seg=12345&current-step-seg=2&action-seg=submit');
  });

});

const dataMock: ISignatoryEmbbededParams = {
  action: 'create',
  currentTabPosition: 'current',
  reference: 'QW88RB'
}