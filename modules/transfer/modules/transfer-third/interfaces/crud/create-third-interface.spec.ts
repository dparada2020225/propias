import {CreateThirdBuilder} from "./create-third-interface";

describe('CreateThirdBuilder', () => {
  let builder: CreateThirdBuilder;

  beforeEach(() => {
    builder = new CreateThirdBuilder();
  });

  it('should build a valid ICreateThird object', () => {
    const createThird = builder
      .account('1234567890')
      .type('BANK_ACCOUNT')
      .currency('USD')
      .alias('My Bank Account')
      .email('my-email@example.com')
      .favorite(true)
      .build();

    expect(createThird.account).toBe('1234567890');
    expect(createThird.type).toBe('BANK_ACCOUNT');
    expect(createThird.status).toBe('A');
    expect(createThird.currency).toBe('USD');
    expect(createThird.alias).toBe('My Bank Account');
    expect(createThird.email).toBe('my-email@example.com');
    expect(createThird.favorite).toBe(true);
  });
});
