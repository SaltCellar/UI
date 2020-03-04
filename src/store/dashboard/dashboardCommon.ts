import { AwsFilters, AwsQuery, getQuery } from 'api/awsQuery';
import { AwsReportType } from 'api/awsReports';
import { ChartType } from 'components/charts/commonChart/chartUtils';

export const dashboardStateKey = 'dashboard';
export const dashboardDefaultFilters: AwsFilters = {
  time_scope_units: 'month',
  time_scope_value: -1,
  resolution: 'daily',
};
export const dashboardTabFilters: AwsFilters = {
  ...dashboardDefaultFilters,
  limit: 3,
};

interface ValueFormatOptions {
  fractionDigits?: number;
}

export const enum DashboardTab {
  services = 'services',
  accounts = 'accounts',
  regions = 'regions',
  instanceType = 'instance_type',
}

export interface DashboardWidget {
  id: number;
  /** i18n key for the title. passed { startDate, endDate, month, time } */
  titleKey: string;
  reportType: AwsReportType;
  availableTabs?: DashboardTab[];
  currentTab: DashboardTab;
  details: {
    costKey?: string /** i18n label key */;
    formatOptions: ValueFormatOptions;
    showUnits?: boolean;
    showUsageLegendLabel?: boolean;
    usageFormatOptions?: ValueFormatOptions;
    usageKey?: string /** i18n label key */;
  };
  filter?: {
    limit?: number;
    service?: string;
  };
  isDetailsLink?: boolean;
  isHorizontal?: boolean;
  isUsageFirst?: boolean;
  tabsFilter?: {
    limit?: number;
    service?: string;
  };
  trend: {
    titleKey: string;
    type: ChartType;
    formatOptions: ValueFormatOptions;
  };
  topItems: {
    formatOptions: {};
  };
}

export function getGroupByForTab(
  widget: DashboardWidget
): AwsQuery['group_by'] {
  switch (widget.currentTab) {
    case DashboardTab.services:
      // Use group_by for service tab and filter for others -- https://github.com/project-koku/koku-ui/issues/846
      return {
        service:
          widget.tabsFilter && widget.tabsFilter.service
            ? widget.tabsFilter.service
            : '*',
      };
    case DashboardTab.accounts:
      return { account: '*' };
    case DashboardTab.regions:
      return { region: '*' };
    case DashboardTab.instanceType:
      return { instance_type: '*' };
    default:
      return {};
  }
}

export function getQueryForWidget(
  filter: AwsFilters = dashboardDefaultFilters
) {
  const query: AwsQuery = {
    filter,
  };
  return getQuery(query);
}

export function getQueryForWidgetTabs(
  widget: DashboardWidget,
  filter: AwsFilters = dashboardDefaultFilters
) {
  const group_by = getGroupByForTab(widget);
  const newFilter = {
    ...JSON.parse(JSON.stringify(filter)),
  };

  // Use group_by for service tab and filter for others -- https://github.com/project-koku/koku-ui/issues/846
  if (
    widget.currentTab === DashboardTab.services &&
    widget.tabsFilter &&
    widget.tabsFilter.service
  ) {
    newFilter.service = undefined;
  }
  const query: AwsQuery = {
    filter: newFilter,
    group_by,
  };
  return getQuery(query);
}
