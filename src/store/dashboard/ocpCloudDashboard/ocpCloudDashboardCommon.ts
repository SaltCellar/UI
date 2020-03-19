import {
  getQuery,
  OcpCloudFilters,
  OcpCloudQuery,
} from 'api/queries/ocpCloudQuery';
import { DashboardWidget } from 'store/dashboard/common/dashboardCommon';

export const ocpCloudDashboardStateKey = 'ocpCloudDashboard';
export const ocpCloudDashboardDefaultFilters: OcpCloudFilters = {
  time_scope_units: 'month',
  time_scope_value: -1,
  resolution: 'daily',
};
export const ocpCloudDashboardTabFilters: OcpCloudFilters = {
  ...ocpCloudDashboardDefaultFilters,
  limit: 3,
};

export const enum OcpCloudDashboardTab {
  accounts = 'accounts',
  regions = 'regions',
  services = 'services',
}

export interface OcpCloudDashboardWidget
  extends DashboardWidget<OcpCloudDashboardTab> {}

// Todo: cluster, project, node
export function getGroupByForTab(
  widget: OcpCloudDashboardWidget
): OcpCloudQuery['group_by'] {
  switch (widget.currentTab) {
    case OcpCloudDashboardTab.accounts:
      return { account: '*' };
    case OcpCloudDashboardTab.regions:
      return { region: '*' };
    case OcpCloudDashboardTab.services:
      // Use group_by for service tab and filter for others -- https://github.com/project-koku/koku-ui/issues/846
      return {
        service:
          widget.tabsFilter && widget.tabsFilter.service
            ? widget.tabsFilter.service
            : '*',
      };
    default:
      return {};
  }
}

export function getQueryForWidget(
  filter: OcpCloudFilters = ocpCloudDashboardDefaultFilters
) {
  const query: OcpCloudQuery = {
    filter,
  };
  return getQuery(query);
}

export function getQueryForWidgetTabs(
  widget: OcpCloudDashboardWidget,
  filter: OcpCloudFilters = ocpCloudDashboardDefaultFilters
) {
  const group_by = getGroupByForTab(widget);
  const newFilter = {
    ...JSON.parse(JSON.stringify(filter)),
  };

  // Use group_by for service tab and filter for others -- https://github.com/project-koku/koku-ui/issues/846
  if (
    widget.currentTab === OcpCloudDashboardTab.services &&
    widget.tabsFilter &&
    widget.tabsFilter.service
  ) {
    newFilter.service = undefined;
  }
  const query: OcpCloudQuery = {
    filter: newFilter,
    group_by,
  };
  return getQuery(query);
}
