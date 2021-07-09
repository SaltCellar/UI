jest.mock('i18next');

import { createIntlEnv } from 'components/i18n/localeEnv';
import messages from 'locales/messages';

describe('getTooltipContent', () => {
  test('format hrs and gb', () => {
    const intl = createIntlEnv();
    [
      { units: 'hrs', golden: 'hours', withTranslation: messages.UnitTooltips },
      { units: 'gb', golden: 'GB', withTranslation: messages.UnitTooltips },
      { units: 'gbMo', golden: 'GB-month', withTranslation: messages.UnitTooltips },
    ].forEach(tc => {
      const labelFormatFunc = (value, unit) => {
        return value + ' EN ' + unit;
      };
      const tValue = labelFormatFunc(10, tc.golden);
      expect(tValue).toEqual(intl.formatMessage(tc.withTranslation, { units: tc.units, value: '10' }));
    });
  });
  test('format unknown units', () => {
    const intl = createIntlEnv();
    expect('EN 10').toEqual(intl.formatMessage(messages.UnitTooltips, { units: 'bogus', value: '10' }));
  });
});
