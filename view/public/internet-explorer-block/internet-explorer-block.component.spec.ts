import {of} from 'rxjs';
import {InternetExplorerBlockComponent} from './internet-explorer-block.component';

describe('InternetExplorerBlockComponent', () => {

  let translateServiceMock;
  let storageServiceMock;

  beforeEach(() => {
    translateServiceMock = jasmine.createSpyObj('TranslateService', ['get']);
    storageServiceMock = jasmine.createSpyObj('StorageService', ['getItem']);
  })


  it("test_ngOnInit_sets_properties_correctly", () => {
    translateServiceMock.get.and.returnValue(of('valor falso'));
    storageServiceMock.getItem.and.returnValue(null);

    const component = new InternetExplorerBlockComponent(translateServiceMock, storageServiceMock);
    component.ngOnInit();
    expect(component.settingsData).toBeNull();
  });

  it('test_help_text_translation', () => {
    translateServiceMock.get.and.returnValue(of('translated help text'));
    storageServiceMock.getItem.and.returnValue(null);

    const component = new InternetExplorerBlockComponent(translateServiceMock, storageServiceMock);
    component.ngOnInit();
    expect(component.helpText).toEqual('translated help text');
  });


});
