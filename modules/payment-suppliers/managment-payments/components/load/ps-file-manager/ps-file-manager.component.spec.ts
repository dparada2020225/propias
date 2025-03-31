import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PsFileManagerComponent } from './ps-file-manager.component';

describe('PsFileManagerComponent', () => {
  let component: PsFileManagerComponent;
  let fixture: ComponentFixture<PsFileManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PsFileManagerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PsFileManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
