import { ReportPathsType, ReportType } from 'api/reports/report';
import {
  ChartType,
  ComputedReportItemType,
  ComputedReportItemValueType,
} from 'components/charts/common/chartDatumUtils';
import messages from 'locales/messages';
import { DashboardChartType } from 'store/dashboard/common/dashboardCommon';

import { OcpUsageDashboardTab, OcpUsageDashboardWidget } from './ocpUsageDashboardCommon';

let currrentId = 0;
const getId = () => currrentId++;

export const costSummaryWidget: OcpUsageDashboardWidget = {
  id: getId(),
  titleKey: messages.OCPDashboardCostTitle,
  reportPathsType: ReportPathsType.ocpUsage,
  reportType: ReportType.cost,
  details: {
    costKey: messages.Cost,
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
    titleKey: messages.OCPUsageDashboardCostTrendTitle,
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
  titleKey: messages.OCPUsageDashboardCPUTitle,
  reportPathsType: ReportPathsType.ocpUsage,
  reportType: ReportType.cpu,
  details: {
    formatOptions: {
      fractionDigits: 0,
    },
    requestKey: messages.Requests,
    showUnits: true,
    showUsageFirst: true,
    usageFormatOptions: {
      fractionDigits: 0,
    },
    usageKey: messages.Usage,
  },

  trend: {
    computedReportItem: ComputedReportItemType.usage,
    computedReportItemValue: ComputedReportItemValueType.total,
    formatOptions: {
      fractionDigits: 2,
    },
    titleKey: messages.OCPDailyUsageAndRequestComparison,
    type: ChartType.daily,
  },
  chartType: DashboardChartType.usage,
};

export const memoryWidget: OcpUsageDashboardWidget = {
  id: getId(),
  titleKey: messages.OCPDashboardMemoryUsageAndRequests,
  reportPathsType: ReportPathsType.ocpUsage,
  reportType: ReportType.memory,
  details: {
    formatOptions: {
      fractionDigits: 0,
    },
    requestFormatOptions: {
      fractionDigits: 0,
    },
    requestKey: messages.Requests,
    showUnits: true,
    showUsageFirst: true,
    usageFormatOptions: {
      fractionDigits: 0,
    },
    usageKey: messages.Usage,
  },
  trend: {
    computedReportItem: ComputedReportItemType.usage,
    computedReportItemValue: ComputedReportItemValueType.total,
    formatOptions: {
      fractionDigits: 2,
    },
    titleKey: messages.OCPDailyUsageAndRequestComparison,
    type: ChartType.daily,
  },
  chartType: DashboardChartType.usage,
};

export const volumeWidget: OcpUsageDashboardWidget = {
  id: getId(),
  titleKey: messages.OCPDashboardVolumeUsageAndRequests,
  reportPathsType: ReportPathsType.ocpUsage,
  reportType: ReportType.volume,
  details: {
    formatOptions: {
      fractionDigits: 0,
    },
    requestFormatOptions: {
      fractionDigits: 0,
    },
    requestKey: messages.Requests,
    showUnits: true,
    showUsageFirst: true,
    usageFormatOptions: {
      fractionDigits: 0,
    },
    usageKey: messages.Usage,
  },
  trend: {
    computedReportItem: ComputedReportItemType.usage,
    computedReportItemValue: ComputedReportItemValueType.total,
    formatOptions: {
      fractionDigits: 2,
    },
    titleKey: messages.OCPDailyUsageAndRequestComparison,
    type: ChartType.daily,
  },
  chartType: DashboardChartType.usage,
};
