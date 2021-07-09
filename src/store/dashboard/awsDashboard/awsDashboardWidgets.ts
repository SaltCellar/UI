import { ForecastPathsType, ForecastType } from 'api/forecasts/forecast';
import { ReportPathsType, ReportType } from 'api/reports/report';
import {
  ChartType,
  ComputedForecastItemType,
  ComputedReportItemType,
  ComputedReportItemValueType,
} from 'components/charts/common/chartDatumUtils';
import messages from 'locales/messages';
import { paths } from 'routes';
import { DashboardChartType } from 'store/dashboard/common/dashboardCommon';

import { AwsDashboardTab, AwsDashboardWidget } from './awsDashboardCommon';

let currrentId = 0;
const getId = () => currrentId++;

export const computeWidget: AwsDashboardWidget = {
  id: getId(),
  titleKey: messages.AWSComputeTitle,
  reportPathsType: ReportPathsType.aws,
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
  //   AwsDashboardTab.instanceType,
  //   AwsDashboardTab.accounts,
  //   AwsDashboardTab.regions,
  // ],
  chartType: DashboardChartType.trend,
  currentTab: AwsDashboardTab.instanceType,
};

export const costSummaryWidget: AwsDashboardWidget = {
  id: getId(),
  titleKey: messages.AWSDashboardCostTitle,
  forecastPathsType: ForecastPathsType.aws,
  forecastType: ForecastType.cost,
  reportPathsType: ReportPathsType.aws,
  reportType: ReportType.cost,
  details: {
    adjustContainerHeight: true,
    appNavId: 'aws',
    costKey: messages.Cost,
    formatOptions: {
      fractionDigits: 2,
    },
    showHorizontal: true,
    viewAllPath: paths.awsDetails,
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
  availableTabs: [AwsDashboardTab.services, AwsDashboardTab.accounts, AwsDashboardTab.regions],
  chartType: DashboardChartType.dailyTrend,
  currentTab: AwsDashboardTab.services,
};

export const databaseWidget: AwsDashboardWidget = {
  id: getId(),
  titleKey: messages.DashboardDatabaseTitle,
  reportPathsType: ReportPathsType.aws,
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
  //   AwsDashboardTab.services,
  //   AwsDashboardTab.accounts,
  //   AwsDashboardTab.regions,
  // ],
  chartType: DashboardChartType.trend,
  currentTab: AwsDashboardTab.services,
};

export const networkWidget: AwsDashboardWidget = {
  id: getId(),
  titleKey: messages.DashboardNetworkTitle,
  reportPathsType: ReportPathsType.aws,
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
  //   AwsDashboardTab.services,
  //   AwsDashboardTab.accounts,
  //   AwsDashboardTab.regions,
  // ],
  chartType: DashboardChartType.trend,
  currentTab: AwsDashboardTab.services,
};

export const storageWidget: AwsDashboardWidget = {
  id: getId(),
  titleKey: messages.DashboardStorageTitle,
  reportPathsType: ReportPathsType.aws,
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
  //   AwsDashboardTab.services,
  //   AwsDashboardTab.accounts,
  //   AwsDashboardTab.regions,
  // ],
  chartType: DashboardChartType.trend,
  currentTab: AwsDashboardTab.accounts,
};
