import {ThirdTransferFormValuesBuilder} from "./third-transfer.interface";

describe('ThirdTransferFormValuesBuilder', () => {
  let builder: ThirdTransferFormValuesBuilder;

  beforeEach(() => {
    builder = new ThirdTransferFormValuesBuilder();
  });

  it('should build a valid IThirdTransferFormValues object', () => {
    const formValues = builder
      .accountDebited('1234567890')
      .amount('1000')
      .email('my-email@example.com')
      .comment('This is a comment.')
      .build();

    expect(formValues.accountDebited).toBe('1234567890');
    expect(formValues.amount).toBe('1000');
    expect(formValues.email).toBe('my-email@example.com');
    expect(formValues.comment).toBe('This is a comment.');
  });

});
