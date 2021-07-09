import * as format from './formatValue';

jest.spyOn(format, 'formatCurrency');
jest.spyOn(format, 'formatUsageGb');

describe('formatValue', () => {
  const formatOptions: format.FormatOptions = {};
  const value = 100.11;

  test('null value returns 0', () => {
    expect(format.formatValue(null, 'unknownUnit')).toBe('0');
  });
  test('unknown unit returns value fixed to fractionDigits', () => {
    const formatted = format.formatValue(value, 'unknownUnit');
    expect(formatted).toMatchSnapshot();
  });

  test('usd unit calls formatCurrency', () => {
    const unit = 'usd';
    format.formatValue(value, unit, formatOptions);
    expect(format.formatCurrency).toBeCalledWith(value, unit, formatOptions);
  });

  test('gb unit calls format storage', () => {
    const unit = 'gbMo';
    format.formatValue(value, 'gb-mo', formatOptions);
    expect(format.formatUsageGb).toBeCalledWith(value, unit, formatOptions);
  });

  test('null unit returns value fixed to fractionDigits', () => {
    const unit = null;
    const formatted = format.formatValue(value, unit, { fractionDigits: 1 });
    expect(formatted).toMatchSnapshot();
  });
});

describe('formatCurrency', () => {
  const value = 100.11;
  const unit = 'USD';

  test('defaults fractionDigits', () => {
    const formattedValue = format.formatCurrency(value, unit);
    expect(formattedValue).toMatchSnapshot();
  });

  test('uses specified fractionDigits', () => {
    const formattedValue = format.formatCurrency(value, unit, {
      fractionDigits: 0,
    });
    expect(formattedValue).toMatchSnapshot();
  });

  test('null value returns $0', () => {
    expect(format.formatCurrency(null, 'usd', { fractionDigits: 0 })).toBe('$0');
  });
});
