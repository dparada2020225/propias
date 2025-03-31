import { IntToMonthPipe } from './int-to-month.pipe';

describe('IntToMonthPipe', () => {

  let pipe: IntToMonthPipe;

  beforeEach(() => {
    pipe = new IntToMonthPipe();
  })

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform "1" to "january"', () => {
    const value: number = 1;
    const transformedValue = pipe.transform(value);
    expect(transformedValue).toBe('january')
  });

  it('should transform "2" to "february"', () => {
    const value: number = 2;
    const transformedValue = pipe.transform(value);
    expect(transformedValue).toBe('february')
  });

  it('should transform "3" to "march"', () => {
    const value: number = 3;
    const transformedValue = pipe.transform(value);
    expect(transformedValue).toBe('march')
  });

  it('should transform "4" to "april"', () => {
    const value: number = 4;
    const transformedValue = pipe.transform(value);
    expect(transformedValue).toBe('april')
  });

  it('should transform "5" to "may"', () => {
    const value: number = 5;
    const transformedValue = pipe.transform(value);
    expect(transformedValue).toBe('may')
  });

  it('should transform "6" to "june"', () => {
    const value: number = 6;
    const transformedValue = pipe.transform(value);
    expect(transformedValue).toBe('june')
  });

  it('should transform "7" to "july"', () => {
    const value: number = 7;
    const transformedValue = pipe.transform(value);
    expect(transformedValue).toBe('july')
  });

  it('should transform "8" to "august"', () => {
    const value: number = 8;
    const transformedValue = pipe.transform(value);
    expect(transformedValue).toBe('august')
  });

  it('should transform "9" to "september"', () => {
    const value: number = 9;
    const transformedValue = pipe.transform(value);
    expect(transformedValue).toBe('september')
  });

  it('should transform "10" to "october"', () => {
    const value: number = 10;
    const transformedValue = pipe.transform(value);
    expect(transformedValue).toBe('october')
  });

  it('should transform "11" to "november"', () => {
    const value: number = 11;
    const transformedValue = pipe.transform(value);
    expect(transformedValue).toBe('november')
  });

  it('should transform "12" to "december"', () => {
    const value: number = 12;
    const transformedValue = pipe.transform(value);
    expect(transformedValue).toBe('december')
  });

  it('should transform unknow', () => {
    const value: number = 20;
    const transformedValue = pipe.transform(value);
    expect(transformedValue).toBe('unknow')
  });

});
