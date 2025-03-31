import { TestBed } from '@angular/core/testing';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { IResOkOTP } from '../../../interfaces/stkn-bisv.interface';
import { ValidateOtpService } from './validate-otp.service';

xdescribe('ValidateOtpService', () => {
  let service: ValidateOtpService;
  let httpMock: HttpTestingController;


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],

    });
    service = TestBed.inject(ValidateOtpService);
    httpMock = TestBed.inject(HttpTestingController);

  });

  it('should be created ValidateOtpService', () => {
    expect(service).toBeTruthy();
  });

  it('should make a POST request to /v1/soft-token/passless/validate-otp when stokenPreLogin is true', () => {
    const respuesta: IResOkOTP = {
      code: "305",
      message: "El token ingresado es válido",
      timestamp: "2023-04-21T13:53:35.907-05:00",
      status: 200
  }
    const datos = {
      username: "ERODRIGUEZ1",
      password: "936056"
  }

    // Llamar al método que hace la petición POST
    service.validateOTPManager(true, datos).subscribe((res: IResOkOTP) => {
      // Verificar que se haya recibido la respuesta correcta
      expect(res).toEqual(respuesta);
    });

    // Verificar que se haya hecho la petición POST correctamente
    const req = httpMock.expectOne('/v1/soft-token/passless/validate-otp');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(datos);

    // Simular la respuesta del servidor
    req.flush(respuesta);

    // Verificar que no hayan quedado peticiones pendientes
    httpMock.verify();
  });

  it('should make a POST request to /v1/soft-token/validate-otp when stokenPreLogin is false', () => {
    const respuesta: IResOkOTP = {
      code: "305",
      message: "El token ingresado es válido",
      timestamp: "2023-04-21T13:53:35.907-05:00",
      status: 200
  }
    const datos = {
      username: "ERODRIGUEZ1",
      password: "936056"
  }

    // Llamar al método que hace la petición POST
    service.validateOTPManager(false, datos).subscribe((res: IResOkOTP) => {
      // Verificar que se haya recibido la respuesta correcta
      expect(res).toEqual(respuesta);
    });

    // Verificar que se haya hecho la petición POST correctamente
    const req = httpMock.expectOne('/v1/soft-token/validate-otp');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(datos);

    // Simular la respuesta del servidor
    req.flush(respuesta);

    // Verificar que no hayan quedado peticiones pendientes
    httpMock.verify();
  });


});
