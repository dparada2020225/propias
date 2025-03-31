export interface IBisvMassiveAchLoteDetailRawResponse {
  achDetails: AchDetail[];
}

interface AchDetail {
  id:           number;
  empresa:      number;
  lote:         number;
  banco:        number;
  producto:     number;
  moneda:       string;
  cuenta:       string;
  monto:        number;
  comentario:   string;
  bancoDesc:    string;
  productoDesc: string;

  serviceType: string,
  targetType: string,
  email: string
}

export type TBisvMassiveAchLoteDetailMappedResponse = Array<IBisvMassiveAchLoteRegisterInDetailMapped>;


export interface IBisvMassiveAchLoteRegisterInDetailMapped {
  id:           number;
  business:      number;
  lote:         number;
  bankCode:        number;
  product:     number;
  currency:       string;
  account:       string;
  amount:        number;
  comment:   string;
  bankName:    string;
  productName: string;

  serviceType: string,
  targetType: string,
  email: string

}
