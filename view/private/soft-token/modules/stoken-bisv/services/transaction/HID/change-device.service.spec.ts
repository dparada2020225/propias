import { TestBed } from '@angular/core/testing';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UtilTransactionService } from 'src/app/service/common/util-transaction.service';
import { IChangeDeviceReq } from '../../../interfaces/stkn-bisv.interface';
import { ChangeDeviceService } from './change-device.service';

xdescribe('ChangeDeviceService', () => {
  let service: ChangeDeviceService;
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
    service = TestBed.inject(ChangeDeviceService);
    httpMock = TestBed.inject(HttpTestingController);

    TestBed.inject(UtilTransactionService) as jasmine.SpyObj<UtilTransactionService>;


  });

  it('should be created ChangeDeviceService', () => {
    expect(service).toBeTruthy();
  });


  const qrCode = {
    "qrValue": "{\"ver\":\"v8\",\"url\":\"sdpru4t.bi.com.gt:443/BANCAREMOTA6\",\"uid\":\"PAERODRIGUEZ1\",\"did\":\"991730\",\"dty\":\"DT_TDSV4\",\"dir\":\"111760\",\"pch\":\"CH_TDSPROV\",\"pth\":\"AT_TDSOOB\",\"sec\":\"\",\"pss\":\"NkhQQ1ZHTEtEMA==\"}"
  };

  it('debe hacer una petición POST', () => {
    const respuesta =  qrCode;
    const datos: IChangeDeviceReq = { code: '301', username: "ERODRIGUEZ1" };
    const token = '12345';

    // Llamar al método que hace la petición POST
    service.changeDevice(datos, token).subscribe(res => {
      // Verificar que se haya recibido la respuesta correcta
      expect(res).toEqual(respuesta);
    });

    // Verificar que se haya hecho la petición POST correctamente
    const req = httpMock.expectOne('/v1/soft-token/change-device');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(datos);

    // Simular la respuesta del servidor
    req.flush(respuesta);

    // Verificar que no hayan quedado peticiones pendientes
    httpMock.verify();
  });


});
