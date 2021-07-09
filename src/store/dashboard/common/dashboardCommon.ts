import { MessageDescriptor } from '@formatjs/intl/src/types';
import { ForecastPathsType, ForecastType } from 'api/forecasts/forecast';
import { ReportPathsType, ReportType } from 'api/reports/report';

// eslint-disable-next-line no-shadow
export const enum DashboardChartType {
  cost = 'cost', // // This displays cumulative cost compared to infrastructure cost
  dailyCost = 'dailyCost', // This displays cumulative and daily cost compared to infrastructure cost
  dailyTrend = 'dailyTrend', // This displays cumulative and daily cost
  trend = 'trend', // This displays cumulative cost only
  usage = 'usage', // This displays daily usage and requests
}

export interface ValueFormatOptions {
  fractionDigits?: number;
}

export interface DashboardWidget<T> {
  availableTabs?: T[];
  chartType?: DashboardChartType;
  currentTab?: T;
  details: {
    adjustContainerHeight?: boolean; // Adjust chart container height for responsiveness
    appNavId?: string; // Highlights Insights nav-item when view all link is clicked
    costKey?: MessageDescriptor; // i18n key
    formatOptions: ValueFormatOptions;
    requestFormatOptions?: {
      fractionDigits?: number;
    };
    requestKey?: MessageDescriptor;
    showHorizontal?: boolean; // Show horizontal layout
    showTooltip?: boolean; // Show cost tooltip
    showUnits?: boolean; // Show units
    showUsageFirst?: boolean; // Show usage before cost
    showUsageLegendLabel?: boolean;
    units?: string; // Override units shown as workaround for missing Azure API units
    usageFormatOptions?: ValueFormatOptions;
    usageKey?: MessageDescriptor; // i18n key
    viewAllPath?: string; // View all link to details page
  };
  filter?: {
    limit?: number;
    service?: string;
    service_name?: string;
  };
  forecastPathsType?: ForecastPathsType;
  forecastType?: ForecastType;
  id: number;
  reportPathsType: ReportPathsType;
  reportType: ReportType;
  /** i18n key for the title. passed { startDate, endDate, month, time } */
  titleKey: MessageDescriptor;
  tabsFilter?: {
    limit?: number;
    service?: string;
    service_name?: string;
  };
  trend: {
    computedForecastItem?: string; // The computed forecast item to use in charts.
    computedForecastInfrastructureItem?: string; // The computed forecast infrastructure item to use in charts.
    computedReportItem: string; // The computed report item to use in charts, summary, etc.
    computedReportItemValue: string; // The computed report value (e.g., raw, markup, total, or usage)
    dailyTitleKey?: MessageDescriptor;
    showInfrastructureLabel?: boolean; // Trend chart legend items show "Infrastructure cost" instead of "cost"
    showSupplementaryLabel?: boolean; // Trend chart legend items show "Supplementary cost" instead of "cost"
    titleKey: MessageDescriptor;
    type: number;
    formatOptions: ValueFormatOptions;
  };
  topItems?: {
    formatOptions: any;
  };
}
