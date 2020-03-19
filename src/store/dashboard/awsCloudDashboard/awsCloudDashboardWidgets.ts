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
  AwsCloudDashboardTab,
  AwsCloudDashboardWidget,
} from './awsCloudDashboardCommon';

let currrentId = 0;
const getId = () => currrentId++;

export const computeWidget: AwsCloudDashboardWidget = {
  id: getId(),
  titleKey: 'aws_cloud_dashboard.compute_title',
  reportType: ReportType.instanceType,
  details: {
    costKey: 'aws_cloud_dashboard.cost_label',
    formatOptions: {
      fractionDigits: 2,
    },
    showUnits: true,
    showUsageLegendLabel: true,
    usageFormatOptions: {
      fractionDigits: 0,
    },
    usageKey: 'aws_cloud_dashboard.usage_label',
  },
  filter: {
    service: 'AmazonEC2',
  },
  isUsageFirst: true,
  tabsFilter: {
    service: 'AmazonEC2',
  },
  trend: {
    comparison: ChartComparison.usage,
    formatOptions: {
      fractionDigits: 2,
    },
    titleKey: 'aws_cloud_dashboard.compute_trend_title',
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
  perspective: DashboardPerspective.awsCloud,
};

export const costSummaryWidget: AwsCloudDashboardWidget = {
  id: getId(),
  titleKey: 'aws_cloud_dashboard.cost_title',
  reportType: ReportType.cost,
  details: {
    costKey: 'aws_cloud_dashboard.cumulative_cost_label',
    formatOptions: {
      fractionDigits: 2,
    },
  },
  isDetailsLink: true,
  isHorizontal: true,
  tabsFilter: {
    limit: 3,
  },
  trend: {
    comparison: ChartComparison.cost,
    formatOptions: {},
    titleKey: 'aws_cloud_dashboard.cost_trend_title',
    type: ChartType.rolling,
  },
  topItems: {
    formatOptions: {},
  },
  availableTabs: [
    AwsCloudDashboardTab.services,
    AwsCloudDashboardTab.accounts,
    AwsCloudDashboardTab.regions,
  ],
  chartType: DashboardChartType.trend,
  currentTab: AwsCloudDashboardTab.services,
  perspective: DashboardPerspective.awsCloud,
};

export const databaseWidget: AwsCloudDashboardWidget = {
  id: getId(),
  titleKey: 'aws_cloud_dashboard.database_title',
  reportType: ReportType.database,
  details: {
    costKey: 'aws_cloud_dashboard.cost_label',
    formatOptions: {
      fractionDigits: 2,
    },
    showUnits: true,
  },
  filter: {
    service:
      'AmazonRDS,AmazonDynamoDB,AmazonElastiCache,AmazonNeptune,AmazonRedshift,AmazonDocumentDB',
  },
  tabsFilter: {
    service:
      'AmazonRDS,AmazonDynamoDB,AmazonElastiCache,AmazonNeptune,AmazonRedshift,AmazonDocumentDB',
  },
  trend: {
    comparison: ChartComparison.cost,
    formatOptions: {},
    titleKey: 'aws_cloud_dashboard.database_trend_title',
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
  perspective: DashboardPerspective.awsCloud,
};

export const networkWidget: AwsCloudDashboardWidget = {
  id: getId(),
  titleKey: 'aws_cloud_dashboard.network_title',
  reportType: ReportType.network,
  details: {
    costKey: 'aws_cloud_dashboard.cost_label',
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
    comparison: ChartComparison.cost,
    formatOptions: {},
    titleKey: 'aws_cloud_dashboard.network_trend_title',
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
  perspective: DashboardPerspective.awsCloud,
};

export const storageWidget: AwsCloudDashboardWidget = {
  id: getId(),
  titleKey: 'aws_cloud_dashboard.storage_title',
  reportType: ReportType.storage,
  details: {
    costKey: 'aws_cloud_dashboard.cost_label',
    formatOptions: {
      fractionDigits: 2,
    },
    showUnits: true,
    showUsageLegendLabel: true,
    usageFormatOptions: {
      fractionDigits: 0,
    },
    usageKey: 'aws_cloud_dashboard.usage_label',
  },
  isUsageFirst: true,
  trend: {
    comparison: ChartComparison.usage,
    formatOptions: {
      fractionDigits: 2,
    },
    titleKey: 'aws_cloud_dashboard.storage_trend_title',
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
  perspective: DashboardPerspective.awsCloud,
};
