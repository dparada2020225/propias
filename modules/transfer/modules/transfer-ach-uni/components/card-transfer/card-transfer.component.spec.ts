import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CardTransferComponent } from './card-transfer.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

fdescribe('CardTransferComponent', () => {
  let component: CardTransferComponent;
  let fixture: ComponentFixture<CardTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CardTransferComponent],
      imports: [TranslateModule.forRoot()],
    })
      .compileComponents();

    fixture = TestBed.createComponent(CardTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit transferClick event with correct typeTransferACH value', () => {
    const typeTransferACH = 'UNI';
    component.typeTransferACH = typeTransferACH;

    const emittedValue = jasmine.createSpy();
    component.transferClick.subscribe(emittedValue);

    const cardElement = fixture.debugElement.query(By.css('div')).nativeElement;
    cardElement.click();

    expect(emittedValue).toHaveBeenCalledWith(typeTransferACH);
  });
});
