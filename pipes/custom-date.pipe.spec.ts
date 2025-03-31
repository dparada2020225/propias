import { CustomDatePipe } from './custom-date.pipe';

describe('CustomDatePipe', () => {

  let pipe: CustomDatePipe;

  beforeEach(() => {
    pipe = new CustomDatePipe();
  })

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform "1 day" to "1"', () => {
    const value = '1 day';
    const transformedValue = pipe.transform(value);

    expect(transformedValue).toBe(1)
  });

  it('should transform "5 days" to "5"', () => {
    const value = '5 days';
    const transformedValue = pipe.transform(value);

    expect(transformedValue).toBe(5);
  });

  it('should transform "10 hours" to "10"', () => {
    const value = '10 hours';
    const transformedValue = pipe.transform(value);

    expect(transformedValue).toBe(10);
  });

});
