// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { TranslateModule } from '@ngx-translate/core';
// import { AdfTransferFooterComponent } from './adf-transfer-footer.component';
// import { UtilService } from 'src/app/service/common/util.service';
// import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
// import { EProfile } from 'src/app/enums/profile.enum';

// fdescribe('AdfTransferFooterComponent', () => {
//   let component: AdfTransferFooterComponent;
//   let fixture: ComponentFixture<AdfTransferFooterComponent>;
//   let mockUtilService: jasmine.SpyObj<UtilService>;

//   beforeEach(async () => {
//     const spy = jasmine.createSpyObj('UtilService', ['getProfile']);

//     await TestBed.configureTestingModule({
//       declarations: [AdfTransferFooterComponent],
//       providers: [
//         { provide: UtilService, useValue: spy }
//       ],
//       imports: [TranslateModule.forRoot()],
//       schemas: [CUSTOM_ELEMENTS_SCHEMA]
//     }).compileComponents();

//     mockUtilService = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
//   });

//   beforeEach(() => {
//     fixture = TestBed.createComponent(AdfTransferFooterComponent);
//     component = fixture.componentInstance;
//     mockUtilService.getProfile.and.returnValue(EProfile.SALVADOR);
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should have default icon value', () => {
//     expect(component.icon).toBe('sprint2-icon-warning');
//   });

//   it('should get profile from utils', () => {
//     expect(component.profile).toBe(EProfile.SALVADOR);
//     expect(mockUtilService.getProfile).toHaveBeenCalled();
//   });

//   it('should render title and description', () => {
//     component.title = 'Test Title';
//     component.description = 'Test Description';
//     component.descriptionEl = 'Test Description El';
//     fixture.detectChanges();

//     const compiled = fixture.nativeElement;
//     const titleElement = compiled.querySelector('.title');
//     const descriptionElement = compiled.querySelector('.description');
//     const descriptionElElement = compiled.querySelector('.descriptionEl');

//     expect(titleElement).not.toBeNull();
//     expect(descriptionElement).not.toBeNull();
//     expect(descriptionElElement).not.toBeNull();

//     if (titleElement && descriptionElement && descriptionElElement) {
//       expect(titleElement.textContent).toContain('Test Title');
//       expect(descriptionElement.textContent).toContain('Test Description');
//       expect(descriptionElElement.textContent).toContain('Test Description El');
//     }
//   });

//   it('should set title input correctly', () => {
//     component.title = 'Test Title';
//     fixture.detectChanges();
//     expect(component.title).toBe('Test Title');
//   });

//   it('should set description input correctly', () => {
//     component.description = 'Test Description';
//     fixture.detectChanges();
//     expect(component.description).toBe('Test Description');
//   });

//   it('should set descriptionEl input correctly', () => {
//     component.descriptionEl = 'Test Description El';
//     fixture.detectChanges();
//     expect(component.descriptionEl).toBe('Test Description El');
//   });
// });
