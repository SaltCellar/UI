import { ReportType } from 'api/reports/report';
import {
  ChartComparison,
  ChartType,
} from 'components/charts/common/chartUtils';
import {
  DashboardChartType,
  DashboardPerspective,
} from 'store/dashboard/common/dashboardCommon';
import {
  OcpSupplementaryDashboardTab,
  OcpSupplementaryDashboardWidget,
} from './ocpSupplementaryDashboardCommon';

let currrentId = 0;
const getId = () => currrentId++;

export const costSummaryWidget: OcpSupplementaryDashboardWidget = {
  id: getId(),
  titleKey: 'ocp_supplementary_dashboard.cost_title',
  reportType: ReportType.cost,
  details: {
    costKey: 'ocp_supplementary_dashboard.cumulative_cost_label',
    formatOptions: {
      fractionDigits: 2,
    },
  },
  isDetailsLink: true,
  isHorizontal: true,
  trend: {
    comparison: ChartComparison.cost,
    formatOptions: {},
    titleKey: 'ocp_supplementary_dashboard.cost_trend_title',
    type: ChartType.rolling,
  },
  tabsFilter: {
    limit: 3,
  },
  topItems: {
    formatOptions: {},
  },
  availableTabs: [
    OcpSupplementaryDashboardTab.projects,
    OcpSupplementaryDashboardTab.clusters,
  ],
  chartType: DashboardChartType.cost,
  currentTab: OcpSupplementaryDashboardTab.projects,
  perspective: DashboardPerspective.ocpSupplementary,
};

export const cpuWidget: OcpSupplementaryDashboardWidget = {
  id: getId(),
  titleKey: 'ocp_supplementary_dashboard.cpu_title',
  reportType: ReportType.cpu,
  details: {
    formatOptions: {
      fractionDigits: 0,
    },
    requestFormatOptions: {
      fractionDigits: 0,
    },
    requestKey: 'ocp_supplementary_dashboard.requests_label',
    showUnits: true,
    usageFormatOptions: {
      fractionDigits: 0,
    },
    usageKey: 'ocp_supplementary_dashboard.usage_label',
  },
  isUsageFirst: true,
  trend: {
    comparison: ChartComparison.usage,
    formatOptions: {
      fractionDigits: 2,
    },
    titleKey: 'ocp_supplementary_dashboard.cpu_trend_title',
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
  perspective: DashboardPerspective.ocpSupplementary,
};

export const memoryWidget: OcpSupplementaryDashboardWidget = {
  id: getId(),
  titleKey: 'ocp_supplementary_dashboard.memory_title',
  reportType: ReportType.memory,
  details: {
    formatOptions: {
      fractionDigits: 0,
    },
    requestFormatOptions: {
      fractionDigits: 0,
    },
    requestKey: 'ocp_supplementary_dashboard.requests_label',
    showUnits: true,
    usageFormatOptions: {
      fractionDigits: 0,
    },
    usageKey: 'ocp_supplementary_dashboard.usage_label',
  },
  isUsageFirst: true,
  trend: {
    comparison: ChartComparison.usage,
    formatOptions: {
      fractionDigits: 2,
    },
    titleKey: 'ocp_supplementary_dashboard.memory_trend_title',
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
  perspective: DashboardPerspective.ocpSupplementary,
};

export const volumeWidget: OcpSupplementaryDashboardWidget = {
  id: getId(),
  titleKey: 'ocp_supplementary_dashboard.volume_title',
  reportType: ReportType.volume,
  details: {
    formatOptions: {
      fractionDigits: 0,
    },
    requestFormatOptions: {
      fractionDigits: 0,
    },
    requestKey: 'ocp_supplementary_dashboard.requests_label',
    showUnits: true,
    usageFormatOptions: {
      fractionDigits: 0,
    },
    usageKey: 'ocp_supplementary_dashboard.usage_label',
  },
  isUsageFirst: true,
  trend: {
    comparison: ChartComparison.usage,
    formatOptions: {
      fractionDigits: 2,
    },
    titleKey: 'ocp_supplementary_dashboard.volume_trend_title',
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
  perspective: DashboardPerspective.ocpSupplementary,
};
