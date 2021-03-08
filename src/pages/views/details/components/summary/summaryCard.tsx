import {
  Button,
  ButtonType,
  ButtonVariant,
  Card,
  CardBody,
  CardFooter,
  CardTitle,
  Title,
} from '@patternfly/react-core';
import Skeleton from '@redhat-cloud-services/frontend-components/Skeleton';
import { getQuery, orgUnitIdKey, Query } from 'api/queries/query';
import { OcpReport } from 'api/reports/ocpReports';
import { ReportPathsType, ReportType } from 'api/reports/report';
import { ReportSummaryItem, ReportSummaryItems } from 'components/reports/reportSummary';
import { SummaryModal } from 'pages/views/details/components/summary/summaryModal';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { reportActions, reportSelectors } from 'store/reports';
import { getTestProps, testIds } from 'testIds';
import { getComputedReportItems } from 'utils/computedReport/getComputedReportItems';
import { formatValue } from 'utils/formatValue';

import { styles } from './summaryCard.styles';

interface SummaryOwnProps {
  filterBy: string | number;
  groupBy: string;
  query?: Query;
  reportGroupBy?: string;
  reportPathsType: ReportPathsType;
  reportType: ReportType;
}

interface SummaryStateProps {
  queryString?: string;
  report?: OcpReport;
  reportFetchStatus?: FetchStatus;
}

interface SummaryState {
  isBulletChartModalOpen: boolean;
}

interface SummaryDispatchProps {
  fetchReport?: typeof reportActions.fetchReport;
}

type SummaryProps = SummaryOwnProps & SummaryStateProps & SummaryDispatchProps & WithTranslation;

class SummaryBase extends React.Component<SummaryProps> {
  public state: SummaryState = {
    isBulletChartModalOpen: false,
  };

  public componentDidMount() {
    const { fetchReport, queryString, reportPathsType, reportType } = this.props;
    fetchReport(reportPathsType, reportType, queryString);
  }

  public componentDidUpdate(prevProps: SummaryProps) {
    const { fetchReport, queryString, reportPathsType, reportType } = this.props;
    if (prevProps.queryString !== queryString) {
      fetchReport(reportPathsType, reportType, queryString);
    }
  }

  private getItems = () => {
    const { report, reportGroupBy } = this.props;

    const computedItems = getComputedReportItems({
      report,
      idKey: reportGroupBy as any,
    });
    return computedItems;
  };

  private getSummary = () => {
    const { report, reportGroupBy, reportFetchStatus } = this.props;
    return (
      <ReportSummaryItems idKey={reportGroupBy as any} report={report} status={reportFetchStatus}>
        {({ items }) =>
          items.map(reportItem => (
            <ReportSummaryItem
              key={`${reportItem.id}-item`}
              formatOptions={{}}
              formatValue={formatValue}
              label={reportItem.label ? reportItem.label.toString() : undefined}
              totalValue={report.meta.total.cost.total.value}
              units={report.meta.total.cost.total.units}
              value={reportItem.cost.total.value}
            />
          ))
        }
      </ReportSummaryItems>
    );
  };

  private getViewAll = () => {
    const { filterBy, groupBy, query, reportGroupBy, reportPathsType, t } = this.props;
    const { isBulletChartModalOpen } = this.state;

    const computedItems = this.getItems();
    const otherIndex = computedItems.findIndex(i => {
      const id = i.id;
      if (id && id !== null) {
        return id.toString().includes('Other');
      }
    });

    if (otherIndex !== -1) {
      return (
        <div style={styles.viewAllContainer}>
          <Button
            {...getTestProps(testIds.details.view_all_btn)}
            onClick={this.handleBulletChartModalOpen}
            type={ButtonType.button}
            variant={ButtonVariant.link}
          >
            {t('details.view_all', { groupBy: reportGroupBy })}
          </Button>
          <SummaryModal
            filterBy={filterBy}
            groupBy={groupBy}
            isOpen={isBulletChartModalOpen}
            onClose={this.handleBulletChartModalClose}
            query={query}
            reportGroupBy={reportGroupBy}
            reportPathsType={reportPathsType}
          />
        </div>
      );
    } else {
      return null;
    }
  };

  private handleBulletChartModalClose = (isOpen: boolean) => {
    this.setState({ isBulletChartModalOpen: isOpen });
  };

  private handleBulletChartModalOpen = event => {
    this.setState({ isBulletChartModalOpen: true });
    event.preventDefault();
  };

  public render() {
    const { reportGroupBy, reportFetchStatus, t } = this.props;

    return (
      <Card style={styles.card}>
        <CardTitle>
          <Title headingLevel="h2" size="lg">
            {t('breakdown.summary_title', { groupBy: reportGroupBy })}
          </Title>
        </CardTitle>
        <CardBody>
          {reportFetchStatus === FetchStatus.inProgress ? (
            <>
              <Skeleton size="md" />
              <Skeleton size="md" style={styles.skeleton} />
              <Skeleton size="md" style={styles.skeleton} />
              <Skeleton size="md" style={styles.skeleton} />
            </>
          ) : (
            this.getSummary()
          )}
        </CardBody>
        <CardFooter>{this.getViewAll()}</CardFooter>
      </Card>
    );
  }
}

const mapStateToProps = createMapStateToProps<SummaryOwnProps, SummaryStateProps>(
  (state, { filterBy, groupBy, query, reportGroupBy, reportPathsType, reportType }) => {
    const groupByOrg = query && query.group_by[orgUnitIdKey] ? query.group_by[orgUnitIdKey] : undefined;
    const newQuery: Query = {
      filter: {
        limit: 3,
        time_scope_units: 'month',
        time_scope_value: -1,
        resolution: 'monthly',
        [groupBy]: filterBy, // Other "filter_by"s must be applied here
        ...(query && query.filter && query.filter.account && { account: query.filter.account }),
      },
      filter_by: query ? query.filter_by : undefined,
      group_by: {
        ...(groupByOrg && ({ [orgUnitIdKey]: groupByOrg } as any)),
        ...(reportGroupBy && { [reportGroupBy]: '*' }), // Group by specific account, project, etc.
      },
    };
    const queryString = getQuery(newQuery);
    const report = reportSelectors.selectReport(state, reportPathsType, reportType, queryString);
    const reportFetchStatus = reportSelectors.selectReportFetchStatus(state, reportPathsType, reportType, queryString);
    return {
      queryString,
      report,
      reportFetchStatus,
      reportPathsType,
      reportType,
    };
  }
);

const mapDispatchToProps: SummaryDispatchProps = {
  fetchReport: reportActions.fetchReport,
};

const SummaryCard = withTranslation()(connect(mapStateToProps, mapDispatchToProps)(SummaryBase));

export { SummaryCard, SummaryProps };
