// Generated by CodiumAI

import {OwnTransferAccount, OwnTransferFormValuesBuilder} from './own-transfer.interface';

describe('OwnTransferAccount_class', () => {
  it('test_build_with_all_properties_set', () => {
    const ownTransferAccount = new OwnTransferAccount()
      .account('1234567890')
      .agency(1234)
      .alias('alias')
      .availableAmount(1000)
      .cif('cif')
      .consortium('consortium')
      .currency('USD')
      .enabled(true)
      .mask('mask')
      .name('name')
      .product(1)
      .status('status')
      .subproduct(2)
      .totalAmount(500);
    const result = ownTransferAccount.build();
    expect(result).toEqual({
      account: '1234567890',
      agency: 1234,
      alias: 'alias',
      availableAmount: 1000,
      cif: 'cif',
      consortium: 'consortium',
      currency: 'USD',
      enabled: true,
      mask: 'mask',
      name: 'name',
      product: 1,
      status: 'status',
      subproduct: 2,
      totalAmount: 500,
    });
  });

  it('test_empty_input_values', () => {
    const builder = new OwnTransferFormValuesBuilder();
    const formValues = builder
      .accountDebited(null as any)
      .accountCredit(undefined as any)
      .amount('')
      .comment(null as any)
      .build();
    expect(formValues).toEqual({
      accountDebited: null as any,
      accountCredit: undefined as any,
      amount: '',
      comment: null as any,
    });
  });
});

