import {AESCryptographyService, RSACryptographyService} from '@adf/security';
import {TestBed} from '@angular/core/testing';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {RsaKey} from 'src/app/models/encryption-keys.interface';
import {Base64Service} from '../common/base64.service';
import {UtilService} from '../common/util.service';
import {CryptographyService} from './cryptography.service';

xdescribe('CryptographyService', () => {
  let service: CryptographyService;
  let base64: jasmine.SpyObj<Base64Service>;
  let aesCryptographyService: jasmine.SpyObj<AESCryptographyService>;
  let utils: jasmine.SpyObj<UtilService>;

  beforeEach(() => {

    const base64Spy = jasmine.createSpyObj('Base64Service', ['decoded', 'encryption'])
    const aesCryptographyServiceSpy = jasmine.createSpyObj('AESCryptographyService', ['decrypt', 'genKey', 'encrypt'])
    const rsaCryptographyServiceSpy = jasmine.createSpyObj('RSACryptographyService', ['decrypt', 'encrypt'])
    const utilsSpy = jasmine.createSpyObj('UtilService', ['substr'])

    TestBed.configureTestingModule({
      declarations: [],
      providers: [
        { provide: Base64Service, useValue: base64Spy },
        { provide: AESCryptographyService, useValue: aesCryptographyServiceSpy },
        { provide: RSACryptographyService, useValue: rsaCryptographyServiceSpy },
        { provide: UtilService, useValue: utilsSpy },
      ],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
    });

    service = TestBed.inject(CryptographyService);
    base64 = TestBed.inject(Base64Service) as jasmine.SpyObj<Base64Service>;
    aesCryptographyService = TestBed.inject(AESCryptographyService) as jasmine.SpyObj<AESCryptographyService>;
    utils = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  const rsaKey: RsaKey = {
    public: 'public',
    private: 'private'
  }

  const base: any = 'contentBase64'

  it('should decrypt', () => {
    base64.decoded.and.returnValue('qwds.erffssd')
    aesCryptographyService.decrypt.and.returnValue('qwert')

    const res = service.decrypt(rsaKey, base)

    expect(res).toEqual('qwert')
  })

  it('should encrypt', () => {
    aesCryptographyService.genKey.and.returnValue({
      key: 'qwds.erffssd',
      iv: 'qwert'
    })

    base64.encryption.and.returnValue('qwds.erffssdsddsf')
    const res = service.encrypt(rsaKey, base)
    expect(res).toEqual('qwds.erffssdsddsf')
  })

  it('should rsa With Chunks', () => {
    base64.encryption.and.returnValue('asfasdf')
    utils.substr.and.returnValue('asfasdf')
    service.chunkSize = 5;
    const req = service.rsaWithChunks(rsaKey, 'seefdfsfdssdxcd');
    expect(req).toEqual('asfasdf.asfasdf.asfasdf.asfasdf')
  })

});
