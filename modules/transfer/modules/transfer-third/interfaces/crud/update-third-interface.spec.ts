import {UpdateThirdBuilder} from "./update-third-interface";

describe('UpdateThirdBuilder', () => {
  let builder: UpdateThirdBuilder;

  beforeEach(() => {
    builder = new UpdateThirdBuilder();
  });

  it('should build a valid IUpdateThird object', () => {
    const updateThird = builder
      .currency('USD')
      .alias('My Bank Account')
      .email('my-email@example.com')
      .type('BANK_ACCOUNT')
      .favorite(true)
      .build();

    expect(updateThird.currency).toBe('USD');
    expect(updateThird.alias).toBe('My Bank Account');
    expect(updateThird.email).toBe('my-email@example.com');
    expect(updateThird.type).toBe('BANK_ACCOUNT');
    expect(updateThird.favorite).toBe(true);
  });
});
