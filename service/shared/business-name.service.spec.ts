import { TestBed } from '@angular/core/testing';

import { EProfile } from 'src/app/enums/profile.enum';
import { BusinessNameService } from './business-name.service';

describe('BusinessNameService', () => {
  let service: BusinessNameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BusinessNameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getBusiness', () => {
    it('should get the business name profile banpais', () => {
      const res = service.getBusiness(EProfile.HONDURAS)
      expect(res).toEqual('Banpaís')
    })

    it('should get the business name profile bisv', () => {
      const res = service.getBusiness(EProfile.SALVADOR)
      expect(res).toEqual('Bi en Línea')
    })

    it('should get the business name profile bipa', () => {
      const res = service.getBusiness(EProfile.PANAMA)
      expect(res).toEqual('Bi en Línea')
    })

    it('should get the business name profile Unknown', () => {
      const res = service.getBusiness(null as any)
      expect(res).toEqual('Unknown')
    })
  })

  describe('getBusinessType', () => {
    it('should get the business Type name profile banpais', () => {
      const res = service.getBusinessType(EProfile.HONDURAS)
      expect(res).toEqual('BANPAIS S.A')
    })

    it('should get the business Type name profile bisv', () => {
      const res = service.getBusinessType(EProfile.SALVADOR)
      expect(res).toEqual('BI El Salvador S.A')
    })

    it('should get the business Type name profile bipa', () => {
      const res = service.getBusinessType(EProfile.PANAMA)
      expect(res).toEqual('BI Bank S.A')
    })

    it('should get the business Type name profile Unknown', () => {
      const res = service.getBusinessType(null as any)
      expect(res).toEqual('Unknown')
    })
  })

  it('should get Account Number', () => {
    const account = '1234567890'
    service.accountNumber = account
    const res = service.getAccountNumber();
    expect(res).toEqual(account)
  })

});
