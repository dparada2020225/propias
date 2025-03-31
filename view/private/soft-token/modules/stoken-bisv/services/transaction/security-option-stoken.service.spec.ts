import { TestBed } from '@angular/core/testing';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SecurityOptionStokenService } from './security-option-stoken.service';

xdescribe('SecurityOptionStokenService', () => {
  let service: SecurityOptionStokenService;
  let httpMock: HttpTestingController;


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],

    });
    service = TestBed.inject(SecurityOptionStokenService);
    httpMock = TestBed.inject(HttpTestingController);

  });

  let response = {
    name: 'KVELIZ',
    phone: '123455',
    email: 'tote.kev@gmail.com'
  }

  it('should be created SecurityOptionStokenService', () => {
    expect(service).toBeTruthy();
  });

  it('should return a object with date about user from /v1/sec-profile/new-security-profile/passless/check-profile', () => {
    let request = { externalId: 'KVELIZ' };


    service.getProfileExposed(request.externalId).subscribe(res => {
      expect(res.body).toEqual(response);
    });

    // Verificar que se haya hecho la petición POST correctamente
    const req = httpMock.expectOne('/v1/sec-profile/new-security-profile/passless/check-profile?customer=KVELIZ');
    expect(req.request.method).toBe('GET');

    // Simular la respuesta del servidor
    req.flush(response);

    // Verificar que no hayan quedado peticiones pendientes
    httpMock.verify();
  });


  it('should return a object with date about user from /v1/sec-profile/new-security-profile/passless/check-profile', () => {


    service.sendAffiliationCodeExpose('123456', '01').subscribe(res => {
      expect(res).toEqual(response);
    });

    // Verificar que se haya hecho la petición POST correctamente
    const req = httpMock.expectOne('/v1/sec-profile/new-security-profile/passless/send-affiliation-code');
    expect(req.request.method).toBe('POST');

    // Simular la respuesta del servidor
    req.flush(response);

    // Verificar que no hayan quedado peticiones pendientes
    httpMock.verify();
  });
});
