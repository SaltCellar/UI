import Skeleton from '@redhat-cloud-services/frontend-components/Skeleton';
import { getQuery, orgUnitIdKey, Query } from 'api/queries/query';
import { Report, ReportPathsType, ReportType } from 'api/reports/report';
import { ChartType, transformReport } from 'components/charts/common/chartDatumUtils';
import { HistoricalTrendChart } from 'components/charts/historicalTrendChart';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { reportActions, reportSelectors } from 'store/reports';
import { formatValue, unitLookupKey } from 'utils/formatValue';

import { chartStyles, styles } from './historicalChart.styles';

interface HistoricalDataTrendChartOwnProps {
  filterBy: string | number;
  groupBy: string;
  query?: Query;
  reportPathsType: ReportPathsType;
  reportType: ReportType;
}

interface HistoricalDataTrendChartStateProps {
  currentQuery?: Query;
  currentQueryString?: string;
  currentReport?: Report;
  currentReportFetchStatus?: FetchStatus;
  previousQuery?: Query;
  previousQueryString?: string;
  previousReport?: Report;
  previousReportFetchStatus?: FetchStatus;
}

interface HistoricalDataTrendChartDispatchProps {
  fetchReport?: typeof reportActions.fetchReport;
}

type HistoricalDataTrendChartProps = HistoricalDataTrendChartOwnProps &
  HistoricalDataTrendChartStateProps &
  HistoricalDataTrendChartDispatchProps &
  WithTranslation;

class HistoricalDataTrendChartBase extends React.Component<HistoricalDataTrendChartProps> {
  public componentDidMount() {
    const { fetchReport, currentQueryString, previousQueryString, reportPathsType, reportType } = this.props;

    fetchReport(reportPathsType, reportType, currentQueryString);
    fetchReport(reportPathsType, reportType, previousQueryString);
  }

  public componentDidUpdate(prevProps: HistoricalDataTrendChartProps) {
    const { fetchReport, currentQueryString, previousQueryString, reportPathsType, reportType } = this.props;

    if (prevProps.currentQueryString !== currentQueryString) {
      fetchReport(reportPathsType, reportType, currentQueryString);
    }
    if (prevProps.previousQueryString !== previousQueryString) {
      fetchReport(reportPathsType, reportType, previousQueryString);
    }
  }

  private getSkeleton = () => {
    return (
      <>
        <Skeleton style={styles.chartSkeleton} size="md" />
        <Skeleton style={styles.legendSkeleton} size="xs" />
      </>
    );
  };

  public render() {
    const {
      currentReport,
      currentReportFetchStatus,
      previousReport,
      previousReportFetchStatus,
      reportType,
      t,
    } = this.props;

    const isCostChart = reportType === ReportType.cost;

    // Current data
    const currentData = transformReport(
      currentReport,
      isCostChart ? ChartType.rolling : ChartType.daily,
      'date',
      isCostChart ? 'cost' : 'usage'
    );
    const previousData = transformReport(
      previousReport,
      isCostChart ? ChartType.rolling : ChartType.daily,
      'date',
      isCostChart ? 'cost' : 'usage'
    );

    const costUnits =
      currentReport && currentReport.meta && currentReport.meta.total && currentReport.meta.total.cost
        ? currentReport.meta.total.cost.total.units
        : 'USD';

    let usageUnits =
      currentReport && currentReport.meta && currentReport.meta.total && currentReport.meta.total.usage
        ? currentReport.meta.total.usage.units
        : undefined;

    let yAxisLabel;
    if (isCostChart) {
      yAxisLabel = t(`breakdown.historical_chart.${reportType}_label`, {
        units: t(`units.${unitLookupKey(costUnits)}`),
      });
    } else if (usageUnits && Number.isNaN(Number(currentReport.meta.total.usage.units))) {
      yAxisLabel = t(`breakdown.historical_chart.units_label`, {
        units: t(`units.${unitLookupKey(usageUnits)}`),
      });
    } else {
      usageUnits = t(`breakdown.historical_chart.${reportType}_label`);
      yAxisLabel = t(`breakdown.historical_chart.units_label`, {
        units: t(`units.${unitLookupKey(usageUnits)}`),
      });
    }

    return (
      <div style={styles.chartContainer}>
        <div style={styles.trendChart}>
          {currentReportFetchStatus === FetchStatus.inProgress &&
          previousReportFetchStatus === FetchStatus.inProgress ? (
            this.getSkeleton()
          ) : (
            <HistoricalTrendChart
              containerHeight={chartStyles.chartContainerHeight - 50}
              currentData={currentData}
              formatDatumValue={formatValue}
              formatDatumOptions={{}}
              height={chartStyles.chartHeight}
              previousData={previousData}
              units={isCostChart ? costUnits : usageUnits}
              xAxisLabel={t(`breakdown.historical_chart.day_of_month_label`)}
              yAxisLabel={yAxisLabel}
            />
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = createMapStateToProps<HistoricalDataTrendChartOwnProps, HistoricalDataTrendChartStateProps>(
  (state, { filterBy, groupBy, query, reportPathsType, reportType }) => {
    const groupByOrg = query && query.group_by[orgUnitIdKey] ? query.group_by[orgUnitIdKey] : undefined;

    // instance-types and storage APIs must filter org units
    const useFilter = reportType === ReportType.instanceType || reportType === ReportType.storage;

    const currentQuery: Query = {
      filter: {
        time_scope_units: 'month',
        time_scope_value: -1,
        resolution: 'daily',
        limit: 3,
        ...(query && query.filter && query.filter.account && { account: query.filter.account }),
        ...(groupByOrg && useFilter && { [orgUnitIdKey]: groupByOrg }),
      },
      filter_by: query ? query.filter_by : undefined,
      group_by: {
        ...(groupByOrg && !useFilter && ({ [orgUnitIdKey]: groupByOrg } as any)),
        [groupBy]: filterBy,
      },
    };
    const currentQueryString = getQuery(currentQuery);
    const previousQuery: Query = {
      filter: {
        time_scope_units: 'month',
        time_scope_value: -2,
        resolution: 'daily',
        limit: 3,
        ...(query && query.filter && query.filter.account && { account: query.filter.account }),
        ...(groupByOrg && useFilter && { [orgUnitIdKey]: groupByOrg }),
      },
      filter_by: query ? query.filter_by : undefined,
      group_by: {
        ...(groupByOrg && !useFilter && ({ [orgUnitIdKey]: groupByOrg } as any)),
        [groupBy]: filterBy,
      },
    };
    const previousQueryString = getQuery(previousQuery);

    // Current report
    const currentReport = reportSelectors.selectReport(state, reportPathsType, reportType, currentQueryString);
    const currentReportFetchStatus = reportSelectors.selectReportFetchStatus(
      state,
      reportPathsType,
      reportType,
      currentQueryString
    );

    // Previous report
    const previousReport = reportSelectors.selectReport(state, reportPathsType, reportType, previousQueryString);
    const previousReportFetchStatus = reportSelectors.selectReportFetchStatus(
      state,
      reportPathsType,
      reportType,
      previousQueryString
    );

    return {
      currentQuery,
      currentQueryString,
      currentReport,
      currentReportFetchStatus,
      previousQuery,
      previousQueryString,
      previousReport,
      previousReportFetchStatus,
    };
  }
);

const mapDispatchToProps: HistoricalDataTrendChartDispatchProps = {
  fetchReport: reportActions.fetchReport,
};

const HistoricalDataTrendChart = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(HistoricalDataTrendChartBase)
);

export { HistoricalDataTrendChart, HistoricalDataTrendChartProps };
