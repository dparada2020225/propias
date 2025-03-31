import { TestBed } from '@angular/core/testing';

import { mockObservableError } from 'src/assets/testing';
import { SettingDataService } from '../service/common/setting-data.service';
import { SettingDataResolver } from './setting-data.resolver';

describe('SettingDataResolver', () => {
  let resolver: SettingDataResolver;
  let settingData: jasmine.SpyObj<SettingDataService>;

  beforeEach(() => {
    const settingDataSpy = jasmine.createSpyObj('SettingDataService', ['getSetting'])
    TestBed.configureTestingModule({
      providers: [
        { provide: SettingDataService, useValue: settingDataSpy },
      ]
    });
    resolver = TestBed.inject(SettingDataResolver);
    settingData = TestBed.inject(SettingDataService) as jasmine.SpyObj<SettingDataService>;
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  it('should Setting Data Resolver response 200', () => {

    settingData.getSetting.and.returnValue(mockObservableError(200));

    resolver.resolve().subscribe({
      next: (value) => {
        expect(value).toBe(200 as any)
      },
      error: (error) => {
        expect(error.status).toBe(200);
      }
    })

  })

});
