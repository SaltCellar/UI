import { ForecastPathsType, ForecastType } from 'api/forecasts/forecast';
import { ReportPathsType, ReportType } from 'api/reports/report';
import {
  ChartType,
  ComputedForecastItemType,
  ComputedReportItemType,
  ComputedReportItemValueType,
} from 'components/charts/common/chartDatumUtils';
import messages from 'locales/messages';
import { DashboardChartType } from 'store/dashboard/common/dashboardCommon';

import { OcpSupplementaryDashboardTab, OcpSupplementaryDashboardWidget } from './ocpSupplementaryDashboardCommon';

let currrentId = 0;
const getId = () => currrentId++;

export const costSummaryWidget: OcpSupplementaryDashboardWidget = {
  id: getId(),
  titleKey: messages.OCPSupplementaryCostTitle,
  forecastPathsType: ForecastPathsType.ocp,
  forecastType: ForecastType.supplementary,
  reportPathsType: ReportPathsType.ocp,
  reportType: ReportType.cost,
  details: {
    adjustContainerHeight: true,
    costKey: messages.Cost,
    formatOptions: {
      fractionDigits: 2,
    },
    showHorizontal: true,
  },
  trend: {
    computedForecastItem: ComputedForecastItemType.supplementary,
    computedReportItem: ComputedReportItemType.supplementary,
    computedReportItemValue: ComputedReportItemValueType.total,
    formatOptions: {},
    dailyTitleKey: messages.OCPSupplementaryDailyCostTrendTitle,
    showSupplementaryLabel: true,
    titleKey: messages.OCPSupplementaryCostTrendTitle,
    type: ChartType.rolling,
  },
  tabsFilter: {
    limit: 3,
  },
  topItems: {
    formatOptions: {},
  },
  availableTabs: [OcpSupplementaryDashboardTab.projects, OcpSupplementaryDashboardTab.clusters],
  chartType: DashboardChartType.dailyTrend,
  currentTab: OcpSupplementaryDashboardTab.projects,
};

export const cpuWidget: OcpSupplementaryDashboardWidget = {
  id: getId(),
  titleKey: messages.OCPCPUUsageAndRequests,
  reportPathsType: ReportPathsType.ocp,
  reportType: ReportType.cpu,
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
    computedReportItemValue: ComputedReportItemValueType.none,
    formatOptions: {
      fractionDigits: 2,
    },
    titleKey: messages.OCPDailyUsageAndRequestComparison,
    type: ChartType.daily,
  },
  topItems: {
    formatOptions: {},
  },
  // availableTabs: [
  //   OcpSupplementaryDashboardTab.projects,
  //   OcpSupplementaryDashboardTab.clusters,
  // ],
  chartType: DashboardChartType.usage,
  currentTab: OcpSupplementaryDashboardTab.projects,
};

export const memoryWidget: OcpSupplementaryDashboardWidget = {
  id: getId(),
  titleKey: messages.OCPMemoryUsageAndRequests,
  reportPathsType: ReportPathsType.ocp,
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
  topItems: {
    formatOptions: {},
  },
  // availableTabs: [
  //   OcpSupplementaryDashboardTab.projects,
  //   OcpSupplementaryDashboardTab.clusters,
  // ],
  chartType: DashboardChartType.usage,
  currentTab: OcpSupplementaryDashboardTab.projects,
};

export const volumeWidget: OcpSupplementaryDashboardWidget = {
  id: getId(),
  titleKey: messages.OCPVolumeUsageAndRequests,
  reportPathsType: ReportPathsType.ocp,
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
    computedReportItemValue: ComputedReportItemValueType.none,
    formatOptions: {
      fractionDigits: 2,
    },
    titleKey: messages.OCPDailyUsageAndRequestComparison,
    type: ChartType.daily,
  },
  topItems: {
    formatOptions: {},
  },
  // availableTabs: [
  //   OcpSupplementaryDashboardTab.projects,
  //   OcpSupplementaryDashboardTab.clusters,
  // ],
  chartType: DashboardChartType.usage,
  currentTab: OcpSupplementaryDashboardTab.projects,
};
