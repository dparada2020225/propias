import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdfTransferHeaderComponent } from './adf-transfer-header.component';

describe('AdfTransferHeaderComponent', () => {
  let component: AdfTransferHeaderComponent;
  let fixture: ComponentFixture<AdfTransferHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdfTransferHeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdfTransferHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
