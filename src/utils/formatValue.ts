import { createIntlEnv, getLocale } from 'components/i18n/localeEnv';
import messages from 'locales/messages';

export interface FormatOptions {
  fractionDigits?: number;
}

export type ValueFormatter = (value: number, unit?: string, options?: FormatOptions) => string | number;

export const unitLookupKey = unit => {
  const lookup = unit ? unit.toLowerCase() : '';
  switch (lookup) {
    case 'gb-hours':
      return 'gbHours';
      break;
    case 'gb-mo':
      return 'gbMo';
      break;
    case 'gibibyte month':
      return 'gibibyteMonth';
      break;
    case 'core-hours':
      return 'coreHours';
      break;
    case 'tag-mo':
      return 'tagMo';
      break;
    case 'vm-hours':
      return 'vmHours';
      break;
    case 'usd':
    case '$usd':
      return 'usd';
      break;
    case 'gb':
    case 'hour':
    case 'hrs':
      return lookup;
    default:
      return '';
  }
};

export const formatValue: ValueFormatter = (value: number, unit: string, options: FormatOptions = {}) => {
  const lookup = unitLookupKey(unit);
  const fValue = value || 0;

  switch (lookup) {
    case 'usd':
      return formatCurrency(fValue, lookup, options);
    case 'gb':
    case 'gbHours':
    case 'gbMo':
    case 'gibibyteMonth':
    case 'tagMo':
    case 'vmHours':
      return formatUsageGb(fValue, lookup, options);
    case 'coreHours':
    case 'hour':
    case 'hrs':
      return formatUsageHrs(fValue, lookup, options);
    default:
      return unknownTypeFormatter(fValue, lookup, options);
  }
};

const unknownTypeFormatter: ValueFormatter = (value, _unit, { fractionDigits = 0 } = {}) => {
  return value.toLocaleString(getLocale(), {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
};

export const formatCurrency: ValueFormatter = (value, unit, { fractionDigits = 2 } = {}) => {
  let fValue = value;
  if (!value) {
    fValue = 0;
  }
  return fValue.toLocaleString(getLocale(), {
    style: 'currency',
    currency: unit || 'USD',
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
};

export const formatCurrencyAbbreviation: ValueFormatter = (value, unit, { fractionDigits = 2 } = {}) => {
  let fValue = value;
  if (!value) {
    fValue = 0;
  }

  // Derived from https://stackoverflow.com/questions/37799955/how-can-i-format-big-numbers-with-tolocalestring
  const abbreviationFormats = [
    { val: 1e15, symbol: 'currency_abbreviations.quadrillion' },
    { val: 1e12, symbol: 'currency_abbreviations.trillion' },
    { val: 1e9, symbol: 'currency_abbreviations.billion' },
    { val: 1e6, symbol: 'currency_abbreviations.million' },
    { val: 1e3, symbol: 'currency_abbreviations.thousand' },
  ];

  // Find the proper format to use
  let format;
  if (abbreviationFormats != null) {
    format = abbreviationFormats.find(f => fValue >= f.val);
  }

  // Apply format and insert symbol next to the numeric portion of the formatted string
  if (format != null) {
    const intl = createIntlEnv();
    const { val, symbol } = format;
    const formatted = (fValue / val).toLocaleString(getLocale(), {
      style: 'currency',
      currency: unit || 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: fractionDigits,
    });
    const parts = formatted.match(/([\D]*)([\d.,]+)([\D]*)/);
    // return `${parts[1]}${parts[2]}${i18next.t(symbol)}${parts[3]}`;
    return `${parts[1]}${parts[2]}${intl.formatMessage(messages.Custom, { msg: symbol })}${parts[3]}`;
  }

  // If no format was found, format value without abbreviation
  return fValue.toLocaleString(getLocale(), {
    style: 'currency',
    currency: unit || 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: fractionDigits,
  });
};

export const formatUsageGb: ValueFormatter = (value, _unit, { fractionDigits = 0 } = {}) => {
  return value.toLocaleString(getLocale(), {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
};

export const formatUsageHrs: ValueFormatter = (value, _unit, { fractionDigits = 0 } = {}) => {
  return value.toLocaleString(getLocale(), {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
};
