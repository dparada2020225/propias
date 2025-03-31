import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RegionalConnectionErrorComponent} from './regional-connection-error.component';
import {Router} from '@angular/router';
import {MockTranslatePipe} from "../../../../assets/mocks/public/tranlatePipeMock";
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from "@ngx-translate/core";

describe('RegionalConnectionErrorComponent', () => {
  let component: RegionalConnectionErrorComponent;
  let fixture: ComponentFixture<RegionalConnectionErrorComponent>;
  let router: jasmine.SpyObj<Router>;


  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate'])

    await TestBed.configureTestingModule({
      declarations: [ RegionalConnectionErrorComponent, MockTranslatePipe ],
      providers: [
        { provide: Router, useValue: routerSpy },
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
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegionalConnectionErrorComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
