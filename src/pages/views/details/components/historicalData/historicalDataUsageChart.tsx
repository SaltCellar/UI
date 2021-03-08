import Skeleton from '@redhat-cloud-services/frontend-components/Skeleton';
import { getQuery, Query } from 'api/queries/query';
import { Report, ReportPathsType, ReportType } from 'api/reports/report';
import { ChartType, transformReport } from 'components/charts/common/chartDatumUtils';
import { HistoricalUsageChart } from 'components/charts/historicalUsageChart';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { reportActions, reportSelectors } from 'store/reports';
import { formatValue, unitLookupKey } from 'utils/formatValue';

import { chartStyles, styles } from './historicalChart.styles';

interface HistoricalDataUsageChartOwnProps {
  filterBy: string | number;
  groupBy: string;
  reportPathsType: ReportPathsType;
  reportType: ReportType;
}

interface HistoricalDataUsageChartStateProps {
  currentQuery?: Query;
  currentQueryString?: string;
  currentReport?: Report;
  currentReportFetchStatus?: FetchStatus;
  previousQuery?: Query;
  previousQueryString?: string;
  previousReport?: Report;
  previousReportFetchStatus?: FetchStatus;
}

interface HistoricalDataUsageChartDispatchProps {
  fetchReport?: typeof reportActions.fetchReport;
}

type HistoricalDataUsageChartProps = HistoricalDataUsageChartOwnProps &
  HistoricalDataUsageChartStateProps &
  HistoricalDataUsageChartDispatchProps &
  WithTranslation;

class HistoricalDataUsageChartBase extends React.Component<HistoricalDataUsageChartProps> {
  public componentDidMount() {
    const { fetchReport, currentQueryString, previousQueryString, reportPathsType, reportType } = this.props;

    fetchReport(reportPathsType, reportType, currentQueryString);
    fetchReport(reportPathsType, reportType, previousQueryString);
  }

  public componentDidUpdate(prevProps: HistoricalDataUsageChartProps) {
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
    const { currentReport, currentReportFetchStatus, previousReport, previousReportFetchStatus, t } = this.props;

    // Current data
    const currentLimitData = transformReport(currentReport, ChartType.daily, 'date', 'limit');
    const currentRequestData = transformReport(currentReport, ChartType.daily, 'date', 'request');
    const currentUsageData = transformReport(currentReport, ChartType.daily, 'date', 'usage');

    // Previous data
    const previousLimitData = transformReport(previousReport, ChartType.daily, 'date', 'limit');
    const previousRequestData = transformReport(previousReport, ChartType.daily, 'date', 'request');
    const previousUsageData = transformReport(previousReport, ChartType.daily, 'date', 'usage');

    const usageUnits =
      currentReport && currentReport.meta && currentReport.meta.total && currentReport.meta.total.usage
        ? currentReport.meta.total.usage.units
        : '';

    return (
      <div style={styles.chartContainer}>
        <div style={styles.usageChart}>
          {currentReportFetchStatus === FetchStatus.inProgress &&
          previousReportFetchStatus === FetchStatus.inProgress ? (
            this.getSkeleton()
          ) : (
            <HistoricalUsageChart
              adjustContainerHeight
              containerHeight={chartStyles.chartContainerHeight}
              currentLimitData={currentLimitData}
              currentRequestData={currentRequestData}
              currentUsageData={currentUsageData}
              formatDatumValue={formatValue}
              formatDatumOptions={{}}
              height={chartStyles.chartHeight}
              previousLimitData={previousLimitData}
              previousRequestData={previousRequestData}
              previousUsageData={previousUsageData}
              xAxisLabel={t(`breakdown.historical_chart.day_of_month_label`)}
              yAxisLabel={t(`breakdown.historical_chart.units_label`, {
                units: t(`units.${unitLookupKey(usageUnits)}`),
              })}
            />
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = createMapStateToProps<HistoricalDataUsageChartOwnProps, HistoricalDataUsageChartStateProps>(
  (state, { filterBy, groupBy, reportPathsType, reportType }) => {
    const currentQuery: Query = {
      filter: {
        time_scope_units: 'month',
        time_scope_value: -1,
        resolution: 'daily',
        limit: 3,
      },
      group_by: {
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
      },
      group_by: {
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

const mapDispatchToProps: HistoricalDataUsageChartDispatchProps = {
  fetchReport: reportActions.fetchReport,
};

const HistoricalDataUsageChart = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(HistoricalDataUsageChartBase)
);

export { HistoricalDataUsageChart, HistoricalDataUsageChartProps };
