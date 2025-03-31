import { environment } from 'src/environments/environment';
import { ProductListComponent } from './product-list.component';

describe('ProductListComponent', () => {
  let component: ProductListComponent;

  beforeEach(() => {
    component = new ProductListComponent();
  });

  it('test_menu_opend_sets_arrow_to_true', () => {
    component.arrow = false;
    component.menuOpend();
    expect(component.arrow).toBe(true);
  });

  it('test_menu_closed_sets_arrow_to_false', () => {
    component.arrow = true;
    component.menuClosed();
    expect(component.arrow).toBe(false);
  });

  it('should set the productList property correctly', () => {
    const sampleData = {
      production: 'productListProduction',
      staging: 'productListStaging',
    };

    component.receiverProductList = sampleData;
    expect(component.productList).toEqual(sampleData[environment.profile]);
  });

  it('test_menu_trigger_is_undefined', () => {
    const component = new ProductListComponent();
    expect(component.href).toThrowError();
  });
});
// import { EProfile } from 'src/app/enums/profile.enum';
// import { ProductListComponent } from './product-list.component';
// import { environment } from 'src/environments/environment';

// describe('ProductListComponent', () => {

//   it("test_update_arrow_toggles_arrow_value", () => {
//     const component = new ProductListComponent();
//     component.arrow = false;
//     component.updateArrow();
//     expect(component.arrow).toBe(true);
//     component.updateArrow();
//     expect(component.arrow).toBe(false);
//   });

//   it("test_menu_opend_sets_arrow_to_true", () => {
//     const component = new ProductListComponent();
//     component.arrow = false;
//     component.menuOpend();
//     expect(component.arrow).toBe(true);
//   });

//   it("test_menu_closed_sets_arrow_to_false", () => {
//     const component = new ProductListComponent();
//     component.arrow = true;
//     component.menuClosed();
//     expect(component.arrow).toBe(false);
//   });

//   it("should return 'content-sv' when profile is 'bisv'", () => {
//     const component = new ProductListComponent();
//     component.profile = EProfile.SALVADOR;
//     expect(component.classNameSV).toBe("content-sv");
//   });

//   it("should return empty string when profile is not 'bisv'", () => {
//     const component = new ProductListComponent();
//     component.profile = EProfile.HONDURAS;
//     expect(component.classNameSV).toBe("");
//   })

//   it("should return 'product-list-sv' when profile is 'bisv'", () => {
//     const component = new ProductListComponent();
//     component.profile = EProfile.SALVADOR;
//     expect(component.styleProfile).toBe("product-list-sv");
//   });

//   it("should return empty string when profile is not 'bisv'", () => {
//     const component = new ProductListComponent();
//     component.profile = EProfile.HONDURAS
//     expect(component.styleProfile).toBe("");
//   });

//   it('should set the productList property correctly', () => {
//     const testComponent = new ProductListComponent();
//     const sampleData = {
//       'production': 'productListProduction',
//       'staging': 'productListStaging'
//     };

//     testComponent.receiverProductList = sampleData;
//     expect(testComponent.productList).toEqual(sampleData[environment.profile]);
//   });

// });
