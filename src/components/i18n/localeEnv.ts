import { enUS, eo } from 'date-fns/locale';
import { createIntl, createIntlCache } from 'react-intl';

export const createIntlEnv = () => {
  const cache = createIntlCache();
  return createIntl(
    {
      locale: getLocale(),
      messages: {},
    },
    cache
  );
};

export const getInsightsLocale = async () => {
  try {
    const { identity } = await (insights.chrome as any).auth.getUser();
    return identity.user.locale.slice(0, 2);
  } catch {
    return 'en';
  }
};

let _locale = 'en';
getInsightsLocale().then((val: string) => {
  _locale = val;
});

export const getLocale = () => {
  return _locale;
};

export const getDateFnsLocale = (): Locale => {
  const locale: string = getLocale();
  switch (locale) {
    case 'en':
      return enUS;
    case 'eo':
      return eo;
  }
};
