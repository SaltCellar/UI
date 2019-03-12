import { AwsReportType } from 'api/awsReports';
import { ChartType } from 'components/charts/commonChart/chartUtils';
import { AwsDashboardTab, AwsDashboardWidget } from './awsDashboardCommon';

let currrentId = 0;
const getId = () => currrentId++;

export const computeWidget: AwsDashboardWidget = {
  id: getId(),
  titleKey: 'aws_dashboard.compute_title',
  reportType: AwsReportType.instanceType,
  details: {
    labelKey: 'aws_dashboard.compute_detail_label',
    formatOptions: {
      fractionDigits: 0,
    },
  },
  trend: {
    titleKey: 'aws_dashboard.compute_trend_title',
    formatOptions: {
      fractionDigits: 2,
    },
    type: ChartType.daily,
  },
  topItems: {
    formatOptions: {},
  },
  availableTabs: [
    AwsDashboardTab.instanceType,
    AwsDashboardTab.accounts,
    AwsDashboardTab.regions,
  ],
  currentTab: AwsDashboardTab.instanceType,
};

export const costSummaryWidget: AwsDashboardWidget = {
  id: getId(),
  titleKey: 'aws_dashboard.cost_title',
  reportType: AwsReportType.cost,
  details: {
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
    titleKey: 'aws_dashboard.cost_trend_title',
    formatOptions: {},
    type: ChartType.rolling,
  },
  topItems: {
    formatOptions: {},
  },
  availableTabs: [
    AwsDashboardTab.services,
    AwsDashboardTab.accounts,
    AwsDashboardTab.regions,
  ],
  currentTab: AwsDashboardTab.services,
};

export const databaseWidget: AwsDashboardWidget = {
  id: getId(),
  titleKey: 'aws_dashboard.database_title',
  reportType: AwsReportType.cost,
  details: {
    formatOptions: {
      fractionDigits: 2,
    },
  },
  filter: {
    product_family: 'Database Instance',
  },
  tabsFilter: {
    product_family: 'Database Instance',
  },
  trend: {
    titleKey: 'aws_dashboard.database_trend_title',
    formatOptions: {},
    type: ChartType.rolling,
  },
  topItems: {
    formatOptions: {},
  },
  availableTabs: [
    AwsDashboardTab.services,
    AwsDashboardTab.accounts,
    AwsDashboardTab.regions,
  ],
  currentTab: AwsDashboardTab.services,
};

export const storageWidget: AwsDashboardWidget = {
  id: getId(),
  titleKey: 'aws_dashboard.storage_title',
  reportType: AwsReportType.storage,
  details: {
    labelKey: 'aws_dashboard.storage_detail_label',
    formatOptions: {
      fractionDigits: 0,
    },
  },
  trend: {
    titleKey: 'aws_dashboard.storage_trend_title',
    formatOptions: {
      fractionDigits: 2,
    },
    type: ChartType.daily,
  },
  topItems: {
    formatOptions: {},
  },
  availableTabs: [
    AwsDashboardTab.services,
    AwsDashboardTab.accounts,
    AwsDashboardTab.regions,
  ],
  currentTab: AwsDashboardTab.accounts,
};
