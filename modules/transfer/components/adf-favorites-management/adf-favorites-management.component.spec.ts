import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdfFavoritesManagementComponent } from './adf-favorites-management.component';

describe('AdfFavoritesManagementComponent', () => {
  let component: AdfFavoritesManagementComponent;
  let fixture: ComponentFixture<AdfFavoritesManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdfFavoritesManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdfFavoritesManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
