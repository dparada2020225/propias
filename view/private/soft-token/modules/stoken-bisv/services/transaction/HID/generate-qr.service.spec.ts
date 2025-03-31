import { TestBed } from '@angular/core/testing';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UtilTransactionService } from 'src/app/service/common/util-transaction.service';
import { GenerateQrService } from './generate-qr.service';
import { IGenerateQrSToken, IQrValue } from '../../../interfaces/stkn-bisv.interface';

xdescribe('GenerateQrService', () => {
  let service: GenerateQrService;
  let httpMock: HttpTestingController;

  let util: jasmine.SpyObj<UtilTransactionService>


  beforeEach(() => {
    const utilsSpy = jasmine.createSpyObj('UtilService', ['addHeaderToken']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: UtilTransactionService, useValue: utilsSpy}
      ]
    });
    service = TestBed.inject(GenerateQrService);
    httpMock = TestBed.inject(HttpTestingController);

    TestBed.inject(UtilTransactionService) as jasmine.SpyObj<UtilTransactionService>;

  });

  it('should be created GenerateQrService', () => {
    expect(service).toBeTruthy();
  });

  it('should make a POST request to /v1/soft-token/generate-qr', () => {
    const respuesta: IQrValue = { qrValue: 'La petición ha sido procesada correctamente' };
    const datos: IGenerateQrSToken = { inputCode: '301', username: 'KPOSADAS', typeTokenValidation: 'T' };
    const token = '12345';

    // Llamar al método que hace la petición POST
    service.generateQR(datos, token ).subscribe(res => {
      // Verificar que se haya recibido la respuesta correcta
      expect(res).toEqual(respuesta);
    });

    // Verificar que se haya hecho la petición POST correctamente
    const req = httpMock.expectOne('/v1/soft-token/generate-qr');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(datos);

    // Simular la respuesta del servidor
    req.flush(respuesta);

    // Verificar que no hayan quedado peticiones pendientes
    httpMock.verify();
  });

  it('should make a POST request to /v1/soft-token/passless/generate-qr', () => {
    const respuesta: IQrValue = { qrValue: 'La petición ha sido procesada correctamente' };
    const datos: IGenerateQrSToken = { inputCode: '301', username: 'KPOSADAS', typeTokenValidation: 'T' };
    const token = '12345';

    // Llamar al método que hace la petición POST
    service.generateQRExposed(datos, token ).subscribe(res => {
      // Verificar que se haya recibido la respuesta correcta
      expect(res).toEqual(respuesta);
    });

    // Verificar que se haya hecho la petición POST correctamente
    const req = httpMock.expectOne('/v1/soft-token/passless/generate-qr');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(datos);

    // Simular la respuesta del servidor
    req.flush(respuesta);

    // Verificar que no hayan quedado peticiones pendientes
    httpMock.verify();
  });

});
