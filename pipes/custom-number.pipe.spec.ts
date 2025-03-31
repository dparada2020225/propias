import { CustomNumberPipe } from './custom-number.pipe';

describe('CustomNumberPipe', () => {

  let pipe: CustomNumberPipe;

  beforeEach(() => {
    pipe = new CustomNumberPipe
  })

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform a string with commas to a formatted number', () => {
    const value = '1,234.567';
    const transformedValue = pipe.transform(value);

    expect(transformedValue).toBe('1,234.57');
  });

  it('should transform a string without commas to a formatted number', () => {
    const value = '1234.567';
    const transformedValue = pipe.transform(value);

    expect(transformedValue).toBe('1,234.57');
  });

  it('should transform a number to a formatted number', () => {
    const value = 1234.567;
    const transformedValue = pipe.transform(value);

    expect(transformedValue).toBe('1,234.57');
  });

  it('should transform a number with custom format', () => {
    const value = 1234.567;
    const format = '1.0-0';
    const transformedValue = pipe.transform(value, format);

    expect(transformedValue).toBe('1,235');
  });

});
