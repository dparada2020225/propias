import { CustomDateParserFormatter } from './custom-date-parse.formatter';

describe('CustomDateParserFormatter', () => {
  let formatter: CustomDateParserFormatter;

  beforeEach(() => {
    formatter = new CustomDateParserFormatter();
  });

  it('should parse a valid date string', () => {
    const dateString = '25/06/2023';
    const expectedDate = { day: 25, month: 6, year: 2023 };

    const parsedDate = formatter.parse(dateString);

    expect(parsedDate).toEqual(expectedDate);
  });

  it('should return null for an invalid date string', () => {
    const dateString = '30/02/2023';

    const parsedDate = formatter.parse(dateString);

    expect(parsedDate).toBeNull();
  });

  it('should format a NgbDateStruct object', () => {
    const date = { day: 10, month: 3, year: 2022 };
    const expectedFormattedDate = '10/03/2022';

    const formattedDate = formatter.format(date);

    expect(formattedDate).toBe(expectedFormattedDate);
  });

  it('should format a NgbDateStruct object with single-digit day and month', () => {
    const date = { day: 5, month: 1, year: 2023 };
    const expectedFormattedDate = '05/01/2023';

    const formattedDate = formatter.format(date);

    expect(formattedDate).toBe(expectedFormattedDate);
  });

});
