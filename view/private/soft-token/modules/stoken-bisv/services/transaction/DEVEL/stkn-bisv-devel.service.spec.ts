import { TestBed } from '@angular/core/testing';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UtilTransactionService } from 'src/app/service/common/util-transaction.service';
import { IActivateAfiliation, IAssignStknBisv, IGenerateQRStknBisv, IGracePeriodStknBisv } from '../../../interfaces/stkn-bisv-devel.interface';
import { StknBisvDevelService } from './stkn-bisv-devel.service';

fdescribe('StknBisvDevelService', () => {
  let service: StknBisvDevelService;

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
    service = TestBed.inject(StknBisvDevelService);
    httpMock = TestBed.inject(HttpTestingController);

    TestBed.inject(UtilTransactionService) as jasmine.SpyObj<UtilTransactionService>;
  });

  it('should be created StknBisvDevelService', () => {
    expect(service).toBeTruthy();
  });

  it('should call to grace period', ()=>{

    const res: IGracePeriodStknBisv = {
      hasGracePeriod: true
    };

    service.consultGracePeriod().subscribe(res => {
      expect(res).toEqual(res);
    });

    const req = httpMock.expectOne('/v1/tokens/grace-period-soft-token');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(null);

    req.flush(res);

    httpMock.verify();

  });

  it('should call to insertOnAfiliationLog', ()=>{

    const res: IActivateAfiliation = {
      code: '204',
      description: '',
      reference: '1234'
    };

    service.insertOnAfiliationLog().subscribe(res => {
      expect(res).toEqual(res);
    });

    const req = httpMock.expectOne('/v1/tokens/membership-log-soft-token');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(null);

    req.flush(res);

    httpMock.verify();

  });

  it('should call to stokenActivationOnAs', ()=>{

    const res: IActivateAfiliation = {
      code: '204',
      description: '',
      reference: '1234'
    };

    service.stokenActivationOnAs().subscribe(res => {
      expect(res).toEqual(res);
    });

    const req = httpMock.expectOne('/v1/tokens/soft-token-activation');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(null);

    req.flush(res);

    httpMock.verify();

  });

  it('should call to generateCodeQR', ()=>{

    const res: IGenerateQRStknBisv = {
      responseCode: '204',
      responseMessage: ''
    }

    service.generateCodeQR('N').subscribe(res => {
      expect(res).toEqual(res);
    });

    const req = httpMock.expectOne('/v1/tokens/generate-secret');
    expect(req.request.method).toBe('POST');

    req.flush(res);

    httpMock.verify();

  });

  it('should call to generateCodeQRExposed', ()=>{

    const res: IGenerateQRStknBisv = {
      responseCode: '204',
      responseMessage: ''
    }

    service.generateCodeQRExposed('kposadas', 'N').subscribe(res => {
      expect(res).toEqual(res);
    });

    const req = httpMock.expectOne('/v1/exposed/tokens/generate-secret');
    expect(req.request.method).toBe('POST');

    req.flush(res);

    httpMock.verify();

  });

  it('should call to generateCodeQRExposed', ()=>{

    const res: IGenerateQRStknBisv = {
      responseCode: '204',
      responseMessage: ''
    }

    service.generateCodeQRExposed('kposadas', 'N').subscribe(res => {
      expect(res).toEqual(res);
    });

    const req = httpMock.expectOne('/v1/exposed/tokens/generate-secret');
    expect(req.request.method).toBe('POST');

    req.flush(res);

    httpMock.verify();

  });

  it('should call to validateStatusQR', ()=>{

    const res: IGenerateQRStknBisv = {
      responseCode: '204',
      responseMessage: ''
    }

    service.validateStatusQR('N').subscribe(res => {
      expect(res).toEqual(res);
    });

    const req = httpMock.expectOne('/v1/tokens/off-get-status-qr');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({user: 'N'});

    req.flush(res);

    httpMock.verify();

  });

  it('should call to validateStatusQRExposed', ()=>{

    const res: IGenerateQRStknBisv = {
      responseCode: '204',
      responseMessage: ''
    }

    service.validateStatusQRExposed('kveliz', '').subscribe(res => {
      expect(res).toEqual(res);
    });

    const req = httpMock.expectOne('/v1/exposed/tokens/off-get-status-qr');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({username: 'kveliz'});

    req.flush(res);

    httpMock.verify();

  });

  it('should call to firstValidateToken', ()=>{

    const res: IGenerateQRStknBisv = {
      responseCode: '204',
      responseMessage: ''
    }

    service.firstValidateToken('1234').subscribe(res => {
      expect(res).toEqual(res);
    });

    const req = httpMock.expectOne('/v1/tokens/first-validate-token');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({token: '1234'});

    req.flush(res);

    httpMock.verify();

  });

  it('should call to firstValidateTokenExposed', ()=>{

    const res: IGenerateQRStknBisv = {
      responseCode: '204',
      responseMessage: ''
    }

    service.firstValidateTokenExposed('1234', 'kveliz').subscribe(res => {
      expect(res).toEqual(res);
    });

    const req = httpMock.expectOne('/v1/exposed/tokens/first-validate-token');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({username: 'kveliz',token: '1234'});

    req.flush(res);

    httpMock.verify();

  });

  it('should call to validateStokenAfiliation', ()=>{

    const res: IGenerateQRStknBisv = {
      responseCode: '204',
      responseMessage: ''
    }

    service.validateStokenAfiliation().subscribe(res => {
      expect(res).toEqual(res);
    });

    const req = httpMock.expectOne('/v1/tokens/validate-membership-soft-token');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(null);

    req.flush(res);

    httpMock.verify();

  });

  it('should call to changeDeviceStoken', ()=>{

    const res: IGenerateQRStknBisv = {
      responseCode: '204',
      responseMessage: ''
    }

    service.changeDeviceStoken('').subscribe(res => {
      expect(res).toEqual(res);
    });

    const req = httpMock.expectOne('/v1/tokens/change-device-soft-token');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(null);

    req.flush(res);

    httpMock.verify();

  });

  it('should call to assignTokenTypeExposed', ()=>{

    const res: IAssignStknBisv = {
      responseCode: '204',
      responseMessage: ''
    }

    service.assignTokenTypeExposed('kveliz','S','N', '12345', '').subscribe(res => {
      expect(res).toEqual(res);
    });

    const req = httpMock.expectOne('/v1/passless/tokens/assign-token-type');
    expect(req.request.method).toBe('POST');

    req.flush(res);

    httpMock.verify();

  });


  it('should call to assignTokenType', ()=>{

    const res: IAssignStknBisv = {
      responseCode: '204',
      responseMessage: ''
    }

    service.assignTokenType(true, '12345').subscribe(res => {
      expect(res).toEqual(res);
    });

    const req = httpMock.expectOne('/v1/tokens/assign-token-type');
    expect(req.request.method).toBe('POST');

    req.flush(res);

    httpMock.verify();

  });

  it('should call to assignTokenType without token', ()=>{

    const res: IAssignStknBisv = {
      responseCode: '204',
      responseMessage: ''
    }

    service.assignTokenType(false, '12345').subscribe(res => {
      expect(res).toEqual(res);
    });

    const req = httpMock.expectOne('/v1/tokens/assign-token-type');
    expect(req.request.method).toBe('POST');

    req.flush(res);

    httpMock.verify();

  });
});

