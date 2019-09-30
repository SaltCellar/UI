import { css } from '@patternfly/react-styles';
import {
  Skeleton,
  SkeletonSize,
} from '@redhat-cloud-services/frontend-components/components/Skeleton';
import { AwsReport, AwsReportType } from 'api/awsReports';
import {
  ChartType,
  transformAwsReport,
} from 'components/charts/commonChart/chartUtils';
import { HistoricalTrendChart } from 'components/charts/historicalTrendChart';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import * as awsReportsActions from 'store/awsReports/awsReportsActions';
import * as awsReportsSelectors from 'store/awsReports/awsReportsSelectors';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { formatValue, unitLookupKey } from 'utils/formatValue';
import { chartStyles, styles } from './historicalChart.styles';

interface HistoricalModalOwnProps {
  currentQueryString: string;
  previousQueryString: string;
}

interface HistoricalModalStateProps {
  currentCostReport?: AwsReport;
  currentCostReportFetchStatus?: FetchStatus;
  currentInstanceReport?: AwsReport;
  currentInstanceReportFetchStatus?: FetchStatus;
  currentStorageReport?: AwsReport;
  currentStorageReportFetchStatus?: FetchStatus;
  previousCostReport?: AwsReport;
  previousCostReportFetchStatus?: FetchStatus;
  previousInstanceReport?: AwsReport;
  previousInstanceReportFetchStatus?: FetchStatus;
  previousStorageReport?: AwsReport;
  previousStorageReportFetchStatus?: FetchStatus;
}

interface HistoricalModalDispatchProps {
  fetchReport?: typeof awsReportsActions.fetchReport;
}

type HistoricalModalProps = HistoricalModalOwnProps &
  HistoricalModalStateProps &
  HistoricalModalDispatchProps &
  InjectedTranslateProps;

const costReportType = AwsReportType.cost;
const instanceReportType = AwsReportType.instanceType;
const storageReportType = AwsReportType.storage;

class HistoricalModalBase extends React.Component<HistoricalModalProps> {
  public componentDidMount() {
    const { fetchReport, currentQueryString, previousQueryString } = this.props;

    fetchReport(costReportType, currentQueryString);
    fetchReport(instanceReportType, currentQueryString);
    fetchReport(storageReportType, currentQueryString);
    fetchReport(costReportType, previousQueryString);
    fetchReport(instanceReportType, previousQueryString);
    fetchReport(storageReportType, previousQueryString);
  }

  public componentDidUpdate(prevProps: HistoricalModalProps) {
    const { fetchReport, currentQueryString, previousQueryString } = this.props;
    if (prevProps.currentQueryString !== currentQueryString) {
      fetchReport(costReportType, currentQueryString);
      fetchReport(instanceReportType, currentQueryString);
      fetchReport(storageReportType, currentQueryString);
    }
    if (prevProps.previousQueryString !== previousQueryString) {
      fetchReport(costReportType, previousQueryString);
      fetchReport(instanceReportType, previousQueryString);
      this.props.fetchReport(storageReportType, previousQueryString);
    }
  }

  private getSkeleton = () => {
    return (
      <>
        <Skeleton
          className={css(styles.chartSkeleton)}
          size={SkeletonSize.md}
        />
        <Skeleton
          className={css(styles.legendSkeleton)}
          size={SkeletonSize.xs}
        />
      </>
    );
  };

