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

import { OcpCloudDashboardTab, OcpCloudDashboardWidget } from './ocpCloudDashboardCommon';

let currrentId = 0;
const getId = () => currrentId++;

export const costSummaryWidget: OcpCloudDashboardWidget = {
  id: getId(),
  titleKey: messages.OCPCloudDashboardCostTitle,
  forecastPathsType: ForecastPathsType.ocpCloud,
  forecastType: ForecastType.cost,
  reportPathsType: ReportPathsType.ocpCloud,
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
    computedForecastItem: ComputedForecastItemType.cost,
    computedReportItem: ComputedReportItemType.cost,
    computedReportItemValue: ComputedReportItemValueType.total,
    formatOptions: {},
    dailyTitleKey: messages.OCPCloudDashboardDailyCostTrendTitle,
    titleKey: messages.OCPCloudDashboardCostTrendTitle,
    type: ChartType.rolling,
  },
  topItems: {
    formatOptions: {},
  },
  availableTabs: [OcpCloudDashboardTab.services, OcpCloudDashboardTab.accounts, OcpCloudDashboardTab.regions],
  chartType: DashboardChartType.dailyTrend,
  currentTab: OcpCloudDashboardTab.services,
};

// Cloud widgets

export const computeWidget: OcpCloudDashboardWidget = {
  id: getId(),
  titleKey: messages.OCPCloudDashboardComputeTitle,
  reportPathsType: ReportPathsType.ocpCloud,
  reportType: ReportType.instanceType,
  details: {
    costKey: messages.Cost,
    formatOptions: {
      fractionDigits: 2,
    },
    showUnits: true,
    showUsageFirst: true,
    showUsageLegendLabel: true,
    usageFormatOptions: {
      fractionDigits: 0,
    },
    usageKey: messages.Usage,
  },
  filter: {
    service: 'AmazonEC2',
  },
  trend: {
    computedReportItem: ComputedReportItemType.usage,
    computedReportItemValue: ComputedReportItemValueType.total,
    formatOptions: {
      fractionDigits: 2,
    },
    titleKey: messages.DashboardDailyUsageComparison,
    type: ChartType.daily,
  },
  chartType: DashboardChartType.trend,
};

export const databaseWidget: OcpCloudDashboardWidget = {
  id: getId(),
  titleKey: messages.DashboardDatabaseTitle,
  reportPathsType: ReportPathsType.ocpCloud,
  reportType: ReportType.database,
  details: {
    costKey: messages.Cost,
    formatOptions: {
      fractionDigits: 2,
    },
    showUnits: true,
  },
  filter: {
    service:
      'AmazonRDS,AmazonDynamoDB,AmazonElastiCache,AmazonNeptune,AmazonRedshift,AmazonDocumentDB' +
      'Database,Cosmos DB,Cache for Redis',
  },
  trend: {
    computedReportItem: ComputedReportItemType.cost,
    computedReportItemValue: ComputedReportItemValueType.total,
    formatOptions: {},
    titleKey: messages.DashboardCumulativeCostComparison,
    type: ChartType.rolling,
  },
  chartType: DashboardChartType.trend,
};

export const networkWidget: OcpCloudDashboardWidget = {
  id: getId(),
  titleKey: messages.DashboardNetworkTitle,
  reportPathsType: ReportPathsType.ocpCloud,
  reportType: ReportType.network,
  details: {
    costKey: messages.Cost,
    formatOptions: {
      fractionDigits: 2,
    },
    showUnits: true,
  },
  filter: {
    service:
      'AmazonVPC,AmazonCloudFront,AmazonRoute53,AmazonAPIGateway' +
      'Virtual Network,VPN,DNS,Traffic Manager,ExpressRoute,Load Balancer,Application Gateway',
  },
  trend: {
    computedReportItem: ComputedReportItemType.cost,
    computedReportItemValue: ComputedReportItemValueType.total,
    formatOptions: {},
    titleKey: messages.DashboardCumulativeCostComparison,
    type: ChartType.rolling,
  },
  chartType: DashboardChartType.trend,
};

export const storageWidget: OcpCloudDashboardWidget = {
  id: getId(),
  titleKey: messages.DashboardStorageTitle,
  reportPathsType: ReportPathsType.ocpCloud,
  reportType: ReportType.storage,
  details: {
    costKey: messages.Cost,
    formatOptions: {
      fractionDigits: 2,
    },
    showUnits: true,
    showUsageFirst: true,
    showUsageLegendLabel: true,
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
    titleKey: messages.DashboardDailyUsageComparison,
    type: ChartType.daily,
  },
  chartType: DashboardChartType.trend,
};
