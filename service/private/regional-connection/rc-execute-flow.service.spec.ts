import {TestBed} from '@angular/core/testing';

import {RcExecuteFlowService} from './rc-execute-flow.service';

xdescribe('RcExecuteFlowService', () => {
  let service: RcExecuteFlowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RcExecuteFlowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

xdescribe('RcExecuteFlowService-RegionalConnetion', () => {
  let service: RcExecuteFlowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RcExecuteFlowService);
  });

  // it('should verify url status', async () => {
  //   const response = await service.validateRegionalConnectionStatus();
  //
  //   expect(response).toBe(true || false);
  // })

  it('should login status', () => {
    const status = service.setLoginStatus();

    expect(status).toBeDefined();
  })

  it('should call regionalConnectionLoginStatus method with the correct argument', () => {
    // Arrange
    const homePrivateServiceMock = jasmine.createSpyObj('HomePrivateService', ['regionalConnectionLoginStatus']);

    // Act
    service.setLoginStatus();

    // Assert
    expect(homePrivateServiceMock.regionalConnectionLoginStatus).toHaveBeenCalledWith('Error al establecer conexion con Conexion Regional');
  });

  /* it('should return true when the fetch request is successful', async () => {
     // Arrange
     spyOn(service, 'setLoginStatus');

     // Act
     const result = await service.validateRegionalConnectionStatus();

     // Assert
     expect(result).toBeTrue();
     expect(service.setLoginStatus).not.toHaveBeenCalled();
   });*/

  /*it('should retrieve the token for regional connection and redirect to regional connection', () => {
    // Mock dependencies
    const utilsMock = jasmine.createSpyObj('UtilService', ['showLoader', 'hideLoader']);
    const homePrivateServiceMock = jasmine.createSpyObj('HomePrivateService', ['getTokenForRegionalConnection', 'redirectToReginalConnection']);

    // Set up mock responses
    const authenticateUserResult = { token: 'token' };
    homePrivateServiceMock.getTokenForRegionalConnection.and.returnValue(of({ authenticateUserResult }));
    homePrivateServiceMock.redirectToReginalConnection.and.returnValue(true);

    // Call the execute method
    service.execute();

    // Verify that the necessary methods were called
    expect(utilsMock.showLoader).toHaveBeenCalled();
    expect(homePrivateServiceMock.getTokenForRegionalConnection).toHaveBeenCalled();
    expect(homePrivateServiceMock.redirectToReginalConnection).toHaveBeenCalledWith({
      countryCode: '222',
      bankCode: '3',
      installationCode: '0',
      user: '',
      userType: '',
      tokenType: '',
      token: authenticateUserResult.token
    });
    expect(utilsMock.hideLoader).toHaveBeenCalled();
  });*/
});

