import { CustomDateLabelPipe } from './custom-date-label.pipe';

describe('CustomDateLabelPipe', () => {

  let pipe: CustomDateLabelPipe;

  beforeEach(() => {
    pipe = new CustomDateLabelPipe();
  })

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform "1 day" to "day"', () => {
    const value = '1 day';
    const transformedValue = pipe.transform(value);

    expect(transformedValue).toBe('day');
  });

  it('should transform "5 days" to "days"', () => {
    const value = '5 days';
    const transformedValue = pipe.transform(value);

    expect(transformedValue).toBe('days');
  });

  it('should transform "10 hours" to "days"', () => {
    const value = '10 hours';
    const transformedValue = pipe.transform(value);

    expect(transformedValue).toBe('days');
  });

});
