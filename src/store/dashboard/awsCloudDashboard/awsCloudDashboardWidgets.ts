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

import { AwsCloudDashboardTab, AwsCloudDashboardWidget } from './awsCloudDashboardCommon';
let currrentId = 0;
const getId = () => currrentId++;

export const computeWidget: AwsCloudDashboardWidget = {
  id: getId(),
  titleKey: messages.AWSComputeTitle,
  reportPathsType: ReportPathsType.awsCloud,
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
  tabsFilter: {
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
  topItems: {
    formatOptions: {},
  },
  // availableTabs: [
  //   AwsCloudDashboardTab.instanceType,
  //   AwsCloudDashboardTab.accounts,
  //   AwsCloudDashboardTab.regions,
  // ],
  chartType: DashboardChartType.trend,
  currentTab: AwsCloudDashboardTab.instanceType,
};

export const costSummaryWidget: AwsCloudDashboardWidget = {
  id: getId(),
  titleKey: messages.AWSCloudDashboardCostTitle,
  forecastPathsType: ForecastPathsType.awsCloud,
  forecastType: ForecastType.cost,
  reportPathsType: ReportPathsType.awsCloud,
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
    dailyTitleKey: messages.AWSDailyCostTrendTitle,
    titleKey: messages.AWSCostTrendTitle,
    type: ChartType.rolling,
  },
  topItems: {
    formatOptions: {},
  },
  availableTabs: [AwsCloudDashboardTab.services, AwsCloudDashboardTab.accounts, AwsCloudDashboardTab.regions],
  chartType: DashboardChartType.dailyTrend,
  currentTab: AwsCloudDashboardTab.services,
};

export const databaseWidget: AwsCloudDashboardWidget = {
  id: getId(),
  titleKey: messages.DashboardDatabaseTitle,
  reportPathsType: ReportPathsType.awsCloud,
  reportType: ReportType.database,
  details: {
    costKey: messages.Cost,
    formatOptions: {
      fractionDigits: 2,
    },
    showUnits: true,
  },
  filter: {
    service: 'AmazonRDS,AmazonDynamoDB,AmazonElastiCache,AmazonNeptune,AmazonRedshift,AmazonDocumentDB',
  },
  tabsFilter: {
    service: 'AmazonRDS,AmazonDynamoDB,AmazonElastiCache,AmazonNeptune,AmazonRedshift,AmazonDocumentDB',
  },
  trend: {
    computedReportItem: ComputedReportItemType.cost,
    computedReportItemValue: ComputedReportItemValueType.total,
    formatOptions: {},
    titleKey: messages.DashboardCumulativeCostComparison,
    type: ChartType.rolling,
  },
  topItems: {
    formatOptions: {},
  },
  // availableTabs: [
  //   AwsCloudDashboardTab.services,
  //   AwsCloudDashboardTab.accounts,
  //   AwsCloudDashboardTab.regions,
  // ],
  chartType: DashboardChartType.trend,
  currentTab: AwsCloudDashboardTab.services,
};

export const networkWidget: AwsCloudDashboardWidget = {
  id: getId(),
  titleKey: messages.DashboardNetworkTitle,
  reportPathsType: ReportPathsType.awsCloud,
  reportType: ReportType.network,
  details: {
    costKey: messages.Cost,
    formatOptions: {
      fractionDigits: 2,
    },
    showUnits: true,
  },
  filter: {
    service: 'AmazonVPC,AmazonCloudFront,AmazonRoute53,AmazonAPIGateway',
  },
  tabsFilter: {
    service: 'AmazonVPC,AmazonCloudFront,AmazonRoute53,AmazonAPIGateway',
  },
  trend: {
    computedReportItem: ComputedReportItemType.cost,
    computedReportItemValue: ComputedReportItemValueType.total,
    formatOptions: {},
    titleKey: messages.DashboardCumulativeCostComparison,
    type: ChartType.rolling,
  },
  topItems: {
    formatOptions: {},
  },
  // availableTabs: [
  //   AwsCloudDashboardTab.services,
  //   AwsCloudDashboardTab.accounts,
  //   AwsCloudDashboardTab.regions,
  // ],
  chartType: DashboardChartType.trend,
  currentTab: AwsCloudDashboardTab.services,
};

export const storageWidget: AwsCloudDashboardWidget = {
  id: getId(),
  titleKey: messages.DashboardStorageTitle,
  reportPathsType: ReportPathsType.awsCloud,
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
  topItems: {
    formatOptions: {},
  },
  // availableTabs: [
  //   AwsCloudDashboardTab.services,
  //   AwsCloudDashboardTab.accounts,
  //   AwsCloudDashboardTab.regions,
  // ],
  chartType: DashboardChartType.trend,
  currentTab: AwsCloudDashboardTab.accounts,
};
