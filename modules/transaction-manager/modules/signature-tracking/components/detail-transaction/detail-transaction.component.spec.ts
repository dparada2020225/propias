import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DetailTransactionComponent} from './detail-transaction.component';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from "@ngx-translate/core";

describe('DetailTransactionComponent', () => {
  let component: DetailTransactionComponent;
  let fixture: ComponentFixture<DetailTransactionComponent>;

  let activeModal: jasmine.SpyObj<NgbActiveModal>;

  beforeEach(async () => {
    const activeModalSpy = jasmine.createSpyObj('NgbActiveModal', ['close'])

    await TestBed.configureTestingModule({
      declarations: [ DetailTransactionComponent ],
      providers: [
        { provide: NgbActiveModal, useValue: activeModalSpy },
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

    fixture = TestBed.createComponent(DetailTransactionComponent);
    component = fixture.componentInstance;
    activeModal = TestBed.inject(NgbActiveModal) as jasmine.SpyObj<NgbActiveModal>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
