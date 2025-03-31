import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListFeaturesFixesModalComponent } from './list-features-fixes-modal.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

describe('ListFeaturesFixesModalComponent', () => {
  let component: ListFeaturesFixesModalComponent;
  let fixture: ComponentFixture<ListFeaturesFixesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListFeaturesFixesModalComponent],
      providers: [
        { provide: NgbActiveModal, useValue: {} }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ListFeaturesFixesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the version', () => {
    const versionElement: HTMLElement = fixture.debugElement.nativeElement.querySelector('h2');
    expect(versionElement.textContent).toContain(component.version);
  });

  it('should display the features', () => {
    const featureElements = fixture.debugElement.nativeElement.querySelectorAll('ul:first-of-type li');
    expect(featureElements.length).toEqual(component.fixAndFeatureList.length);
    for (let i = 0; i < featureElements.length; i++) {
      expect(featureElements[i].textContent).toEqual(component.fixAndFeatureList[i].features);
    }
  });

});
