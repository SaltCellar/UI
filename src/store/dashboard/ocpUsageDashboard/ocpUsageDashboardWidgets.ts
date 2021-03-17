import { ReportPathsType, ReportType } from 'api/reports/report';
import {
  ChartType,
  ComputedReportItemType,
  ComputedReportItemValueType,
} from 'components/charts/common/chartDatumUtils';
import { DashboardChartType } from 'store/dashboard/common/dashboardCommon';

import { OcpUsageDashboardTab, OcpUsageDashboardWidget } from './ocpUsageDashboardCommon';

let currrentId = 0;
const getId = () => currrentId++;

export const costSummaryWidget: OcpUsageDashboardWidget = {
  id: getId(),
  titleKey: 'ocp_usage_dashboard.cost_title',
  reportPathsType: ReportPathsType.ocpUsage,
  reportType: ReportType.cost,
  details: {
    costKey: 'cost',
    formatOptions: {
      fractionDigits: 2,
    },
    showHorizontal: true,
  },
  tabsFilter: {
    limit: 3,
  },
  trend: {
    computedReportItem: ComputedReportItemType.infrastructure,
    computedReportItemValue: ComputedReportItemValueType.usage,
    formatOptions: {},
    titleKey: 'ocp_usage_dashboard.cost_trend_title',
    type: ChartType.rolling,
  },
  topItems: {
    formatOptions: {},
  },
  availableTabs: [OcpUsageDashboardTab.projects, OcpUsageDashboardTab.clusters],
  chartType: DashboardChartType.trend,
  currentTab: OcpUsageDashboardTab.projects,
};

export const cpuWidget: OcpUsageDashboardWidget = {
  id: getId(),
  titleKey: 'ocp_usage_dashboard.cpu_title',
  reportPathsType: ReportPathsType.ocpUsage,
  reportType: ReportType.cpu,
  details: {
    formatOptions: {
      fractionDigits: 0,
    },
    requestKey: 'ocp.requests',
    showUnits: true,
    showUsageFirst: true,
    usageFormatOptions: {
      fractionDigits: 0,
    },
    usageKey: 'dashboard.usage',
  },

  trend: {
    computedReportItem: ComputedReportItemType.usage,
    computedReportItemValue: ComputedReportItemValueType.total,
    formatOptions: {
      fractionDigits: 2,
    },
    titleKey: 'ocp.daily_usage_request_comparison',
    type: ChartType.daily,
  },
  chartType: DashboardChartType.usage,
};

export const memoryWidget: OcpUsageDashboardWidget = {
  id: getId(),
  titleKey: 'ocp_usage_dashboard.memory_title',
  reportPathsType: ReportPathsType.ocpUsage,
  reportType: ReportType.memory,
  details: {
    formatOptions: {
      fractionDigits: 0,
    },
    requestFormatOptions: {
      fractionDigits: 0,
    },
    requestKey: 'ocp.requests',
    showUnits: true,
    showUsageFirst: true,
    usageFormatOptions: {
      fractionDigits: 0,
    },
    usageKey: 'dashboard.usage',
  },
  trend: {
    computedReportItem: ComputedReportItemType.usage,
    computedReportItemValue: ComputedReportItemValueType.total,
    formatOptions: {
      fractionDigits: 2,
    },
    titleKey: 'ocp.daily_usage_request_comparison',
    type: ChartType.daily,
  },
  chartType: DashboardChartType.usage,
};

export const volumeWidget: OcpUsageDashboardWidget = {
  id: getId(),
  titleKey: 'ocp_usage_dashboard.volume_title',
  reportPathsType: ReportPathsType.ocpUsage,
  reportType: ReportType.volume,
  details: {
    formatOptions: {
      fractionDigits: 0,
    },
    requestFormatOptions: {
      fractionDigits: 0,
    },
    requestKey: 'ocp.requests',
    showUnits: true,
    showUsageFirst: true,
    usageFormatOptions: {
      fractionDigits: 0,
    },
    usageKey: 'dashboard.usage',
  },
  trend: {
    computedReportItem: ComputedReportItemType.usage,
    computedReportItemValue: ComputedReportItemValueType.total,
    formatOptions: {
      fractionDigits: 2,
    },
    titleKey: 'ocp.daily_usage_request_comparison',
    type: ChartType.daily,
  },
  chartType: DashboardChartType.usage,
};