  public render() {
    const {
      currentCostReport,
      currentCostReportFetchStatus,
      currentInstanceReport,
      currentInstanceReportFetchStatus,
      currentStorageReport,
      currentStorageReportFetchStatus,
      previousCostReport,
      previousCostReportFetchStatus,
      previousInstanceReport,
      previousInstanceReportFetchStatus,
      previousStorageReport,
      previousStorageReportFetchStatus,
      t,
    } = this.props;

    // Cost data
    const currentCostData = transformAwsReport(
      currentCostReport,
      ChartType.rolling,
      'date',
      'cost'
    );
    const previousCostData = transformAwsReport(
      previousCostReport,
      ChartType.rolling,
      'date',
      'cost'
    );

    // Instance data
    const currentInstanceData = transformAwsReport(
      currentInstanceReport,
      ChartType.daily,
      'date',
      'cost'
    );
    const previousInstanceData = transformAwsReport(
      previousInstanceReport,
      ChartType.daily,
      'date',
      'cost'
    );

    // Storage data
    const currentStorageData = transformAwsReport(
      currentStorageReport,
      ChartType.daily,
      'date',
      'cost'
    );
    const previousStorageData = transformAwsReport(
      previousStorageReport,
      ChartType.daily,
      'date',
      'cost'
    );

    const costUnits =
      currentCostReport &&
      currentCostReport.meta &&
      currentCostReport.meta.total &&
      currentCostReport.meta.total.cost
        ? currentCostReport.meta.total.cost.units
        : 'USD';

    return (
      <div className={css(styles.chartContainer)}>
        <div className={css(styles.costChart)}>
          {currentCostReportFetchStatus === FetchStatus.inProgress &&
          previousCostReportFetchStatus === FetchStatus.inProgress ? (
            this.getSkeleton()
          ) : (
            <HistoricalTrendChart
              containerHeight={chartStyles.chartContainerHeight}
              currentData={currentCostData}
              formatDatumValue={formatValue}
              formatDatumOptions={{}}
              height={chartStyles.chartHeight}
              previousData={previousCostData}
              title={t('aws_details.historical.cost_title')}
              xAxisLabel={t('aws_details.historical.day_of_month_label')}
              yAxisLabel={t('aws_details.historical.cost_label', {
                units: t(`units.${unitLookupKey(costUnits)}`),
              })}
            />
          )}
        </div>
        <div className={css(styles.instanceChart)}>
          {currentInstanceReportFetchStatus === FetchStatus.inProgress &&
          previousInstanceReportFetchStatus === FetchStatus.inProgress ? (
            this.getSkeleton()
          ) : (
            <HistoricalTrendChart
              containerHeight={chartStyles.chartContainerHeight}
              currentData={currentInstanceData}
              formatDatumValue={formatValue}
              formatDatumOptions={{}}
              height={chartStyles.chartHeight}
              previousData={previousInstanceData}
              title={t('aws_details.historical.instance_title')}
              xAxisLabel={t('aws_details.historical.day_of_month_label')}
              yAxisLabel={t('aws_details.historical.instance_label')}
            />
          )}
        </div>
        <div className={css(styles.storageChart)}>
          {currentStorageReportFetchStatus === FetchStatus.inProgress &&
          previousStorageReportFetchStatus === FetchStatus.inProgress ? (
            this.getSkeleton()
          ) : (
            <HistoricalTrendChart
              containerHeight={chartStyles.chartContainerHeight}
              currentData={currentStorageData}
              formatDatumValue={formatValue}
              formatDatumOptions={{}}
              height={chartStyles.chartHeight}
              previousData={previousStorageData}
              title={t('aws_details.historical.storage_title')}
              xAxisLabel={t('aws_details.historical.day_of_month_label')}
              yAxisLabel={t('aws_details.historical.storage_label')}
            />
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = createMapStateToProps<
  HistoricalModalOwnProps,
  HistoricalModalStateProps
>((state, { currentQueryString, previousQueryString }) => {
  // Current report
  const currentCostReport = awsReportsSelectors.selectReport(
    state,
    costReportType,
    currentQueryString
  );
  const currentCostReportFetchStatus = awsReportsSelectors.selectReportFetchStatus(
    state,
    costReportType,
    currentQueryString
  );
  const currentInstanceReport = awsReportsSelectors.selectReport(
    state,
    instanceReportType,
    currentQueryString
  );
  const currentInstanceReportFetchStatus = awsReportsSelectors.selectReportFetchStatus(
    state,
    instanceReportType,
    currentQueryString
  );
  const currentStorageReport = awsReportsSelectors.selectReport(
    state,
    storageReportType,
    currentQueryString
  );
  const currentStorageReportFetchStatus = awsReportsSelectors.selectReportFetchStatus(
    state,
    storageReportType,
    currentQueryString
  );

  // Previous report
  const previousCostReport = awsReportsSelectors.selectReport(
    state,
    costReportType,
    previousQueryString
  );
  const previousCostReportFetchStatus = awsReportsSelectors.selectReportFetchStatus(
    state,
    costReportType,
    previousQueryString
  );
  const previousInstanceReport = awsReportsSelectors.selectReport(
    state,
    instanceReportType,
    previousQueryString
  );
  const previousInstanceReportFetchStatus = awsReportsSelectors.selectReportFetchStatus(
    state,
    instanceReportType,
    previousQueryString
  );
  const previousStorageReport = awsReportsSelectors.selectReport(
    state,
    storageReportType,
    previousQueryString
  );
  const previousStorageReportFetchStatus = awsReportsSelectors.selectReportFetchStatus(
    state,
    storageReportType,
    previousQueryString
  );
  return {
    currentCostReport,
    currentCostReportFetchStatus,
    currentInstanceReport,
    currentInstanceReportFetchStatus,
    currentStorageReport,
    currentStorageReportFetchStatus,
    previousCostReport,
    previousCostReportFetchStatus,
    previousInstanceReport,
    previousInstanceReportFetchStatus,
    previousStorageReport,
    previousStorageReportFetchStatus,
  };
});

const mapDispatchToProps: HistoricalModalDispatchProps = {
  fetchReport: awsReportsActions.fetchReport,
};

const HistoricalChart = translate()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(HistoricalModalBase)
);

export { HistoricalChart, HistoricalModalProps };
