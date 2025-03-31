import { TestBed } from '@angular/core/testing';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { IUserDataStoken } from '../../../interfaces/stkn-bisv.interface';
import { MembershipLogService } from './membership-log.service';

xdescribe('MembershipLogService', () => {
  let service: MembershipLogService;
  let httpMock: HttpTestingController;


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],

    });
    service = TestBed.inject(MembershipLogService);
    httpMock = TestBed.inject(HttpTestingController);

  });

  const resOk = {
    code: "0",
    description: "",
    reference: "zec31JV5Fzlr"
}

  it('should be created MembershipLogService', () => {
    expect(service).toBeTruthy();
  });

  it('should call membership exposed if the stoken preLogin is true', () => {

    const data: IUserDataStoken = {
      code: '305',
      username: 'KVELIZ'
    };

    service.membershipManager(true, data).subscribe( res => {
      expect(res).toEqual(resOk);
    });

        // Verificar que se haya hecho la petición POST correctamente
        const req = httpMock.expectOne('/v1/soft-token/passless/membership-log');
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual({username: data.username});

        // Simular la respuesta del servidor
        req.flush(resOk);

        // Verificar que no hayan quedado peticiones pendientes
        httpMock.verify();


  });

  it('should call membership if the stoken preLogin is false', () => {

    const data: IUserDataStoken = {
      code: '305',
      username: 'KVELIZ'
    };

    service.membershipManager(false, data).subscribe( res => {
      expect(res).toEqual(resOk);
    });

        // Verificar que se haya hecho la petición POST correctamente
        const req = httpMock.expectOne('/v1/soft-token/membership-log');
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual({username: data.username});

        // Simular la respuesta del servidor
        req.flush(resOk);

        // Verificar que no hayan quedado peticiones pendientes
        httpMock.verify();


  });

});
