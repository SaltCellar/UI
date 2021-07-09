/* eslint-disable max-len */
import { defineMessages } from 'react-intl';

export default defineMessages({
  AWSCloudDashboardCostTitle: {
    id: 'AWSCloudDashboardCostTitle',
    description: 'Amazon Web Services filtered by OpenShift cost',
    defaultMessage: 'EN Amazon Web Services filtered by OpenShift cost',
  },
  AWSComputeTitle: {
    id: 'AWSComputeTitle',
    description: 'Compute (EC2) instances usage',
    defaultMessage: 'EN Compute (EC2) instances usage',
  },
  AWSCostTrendTitle: {
    id: 'AWSCostTrendTitle',
    description: 'Amazon Web Services cumulative cost comparison ({units})',
    defaultMessage: 'EN Amazon Web Services cumulative cost comparison ({units})',
  },
  AWSDailyCostTrendTitle: {
    id: 'AWSDailyCostTrendTitle',
    description: 'Amazon Web Services daily cost comparison ({units})',
    defaultMessage: 'EN Amazon Web Services daily cost comparison ({units})',
  },
  AWSDashboardCostTitle: {
    id: 'AWSDashboardCostTitle',
    description: 'Amazon Web Services cost',
    defaultMessage: 'EN Amazon Web Services cost',
  },
  AzureCloudDashboardCostTitle: {
    id: 'AzureCloudDashboardCostTitle',
    description: 'Microsoft Azure filtered by OpenShift cost',
    defaultMessage: 'EN Microsoft Azure filtered by OpenShift cost',
  },
  AzureComputeTitle: {
    id: 'AzureComputeTitle',
    description: 'Virtual machines usage',
    defaultMessage: 'EN Virtual machines usage',
  },
  AzureCostTrendTitle: {
    id: 'AzureCostTrendTitle',
    description: 'Microsoft Azure cumulative cost comparison ({units})',
    defaultMessage: 'EN Microsoft Azure cumulative cost comparison ({units})',
  },
  AzureDailyCostTrendTitle: {
    id: 'AzureDailyCostTrendTitle',
    description: 'Microsoft Azure daily cost comparison ({units})',
    defaultMessage: 'EN Microsoft Azure daily cost comparison ({units})',
  },
  AzureDashboardCostTitle: {
    id: 'AzureDashboardCostTitle',
    description: 'Microsoft Azure cost',
    defaultMessage: 'EN Microsoft Azure cost',
  },
  ChartCostForecastConeLegendLabel: {
    id: 'ChartCostForecastConeLegendLabel',
    description: 'Cost forecast cone date label',
    defaultMessage:
      '{count, plural, one {EN Cost confidence ({startDate} {abbrMonth})} other {EN Cost confidence ({startDate}-{endDate} {abbrMonth})}}',
  },
  ChartCostForecastConeLegendTooltip: {
    id: 'ChartCostForecastConeLegendTooltip',
    description: 'Cost confidence forecast date label tooltip',
    defaultMessage: 'EN Cost confidence ({abbrMonth})',
  },
  ChartCostForecastConeTooltip: {
    id: 'ChartCostForecastConeTooltip',
    description: '{value0} - {value1}',
    defaultMessage: 'EN {value0} - {value1}',
  },
  ChartCostForecastLegendLabel: {
    id: 'ChartCostForecastLegendLabel',
    description: 'Cost forecast date label',
    defaultMessage:
      '{count, plural, one {EN Cost forecast ({startDate} {abbrMonth})} other {EN Cost forecast ({startDate}-{endDate} {abbrMonth})}}',
  },
  ChartCostForecastLegendTooltip: {
    id: 'ChartCostForecastLegendTooltip',
    description: 'Cost forecast date label tooltip',
    defaultMessage: 'EN Cost forecast ({abbrMonth})',
  },
  ChartCostInfrastructureLegendLabel: {
    id: 'ChartCostInfrastructureLegendLabel',
    description: 'Infrastructure date label',
    defaultMessage:
      '{count, plural, one {EN Infrastructure ({startDate} {abbrMonth})} other {EN Infrastructure ({startDate}-{endDate} {abbrMonth})}}',
  },
  ChartCostInfrastructureLegendTooltip: {
    id: 'ChartCostInfrastructureLegendTooltip',
    description: 'Infrastructure date label tooltip',
    defaultMessage: 'EN Infrastructure ({abbrMonth})',
  },
  ChartCostInfrastructureForecastConeLegendLabel: {
    id: 'ChartCostInfrastructureForecastConeLegendLabel',
    description: 'Infrastructure date label',
    defaultMessage:
      '{count, plural, one {EN Infrastructure confidence ({startDate} {abbrMonth})} other {EN Infrastructure confidence ({startDate}-{endDate} {abbrMonth})}}',
  },
  ChartCostInfrastructureForecastConeLegendTooltip: {
    id: 'ChartCostInfrastructureForecastConeLegendTooltip',
    description: 'Infrastructure date label tooltip',
    defaultMessage: 'EN Infrastructure confidence ({abbrMonth})',
  },
  ChartCostInfrastructureForecastLegendLabel: {
    id: 'ChartCostInfrastructureForecastLegendLabel',
    description: 'Infrastructure date label',
    defaultMessage:
      '{count, plural, one {EN Infrastructure forecast ({startDate} {abbrMonth})} other {EN Infrastructure forecast ({startDate}-{endDate} {abbrMonth})}}',
  },
  ChartCostInfrastructureForecastLegendTooltip: {
    id: 'ChartCostInfrastructureForecastLegendTooltip',
    description: 'Infrastructure date label tooltip',
    defaultMessage: 'EN Infrastructure forecast ({abbrMonth})',
  },
  ChartCostLegendLabel: {
    id: 'ChartCostLegendLabel',
    description: 'Cost date label',
    defaultMessage:
      '{count, plural, one {EN Cost ({startDate} {abbrMonth})} other {EN Cost ({startDate}-{endDate} {abbrMonth})}}',
  },
  ChartCostLegendTooltip: {
    id: 'ChartCostLegendTooltip',
    description: 'Cost ({abbrMonth})',
    defaultMessage: 'EN Cost ({abbrMonth})',
  },
  ChartCostSupplementaryLegendLabel: {
    id: 'ChartCostSupplementaryLegendLabel',
    description: 'Supplementary cost date label',
    defaultMessage:
      '{count, plural, one {EN Supplementary cost ({startDate} {abbrMonth})} other {EN Supplementary cost ({startDate}-{endDate} {abbrMonth})}}',
  },
  ChartCostSupplementaryLegendTooltip: {
    id: 'ChartCostSupplementaryLegendTooltip',
    description: 'Supplementary cost ({abbrMonth})',
    defaultMessage: 'EN Supplementary cost ({abbrMonth})',
  },
  ChartDateRange: {
    id: 'ChartDateRange',
    description: 'Date range that handles singular and plural',
    defaultMessage:
      '{count, plural, one {EN {startDate} {abbrMonth} {year}} other {EN {startDate}-{endDate} {abbrMonth} {year}}}',
  },
  ChartDayOfTheMonth: {
    id: 'ChartDayOfTheMonth',
    description: 'The day of the month',
    defaultMessage: 'EN Day {day}',
  },
  ChartLimitLegendLabel: {
    id: 'ChartLimitLegendLabel',
    description: 'Limit date label',
    defaultMessage:
      '{count, plural, one {EN Limit ({startDate} {abbrMonth})} other {EN Limit ({startDate}-{endDate} {abbrMonth})}}',
  },
  ChartLimitLegendTooltip: {
    id: 'ChartLimitLegendTooltip',
    description: 'Limit ({abbrMonth})',
    defaultMessage: 'EN Limit ({abbrMonth})',
  },
  ChartNoData: {
    id: 'ChartNoData',
    description: 'no data',
    defaultMessage: 'EN no data',
  },
  ChartOthers: {
    id: 'ChartOthers',
    description: 'Other || Others',
    defaultMessage: '{count, plural, one {EN {count} Other} other {EN {count} Others}}',
  },
  ChartRequestsLegendLabel: {
    id: 'ChartRequestLegendLabel',
    description: 'Requests date label',
    defaultMessage:
      '{count, plural, one {EN Requests ({startDate} {abbrMonth})} other {EN Requests ({startDate}-{endDate} {abbrMonth})}}',
  },
  ChartRequestsLegendTooltip: {
    id: 'ChartRequestLegendTooltip',
    description: 'Requests ({abbrMonth})',
    defaultMessage: 'EN Requests ({abbrMonth})',
  },
  ChartUsageLegendlabel: {
    id: 'ChartUsageLegendlabel',
    description: 'Usage ({startDate} {abbrMonth})',
    defaultMessage:
      '{count, plural, one {EN Usage ({startDate} {abbrMonth})} other {EN Usage ({startDate}-{endDate} {abbrMonth})}}',
  },
  ChartUsageLegendTooltip: {
    id: 'ChartUsageLegendTooltip',
    description: 'Usage ({abbrMonth})',
    defaultMessage: 'EN Usage ({abbrMonth})',
  },
  Cost: {
    id: 'Cost',
    description: 'Cost',
    defaultMessage: 'EN Cost',
  },
  Custom: {
    id: 'Custom',
    description: 'translate any message',
    defaultMessage: 'EN {msg}',
  },
  DashboardCumulativeCostComparison: {
    id: 'DashboardCumulativeCostComparison',
    description: 'Cumulative cost comparison ({units})',
    defaultMessage: 'EN Cumulative cost comparison ({units})',
  },
  DashboardDailyUsageComparison: {
    id: 'DashboardDailyUsageComparison',
    description: 'Daily usage comparison ({units})',
    defaultMessage: 'EN Daily usage comparison ({units})',
  },
  DashboardDatabaseTitle: {
    id: 'DashboardDatabaseTitle',
    description: 'Database services cost',
    defaultMessage: 'EN Database services cost',
  },
  DashboardNetworkTitle: {
    id: 'DashboardNetworkTitle',
    description: 'Network services cost',
    defaultMessage: 'EN Network services cost',
  },
  DashboardStorageTitle: {
    id: 'DashboardStorageTitle',
    description: 'Storage services cost',
    defaultMessage: 'EN Storage services cost',
  },
  DashboardTotalCostTooltip: {
    id: 'DashboardTotalCostTooltip',
    description: 'total cost is the sum of the infrastructure cost and supplementary cost',
    defaultMessage:
      'EN This total cost is the sum of the infrastructure cost {infrastructureCost} and supplementary cost {supplementaryCost}',
  },
  DashBoardWidgetSubTitle: {
    id: 'DashBoardWidgetSubTitle',
    description: 'dashboard widget subtitle date|dates',
    defaultMessage: '{count, plural, one {EN {startDate} {month}} other {EN {startDate}-{endDate} {month}}}',
  },
  ForDate: {
    id: 'ForDate',
    description: '{value} for date range',
    defaultMessage:
      '{count, plural, one {EN {value} for {startDate} {month}} other {EN {value} for {startDate}-{endDate} {month}}}',
  },
  GCPComputeTitle: {
    id: 'GCPComputeTitle',
    description: 'Compute instances usage',
    defaultMessage: 'EN Compute instances usage',
  },
  GCPCostTitle: {
    id: 'GCPCostTitle',
    description: 'Google Cloud Platform Services cost',
    defaultMessage: 'EN Google Cloud Platform Services cost',
  },
  GCPCostTrendTitle: {
    id: 'GCPCostTrendTitle',
    description: 'Google Cloud Platform Services cumulative cost comparison ({units})',
    defaultMessage: 'EN Google Cloud Platform Services cumulative cost comparison ({units})',
  },
  GCPDailyCostTrendTitle: {
    id: 'GCPDailyCostTrendTitle',
    description: 'Google Cloud Platform Services daily cost comparison ({units})',
    defaultMessage: 'EN Google Cloud Platform Services daily cost comparison ({units})',
  },
  GroupByAll: {
    id: 'GroupByAll',
    description: 'All group by value',
    defaultMessage: 'EN All {groupBy}s',
  },
  GroupByTop: {
    id: 'GroupByTop',
    description: 'Top group by value',
    defaultMessage: 'EN Top {groupBy}s',
  },
  GroupByTopValueAccount: {
    id: 'GroupByTopValueAccount',
    description: 'accounts',
    defaultMessage: 'EN accounts',
  },
  GroupByTopValueCluster: {
    id: 'GroupByTopValueCluster',
    description: 'clusters',
    defaultMessage: 'EN clusters',
  },
  GroupByTopValueInstanceType: {
    id: 'GroupByTopValueInstanceType',
    description: 'Instance types',
    defaultMessage: 'EN Instance types',
  },
  GroupByTopValueNode: {
    id: 'GroupByTopValueNode',
    description: 'Nodes',
    defaultMessage: 'EN Nodes',
  },
  GroupByTopValueOrganizationalUnitID: {
    id: 'GroupByTopValueOrganizationalUnitID',
    description: 'Organizational units',
    defaultMessage: 'Organizational units',
  },
  GroupByTopValuePod: {
    id: 'GroupByTopValuePod',
    description: 'Pods',
    defaultMessage: 'EN Pods',
  },
  GroupByTopValueProject: {
    id: 'GroupByTopValueProject',
    description: 'Projects',
    defaultMessage: 'EN Projects',
  },
  GroupByTopValueRegion: {
    id: 'GroupByTopValueRegion',
    description: 'Regions',
    defaultMessage: 'EN Regions',
  },
  GroupByTopValueService: {
    id: 'GroupByTopValueService',
    description: 'Services',
    defaultMessage: 'EN Services',
  },
  IBMComputeTitle: {
    id: 'IBMComputeTitle',
    description: 'Compute instances usage',
    defaultMessage: 'EN Compute instances usage',
  },
  IBMCostTitle: {
    id: 'IBMCostTitle',
    description: 'IBM Cloud Services cost',
    defaultMessage: 'EN IBM Cloud Services cost',
  },
  IBMCostTrendTitle: {
    id: 'IBMCostTrendTitle',
    description: 'IBM Cloud Services cumulative cost comparison ({units})',
    defaultMessage: 'EN IBM Cloud Services cumulative cost comparison ({units})',
  },
  IBMDailyCostTrendTitle: {
    id: 'IBMDailyCostTrendTitle',
    description: 'IBM Cloud Services daily cost comparison ({units})',
    defaultMessage: 'EN IBM Cloud Services daily cost comparison ({units})',
  },
  NoDataForDate: {
    id: 'NoDataForDate',
    description: 'No data available for date range',
    defaultMessage:
      '{count, plural, one {EN No data available for {startDate} {month}} other {EN No data available for {startDate}-{endDate} {month}}}',
  },
  OCPCloudDashboardComputeTitle: {
    id: 'OCPCloudDashboardComputeTitle',
    description: 'Compute services usage',
    defaultMessage: 'EN Compute services usage',
  },
  OCPCloudDashboardCostTitle: {
    id: 'OCPCloudDashboardCostTitle',
    description: 'All cloud filtered by OpenShift cost',
    defaultMessage: 'EN All cloud filtered by OpenShift cost',
  },
  OCPCloudDashboardCostTrendTitle: {
    id: 'OCPCloudDashboardCostTrendTitle',
    description: 'All cloud filtered by OpenShift cumulative cost comparison ({units})',
    defaultMessage: 'EN All cloud filtered by OpenShift cumulative cost comparison ({units})',
  },
  OCPCloudDashboardDailyCostTrendTitle: {
    id: 'OCPCloudDashboardDailyCostTrendTitle',
    description: 'All cloud filtered by OpenShift daily cost comparison ({units})',
    defaultMessage: 'EN All cloud filtered by OpenShift daily cost comparison ({units})',
  },
  OCPDailyUsageAndRequestComparison: {
    id: 'OCPDailyUsageAndRequestComparison',
    description: 'Daily usage and requests comparison',
    defaultMessage: 'EN Daily usage and requests comparison ({units})',
  },
  OCPDashboardCostTitle: {
    id: 'OCPDashboardCostTitle',
    description: 'All OpenShift cost',
    defaultMessage: 'EN All OpenShift cost',
  },
  OCPDashboardCostTrendTitle: {
    id: 'OCPDashboardCostTrendTitle',
    description: 'All OpenShift cumulative cost comparison in units',
    defaultMessage: 'EN All OpenShift cumulative cost comparison ({units})',
  },
  OCPDashboardCPUUsageAndRequests: {
    id: 'OCPDashboardCPUUsageAndRequests',
    description: 'OpenShift CPU usage and requests',
    defaultMessage: 'EN OpenShift CPU usage and requests',
  },
  OCPDashboardDailyCostTitle: {
    id: 'OCPDashboardDailyCostTitle',
    description: 'All OpenShift daily cost comparison in units',
    defaultMessage: 'EN All OpenShift daily cost comparison ({units})',
  },
  OCPDashboardMemoryUsageAndRequests: {
    id: 'OCPDashboardMemoryUsageAndRequests',
    description: 'OpenShift Memory usage and requests',
    defaultMessage: 'EN OpenShift Memory usage and requests',
  },
  OCPDashboardVolumeUsageAndRequests: {
    id: 'OCPUsageAndRequests',
    description: 'OpenShift Volume usage and requests',
    defaultMessage: 'EN OpenShift Volume usage and requests',
  },
  OCPInfrastructureCostTitle: {
    id: 'OCPInfrastructureCostTitle',
    description: 'OpenShift infrastructure cost',
    defaultMessage: 'EN OpenShift infrastructure cost',
  },
  OCPInfrastructureCostTrendTitle: {
    id: 'OCPInfrastructureCostTrendTitle',
    description: 'OpenShift cumulative infrastructure cost comparison with units',
    defaultMessage: 'EN OpenShift cumulative infrastructure cost comparison ({units})',
  },
  OCPInfrastructureDailyCostTrendTitle: {
    id: 'OCPInfrastructureDailyCostTrendTitle',
    description: 'OpenShift daily infrastructure cost comparison with units',
    defaultMessage: 'EN OpenShift daily infrastructure cost comparison ({units})',
  },
  OCPSupplementaryCostTitle: {
    id: 'OCPSupplementaryCostTitle',
    description: 'OpenShift supplementary cost',
    defaultMessage: 'EN OpenShift supplementary cost',
  },
  OCPSupplementaryCostTrendTitle: {
    id: 'OCPSupplementaryCostTrendTitle',
    description: 'OpenShift cumulative supplementary cost comparison with units',
    defaultMessage: 'EN OpenShift cumulative supplementary cost comparison ({units})',
  },
  OCPSupplementaryDailyCostTrendTitle: {
    id: 'OCPSupplementaryDailyCostTrendTitle',
    description: 'OpenShift daily supplementary cost comparison with units',
    defaultMessage: 'EN OpenShift daily supplementary cost comparison ({units})',
  },
  OCPCPUUsageAndRequests: {
    id: 'OCPCPUUsageAndRequests',
    description: 'CPU usage and requests',
    defaultMessage: 'EN CPU usage and requests',
  },
  OCPMemoryUsageAndRequests: {
    id: 'OCPMemoryUsageAndRequests',
    description: 'Memory usage and requests',
    defaultMessage: 'EN Memory usage and requests',
  },
  OCPVolumeUsageAndRequests: {
    id: 'OCPVolumeUsageAndRequests',
    description: 'Volume usage and requests',
    defaultMessage: 'EN Volume usage and requests',
  },
  OCPUsageCostTitle: {
    id: 'OCPUsageCostTitle',
    description: 'OpenShift usage cost',
    defaultMessage: 'EN OpenShift usage cost',
  },
  OCPUsageDashboardCostTrendTitle: {
    id: 'OCPUsageDashboardCostTrendTitle',
    description: 'Metering cumulative cost comparison with units',
    defaultMessage: 'EN Metering cumulative cost comparison ({units})',
  },
  OCPUsageDashboardCPUTitle: {
    id: 'OCPUsageDashboardCPUTitle',
    description: 'OpenShift CPU usage and requests',
    defaultMessage: 'EN OpenShift CPU usage and requests',
  },
  PercentTotalCost: {
    id: 'PercentTotalCost',
    description: '{value} {units} ({percent}%)',
    defaultMessage: 'EN {unit}{value} ({percent}%)',
  },
  Requests: {
    id: 'Requests',
    description: 'Requests',
    defaultMessage: 'EN Requests',
  },
  SinceDate: {
    id: 'SinceDate',
    description: 'SinceDate',
    defaultMessage: '{count, plural, one {EN {startDate} {month}} other {EN {startDate}-{endDate} {month}}}',
  },
  UnitTooltips: {
    id: 'UnitTooltips',
    description: 'return value and unit based on key: "units"',
    defaultMessage:
      '{units, select, coreHours {{value} EN core-hours} gb {{value} EN GB} gbHours {{value} EN GB-hours} gbMo {{value} EN GB-month} gibibyteMonth {{value} EN GiB-month} hour {{value} EN hours} hrs {{value} EN hours} usd {{value} EN} vmHours {{value} EN VM-hours} other {EN {value}}}',
  },
  Units: {
    id: 'Units',
    description: 'return the proper unit label based on key: "units"',
    defaultMessage:
      '{units, select, coreHours {EN core-hours} gb {EN GB} gbHours {EN GB-hours} gbMo {EN GB-month} gibibyteMonth {EN GiB-month} hour {EN hours} hrs {EN hours} usd {$USD} vmHours {EN VM-hours} other {}}',
  },
  Usage: {
    id: 'Usage',
    description: 'Usage',
    defaultMessage: 'EN Usage',
  },
});
