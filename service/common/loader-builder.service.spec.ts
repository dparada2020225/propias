import {TestBed} from '@angular/core/testing';

import {TranslateService} from '@ngx-translate/core';
import {EVersionHandler} from 'src/app/enums/version-handler.enum';
import {environment} from 'src/environments/environment';
import {LoaderBuilderService} from './loader-builder.service';
import {StyleManagementService} from './style-management.service';

describe('LoaderBuilderService', () => {
  let service: LoaderBuilderService;
  let translate: jasmine.SpyObj<TranslateService>;
  let styleManagement: jasmine.SpyObj<StyleManagementService>;

  beforeEach(() => {

    const translateSpy = jasmine.createSpyObj('TranslateService', ['instant', 'getBrowserLang'])
    const styleManagementSpy = jasmine.createSpyObj('StyleManagementService', ['corporateImageApplication'])

    TestBed.configureTestingModule({
      providers: [
        { provide: TranslateService, useValue: translateSpy },
        { provide: StyleManagementService, useValue: styleManagementSpy },
      ],
      imports: [

      ]
    });
    service = TestBed.inject(LoaderBuilderService);
    translate = TestBed.inject(TranslateService) as jasmine.SpyObj<TranslateService>;
    styleManagement = TestBed.inject(StyleManagementService) as jasmine.SpyObj<StyleManagementService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get Loader if is corporateImageApplication', () => {
    translate.instant.and.returnValue('logout')
    styleManagement.corporateImageApplication.and.returnValue(true)
    expect(service.getLoader('logout')).toBeDefined()
  })

  it('should get loader if is not corporateImageApplication', () => {
    const gifURL = `assets/images/gif/LoaderBR/Loader_${environment.profile}_${EVersionHandler.ASSETS}.gif`;
    const gif = `<img src="${gifURL}"/>`;

    styleManagement.corporateImageApplication.and.returnValue(false);
    expect(service.getLoader()).toEqual(gif)
  })

  it('should get Loader Simple', () => {
    const imageUrl = `assets/images/gif/LoaderBR/Loader_${service.profile}_${EVersionHandler.ASSETS}.png`;
    const gifUrl = `assets/images/gif/LoaderBR/Loader_${service.profile}_${EVersionHandler.ASSETS}.gif`;

    const styleLoader = `
        <style>
            .image-loader{
                margin-top: 65px;
            }

            .gif-loader{
                animation: 2s fade linear;
            }

            @keyframes fade {
                from {
                  opacity: 1;
                }

                to {
                  opacity: 0;
                }
            }
        </style>`;

    const loader = `
        <div style='${service.styleContainer}'>
            ${styleLoader}
            <img src="${imageUrl}">
            <img class='loader-index-gif gif-loader' src="${gifUrl}"/>
        </div>`;

    styleManagement.corporateImageApplication.and.returnValue(true);

    expect(service.getLoaderSimple()).toEqual(loader);

  })


});
