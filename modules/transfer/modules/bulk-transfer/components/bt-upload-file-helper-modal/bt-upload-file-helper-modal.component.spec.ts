import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtUploadFileHelperModalComponent } from './bt-upload-file-helper-modal.component';

xdescribe('ModalDetailComponent', () => {
  let component: BtUploadFileHelperModalComponent;
  let fixture: ComponentFixture<BtUploadFileHelperModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BtUploadFileHelperModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BtUploadFileHelperModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
