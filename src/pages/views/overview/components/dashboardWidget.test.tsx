jest.mock('date-fns').mock('date-fns/format');

import { MessageDescriptor } from '@formatjs/intl/src/types';
import { ChartType } from 'components/charts/common/chartDatumUtils';
import { createIntlEnv } from 'components/i18n/localeEnv';
import { format, getDate, getMonth, startOfMonth } from 'date-fns';
import { shallow } from 'enzyme';
import messages from 'locales/messages';
import { DashboardWidgetBase, DashboardWidgetProps } from 'pages/views/overview/components/dashboardWidgetBase';
import React from 'react';
import { defineMessages } from 'react-intl';
import { FetchStatus } from 'store/common';
import { mockDate } from 'testUtils';

const tmessages = defineMessages({
  TestTitle: {
    id: 'TestTitle',
    description: 'test title',
    defaultMessage: 'test title',
  },
  TestTrendTitle: {
    id: 'TestTrendTitle',
    description: 'test trend title',
    defaultMessage: 'test trend title',
  },
});

const props: DashboardWidgetProps = {
  widgetId: 1,
  id: 1,
  t: jest.fn(v => v),
  current: { data: [] },
  previous: { data: [] },
  tabs: { data: [] },
  fetchReports: jest.fn(),
  updateTab: jest.fn(),
  titleKey: tmessages.TestTitle,
  trend: {
    type: ChartType.rolling,
    titleKey: tmessages.TestTrendTitle,
    formatOptions: {},
  },
  status: FetchStatus.none,
  currentQuery: '',
  previousQuery: '',
  tabsQuery: '',
  details: {
    breakdownDescKeyRange: 'detail description range',
    breakdownDescKeySingle: 'detail description single',
    formatOptions: {},
  },
  topItems: { formatOptions: {} },
} as any;

const getDateMock = getDate as jest.Mock;
const formatMock = format as jest.Mock;
const startOfMonthMock = startOfMonth as jest.Mock;
const getMonthMock = getMonth as jest.Mock;

beforeEach(() => {
  mockDate();
  getDateMock.mockReturnValue(1);
  formatMock.mockReturnValue('formatted date');
  startOfMonthMock.mockReturnValue(1);
  getMonthMock.mockReturnValue(1);
});

test('reports are fetched on mount', () => {
  shallow(<DashboardWidgetBase {...props} />);
  expect(props.fetchReports).toBeCalledWith(props.widgetId);
});

test('title is translated', () => {
  shallow(<DashboardWidgetBase {...props} />);
  expect(getTranslateCallForKey(props.titleKey)).toMatchSnapshot();
});

test('subtitle is translated with single date', () => {
  shallow(<DashboardWidgetBase {...props} />);
  expect(getTranslateCallForKeyWithCnt(messages.DashBoardWidgetSubTitle, 1)).toMatchSnapshot();
});

test('subtitle is translated with date range', () => {
  getDateMock.mockReturnValueOnce(2);
  shallow(<DashboardWidgetBase {...props} />);
  expect(getTranslateCallForKeyWithCnt(messages.DashBoardWidgetSubTitle, 2)).toMatchSnapshot();
});

test('trend title is translated', () => {
  shallow(<DashboardWidgetBase {...props} />);
  expect(getTranslateCallForKey(props.trend.titleKey)).toMatchSnapshot();
});

function getTranslateCallForKeyWithCnt(key: MessageDescriptor, cnt: number) {
  const intl = createIntlEnv();
  const startDate = 1;
  const endDate = 15;

  return intl.formatMessage(key, { count: cnt, startDate, endDate, month: 'January' });
}

function getTranslateCallForKey(key: MessageDescriptor) {
  const intl = createIntlEnv();
  return intl.formatMessage(key);
}
