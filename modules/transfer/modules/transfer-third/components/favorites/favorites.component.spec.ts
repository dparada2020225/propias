import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FavoritesComponent} from './favorites.component';
import {UtilService} from "../../../../../../service/common/util.service";
import {TransferThirdService} from "../../services/transaction/transfer-third.service";
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from "@angular/core";
import {IAddFavoriteACH} from "../../../transfer-ach/interfaces/ach-transfer.interface";
import {clickElement, mockObservable, mockObservableError} from "../../../../../../../assets/testing";

describe('FavoritesComponent', () => {
  let component: FavoritesComponent;
  let fixture: ComponentFixture<FavoritesComponent>;

  let utils: jasmine.SpyObj<UtilService>;
  let transferThirdService: jasmine.SpyObj<TransferThirdService>;

  beforeEach(async () => {

    const utilsSpy = jasmine.createSpyObj('UtilService', ['scrollToTop', 'hidePulseLoader', 'showPulseLoader'])
    const transferThirdServiceSpy = jasmine.createSpyObj('TransferThirdService', ['deleteFavorite', 'addFavorite'])

    await TestBed.configureTestingModule({
      declarations: [FavoritesComponent],
      providers: [
        {provide: UtilService, useValue: utilsSpy},
        {provide: TransferThirdService, useValue: transferThirdServiceSpy},
      ],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents();

    fixture = TestBed.createComponent(FavoritesComponent);
    component = fixture.componentInstance;

    utils = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
    transferThirdService = TestBed.inject(TransferThirdService) as jasmine.SpyObj<TransferThirdService>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  const accountToChangeFavorite: IAddFavoriteACH = {
    alias: 'Martin',
    number: '010010012254'
  }

  describe('Test with favorite is false', () => {

    beforeEach(() => {
      spyOn(component.changeInfo, 'emit');
      component.isFavorite = false;
      component.account = accountToChangeFavorite
    })

    it('should handleFav when favorites is false', () => {
      transferThirdService.addFavorite.and.returnValue(mockObservable({}))
      clickElement(fixture, 'i.sprint2-icon-favoritos')
      fixture.detectChanges();
      expect(component.isFavorite).toBeTruthy();
      expect(component.text).toEqual('added_favorite-sv');
      expect(component.changeInfo.emit).toHaveBeenCalledWith({
        favorite: component.isFavorite,
      })
    })

    it('should handleFav when favorites is false but service response error', () => {
      transferThirdService.addFavorite.and.returnValue(mockObservableError({}))
      clickElement(fixture, 'i.sprint2-icon-favoritos')
      fixture.detectChanges();

      expect(component.isFavorite).toBeFalsy()
      expect(component.text).toEqual('add_to_favorite-sv');
      expect(component.changeInfo.emit).toHaveBeenCalledWith({
        favorite: component.isFavorite,
        typeAlert: 'error',
        message: 'error_add_favorite_account'
      })
    })
  });


  describe('Test with favorite is true', () => {

    beforeEach(() => {
      spyOn(component.changeInfo, 'emit');
      component.isFavorite = true;
      component.account = accountToChangeFavorite
    })

    it('should handleFav when favorites is true', () => {
      transferThirdService.deleteFavorite.and.returnValue(mockObservable({}))
      clickElement(fixture, 'i.sprint2-icon-favoritos')
      fixture.detectChanges();
      expect(component.isFavorite).toBeFalsy()
      expect(component.text).toEqual('add_to_favorite-sv');
      expect(component.changeInfo.emit).toHaveBeenCalledWith({
        favorite: component.isFavorite,
      })
    })

    it('should handleFav when favorites is true but service response error', () => {
      transferThirdService.deleteFavorite.and.returnValue(mockObservableError({}))
      clickElement(fixture, 'i.sprint2-icon-favoritos')
      fixture.detectChanges();

      expect(component.isFavorite).toBeTruthy();
      expect(component.text).toEqual('added_favorite-sv');
      expect(component.changeInfo.emit).toHaveBeenCalledWith({
        favorite: component.isFavorite,
        typeAlert: 'error',
        message: 'error_add_favorite_account'
      })
    })
  });


});
