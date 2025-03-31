import { environment } from 'src/environments/environment';
import { EProfile } from '../enums/profile.enum';
import { CustomPhonePipe } from './custom-phone.pipe';

describe('CustomPhonePipe', () => {

  let pipe: CustomPhonePipe;

  beforeEach(() => { pipe = new CustomPhonePipe })

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform "120369851124" to "120369851-124"', () => {
    environment.profile = EProfile.HONDURAS;
    const value = '120369851124';
    const transformedValue = pipe.transform(value);
    expect(transformedValue).toBe('120369851-124')
  })

  it('should transform "123456789" to "123456789"', () => {
    environment.profile = EProfile.PANAMA;
    const value = '123456789';
    const transformedValue = pipe.transform(value);
    expect(transformedValue).toBe('123456789')
  })

});
