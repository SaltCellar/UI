jest.mock('store/reports/reportActions');

import { ReportType } from 'api/reports/report';
import { ChartType } from 'components/charts/common/chartUtils';
import { createMockStoreCreator } from 'store/mockStore';
import { reportActions } from 'store/reports';

import * as actions from './gcpDashboardActions';
import { gcpDashboardStateKey, GcpDashboardTab, getGroupByForTab, getQueryForWidgetTabs } from './gcpDashboardCommon';
import { gcpDashboardReducer } from './gcpDashboardReducer';
import * as selectors from './gcpDashboardSelectors';
import { computeWidget, costSummaryWidget, databaseWidget, networkWidget, storageWidget } from './gcpDashboardWidgets';

const createGcpDashboardStore = createMockStoreCreator({
  [gcpDashboardStateKey]: gcpDashboardReducer,
});

const fetchReportMock = reportActions.fetchReport as jest.Mock;

beforeEach(() => {
  fetchReportMock.mockReturnValue({ type: '@@test' });
});

test('default state', () => {
  const store = createGcpDashboardStore();
  const state = store.getState();
  expect(selectors.selectCurrentWidgets(state)).toEqual([
    costSummaryWidget.id,
    computeWidget.id,
    // TODO: Need to add these back in as APIs become available
    // storageWidget.id,
    // networkWidget.id,
    // databaseWidget.id,
  ]);
  expect(selectors.selectWidget(state, costSummaryWidget.id)).toEqual(costSummaryWidget);
});

test('fetch widget reports', () => {
  const store = createGcpDashboardStore();
  store.dispatch(actions.fetchWidgetReports(costSummaryWidget.id));
  expect(fetchReportMock.mock.calls).toMatchSnapshot();
});

test('changeWidgetTab', () => {
  const store = createGcpDashboardStore();
  store.dispatch(actions.changeWidgetTab(costSummaryWidget.id, GcpDashboardTab.regions));
  const widget = selectors.selectWidget(store.getState(), costSummaryWidget.id);
  expect(widget.currentTab).toBe(GcpDashboardTab.regions);
  expect(fetchReportMock).toHaveBeenCalledTimes(3);
});

describe('getGroupByForTab', () => {
  test('services tab', () => {
    expect(getGroupByForTab(GcpDashboardTab.services)).toMatchSnapshot();
  });

  test('instance types tab', () => {
    expect(getGroupByForTab(GcpDashboardTab.instanceType)).toMatchSnapshot();
  });

  test('accounts tab', () => {
    expect(getGroupByForTab(GcpDashboardTab.accounts)).toMatchSnapshot();
  });

  test('regions tab', () => {
    expect(getGroupByForTab(GcpDashboardTab.regions)).toMatchSnapshot();
  });

  test('unknown tab', () => {
    expect(getGroupByForTab('unknown' as any)).toMatchSnapshot();
  });
});

test('getQueryForWidget', () => {
  const widget = {
    id: 1,
    titleKey: '',
    reportType: ReportType.cost,
    availableTabs: [GcpDashboardTab.accounts],
    currentTab: GcpDashboardTab.accounts,
    details: { formatOptions: {} },
    trend: {
      titleKey: '',
      type: ChartType.daily,
      formatOptions: {},
    },
    topItems: {
      formatOptions: {},
    },
  };

  [
    [
      undefined,
      'filter[time_scope_units]=month&filter[time_scope_value]=-1&filter[resolution]=daily&group_by[account]=*',
    ],
    [{}, 'group_by[account]=*'],
    [{ limit: 3 }, 'filter[limit]=3&group_by[account]=*'],
  ].forEach(value => {
    expect(getQueryForWidgetTabs(widget, value[0])).toEqual(value[1]);
  });
});
