import { TestBed } from '@angular/core/testing';

import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { IRequestSearchUser } from '../../../interfaces/stkn-bisv.interface';
import { SearchUserService } from './search-user.service';

xdescribe('SearchUserService', () => {
  let service: SearchUserService;
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(SearchUserService);
    httpMock = TestBed.inject(HttpTestingController);
    TestBed.inject(HttpClient);

  });

  it('should be created SearchUserService', () => {
    expect(service).toBeTruthy();
  });

  const resOk = {
    code: "304",
    errorMessage: "El usuario existe en 4Tress y tiene dispositivo asociado con QR generado",
    message: "El usuario existe en 4Tress y tiene dispositivo asociado con QR generado",
    timestamp: "2023-04-21T16:18:05.221-05:00",
    exception: "com.bytesw.tyu.bi.clients.soft.token.exceptions.SoftTokenException",
    status: 400
  };

  it('should call search user exposed if the stoken preLogin is true', () => {

    let request: IRequestSearchUser = { externalId : 'KVELIZ'};


    service.userStatus(request.externalId, true ).subscribe( res => {
      expect(res).toEqual(resOk);
    });

        // Verificar que se haya hecho la petición POST correctamente
        const req = httpMock.expectOne('/v1/soft-token/passless/search-user');
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(request);

        // Simular la respuesta del servidor
        req.flush(resOk);

        // Verificar que no hayan quedado peticiones pendientes
        httpMock.verify();


  });


  it('should call search user if the stoken preLogin is false', () => {

    let request: IRequestSearchUser = { externalId : 'KVELIZ'};


    service.userStatus(request.externalId, false ).subscribe( res => {
      expect(res).toEqual(resOk);
    });

        // Verificar que se haya hecho la petición POST correctamente
        const req = httpMock.expectOne('/v1/soft-token/search-user');
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(request);

        // Simular la respuesta del servidor
        req.flush(resOk);

        // Verificar que no hayan quedado peticiones pendientes
        httpMock.verify();


  });



});
