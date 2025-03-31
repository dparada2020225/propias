// import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { StyleManagementService } from 'src/app/service/common/style-management.service';
import { ScheduleComponent } from './schedule.component';
// import { ScheduleComponent } from './schedule.component';
// import { StyleManagementService } from 'src/app/service/common/style-management.service';
// import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';


// describe('ScheduleComponent', () => {
//   let component: ScheduleComponent;
//   let fixture: ComponentFixture<ScheduleComponent>;
//   let styleManagement: jasmine.SpyObj<StyleManagementService>

//   beforeEach(async () => {
//     const styleManagementSpy = jasmine.createSpyObj("StyleManagementService", ["corporateImageApplication"] )
//     await TestBed.configureTestingModule({
//       declarations: [ ScheduleComponent ],
//       providers: [
//         {
//           provide: StyleManagementService,
//           useValue:styleManagementSpy
//         }
//       ],
//       imports:[
//         TranslateModule.forRoot({
//           loader: {
//             provide: TranslateLoader,
//             useClass: TranslateFakeLoader,
//           },
//         }),
//       ]
//     })
//     .compileComponents();

//     fixture = TestBed.createComponent(ScheduleComponent);
//     component = fixture.componentInstance;
//     styleManagement= TestBed.inject(StyleManagementService) as jasmine.SpyObj<StyleManagementService>
//     styleManagement.corporateImageApplication.and.returnValue(false)
//     fixture.detectChanges();
//   });


//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

// it('should return true when corporateImageApplication() is called with corporate image theme', () => {
//   styleManagement.corporateImageApplication.and.returnValue(true)
//   const result = component.corporateImageApplication();
//   expect(result).toBeTrue();
// });

// });
