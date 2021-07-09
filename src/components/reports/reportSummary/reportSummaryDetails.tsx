import './reportSummaryDetails.scss';

import { Tooltip } from '@patternfly/react-core';
import { Report, ReportType } from 'api/reports/report';
import { ComputedReportItemType } from 'components/charts/common/chartDatumUtils';
import { createIntlEnv } from 'components/i18n/localeEnv';
import { EmptyValueState } from 'components/state/emptyValueState/emptyValueState';
import messages from 'locales/messages';
import React from 'react';
import { DashboardChartType } from 'store/dashboard/common/dashboardCommon';
import { FormatOptions, unitLookupKey, ValueFormatter } from 'utils/formatValue';

interface ReportSummaryDetailsProps {
  chartType?: DashboardChartType;
  computedReportItem?: string;
  computedReportItemValue?: string;
  costLabel?: string;
  formatValue?: ValueFormatter;
  formatOptions?: FormatOptions;
  report: Report;
  requestFormatOptions?: FormatOptions;
  requestLabel?: string;
  reportType?: ReportType;
  showTooltip?: boolean;
  showUnits?: boolean;
  showUsageFirst?: boolean;
  units?: string;
  usageFormatOptions?: FormatOptions;
  usageLabel?: string;
}

const ReportSummaryDetailsBase: React.SFC<ReportSummaryDetailsProps> = ({
  chartType,
  computedReportItem = 'cost',
  computedReportItemValue = 'total',
  costLabel,
  formatValue,
  formatOptions,
  report,
  requestFormatOptions,
  requestLabel,
  reportType,
  showTooltip = false,
  showUnits = false,
  showUsageFirst = false,
  units,
  usageFormatOptions,
  usageLabel,
}) => {
  let cost: string | React.ReactNode = <EmptyValueState />;
  let supplementaryCost: string | React.ReactNode = <EmptyValueState />;
  let infrastructureCost: string | React.ReactNode = <EmptyValueState />;
  let request: string | React.ReactNode = <EmptyValueState />;
  let usage: string | React.ReactNode = <EmptyValueState />;

  const hasTotal = report && report.meta && report.meta.total;
  const hasCost = hasTotal && report.meta.total.cost && report.meta.total.cost.total;
  const hasCount = hasTotal && report.meta.total.count;
  const hasSupplementaryCost =
    hasTotal &&
    report.meta.total.supplementary &&
    report.meta.total.supplementary.total &&
    report.meta.total.supplementary.total.value;
  const hasInfrastructureCost =
    hasTotal &&
    report.meta.total.infrastructure &&
    report.meta.total.infrastructure[computedReportItemValue] &&
    report.meta.total.infrastructure[computedReportItemValue].value;
  const hasRequest = hasTotal && report.meta.total.request;
  const hasUsage = hasTotal && report.meta.total.usage;

  if (hasTotal) {
    cost = formatValue(
      hasCost ? report.meta.total.cost.total.value : 0,
      hasCost ? report.meta.total.cost.total.units : 'USD',
      formatOptions
    );
    supplementaryCost = formatValue(
      hasSupplementaryCost ? report.meta.total.supplementary.total.value : 0,
      hasSupplementaryCost ? report.meta.total.supplementary.total.units : 'USD',
      formatOptions
    );
    infrastructureCost = formatValue(
      hasInfrastructureCost ? report.meta.total.infrastructure[computedReportItemValue].value : 0,
      hasInfrastructureCost ? report.meta.total.infrastructure[computedReportItemValue].units : 'USD',
      formatOptions
    );
    request = formatValue(
      hasRequest ? report.meta.total.request.value : 0,
      hasRequest ? report.meta.total.request.units : '',
      requestFormatOptions ? usageFormatOptions : formatOptions
    );

    if (hasUsage && report.meta.total.usage.value >= 0) {
      usage = formatValue(
        hasUsage ? report.meta.total.usage.value : 0,
        hasUsage ? report.meta.total.usage.units : '',
        usageFormatOptions ? usageFormatOptions : formatOptions
      );
    } else {
      // Workaround for https://github.com/project-koku/koku-ui/issues/1058
      usage = formatValue(
        hasUsage ? (report.meta.total.usage as any) : 0,
        hasCount ? report.meta.total.count.units : '',
        usageFormatOptions ? usageFormatOptions : formatOptions
      );
    }
  }

  const getCostLayout = (showAltHeroFont: boolean = false) => {
    const intl = createIntlEnv();
    let value = cost;
    if (computedReportItem === ComputedReportItemType.infrastructure) {
      value = infrastructureCost;
    } else if (computedReportItem === ComputedReportItemType.supplementary) {
      value = supplementaryCost;
    }

    const altHeroFont = showAltHeroFont ? 'Alt' : '';

    return (
      <div className="valueContainer">
        {showTooltip ? (
          <Tooltip
            content={intl.formatMessage(messages.DashboardTotalCostTooltip, { infrastructureCost, supplementaryCost })}
            enableFlip
          >
            <div className={`value${altHeroFont}`}>{value}</div>
          </Tooltip>
        ) : (
          <div className={`value${altHeroFont}`}>{value}</div>
        )}
        <div className="text">
          <div>{costLabel}</div>
        </div>
      </div>
    );
  };

  const getRequestLayout = () => {
    const intl = createIntlEnv();
    if (!usageLabel) {
      return null;
    }
    const usageUnits: string = hasRequest ? report.meta.total.request.units : '';
    const _units = unitLookupKey(usageUnits);
    const unitsLabel = intl.formatMessage(messages.Units, { units: _units });

    return (
      <div className="valueContainer">
        <span className="value">{request}</span>
        {Boolean(showUnits && (units || (hasRequest && report.meta.total.request.value >= 0))) && (
          <span className="units">{unitsLabel}</span>
        )}
        <div className="text">
          <div>{requestLabel}</div>
        </div>
      </div>
    );
  };

  const getUsageLayout = () => {
    const intl = createIntlEnv();
    if (!usageLabel) {
      return null;
    }
    const usageUnits: string = hasUsage ? report.meta.total.usage.units : '';
    // added as a work-around for azure #1079
    const _units = unitLookupKey(units ? units : usageUnits);
    const unitsLabel = intl.formatMessage(messages.Units, { units: _units });

    return (
      <div className="valueContainer">
        <span className="value">{usage}</span>
        {Boolean(showUnits && (units || (hasUsage && report.meta.total.usage.value >= 0))) && (
          <span className="units">{unitsLabel}</span>
        )}
        <div className="text">
          <div>{usageLabel}</div>
        </div>
      </div>
    );
  };

  if (
    chartType === DashboardChartType.dailyCost ||
    chartType === DashboardChartType.dailyTrend ||
    chartType === DashboardChartType.cost
  ) {
    return <>{getCostLayout(reportType === ReportType.cost)}</>;
  } else if (chartType === DashboardChartType.trend) {
    if (showUsageFirst) {
      return (
        <>
          {getUsageLayout()}
          {getCostLayout(reportType === ReportType.cost)}
        </>
      );
    }
    return (
      <>
        {getCostLayout(reportType === ReportType.cost)}
        {getUsageLayout()}
      </>
    );
  } else if (chartType === DashboardChartType.usage) {
    if (showUsageFirst) {
      return (
        <>
          {getUsageLayout()}
          {getRequestLayout()}
        </>
      );
    }
    return (
      <>
        {getRequestLayout()}
        {getUsageLayout()}
      </>
    );
  } else {
    return null;
  }
};

const ReportSummaryDetails = ReportSummaryDetailsBase;

export { ReportSummaryDetails, ReportSummaryDetailsProps };
