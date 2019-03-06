import { Tab, Tabs } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import { AwsQuery, getQuery, parseQuery } from 'api/awsQuery';
import { AwsReport, AwsReportType } from 'api/awsReports';
import { transformAwsReport } from 'components/charts/commonChart/chartUtils';
import { Link } from 'components/link';
import {
  AwsReportSummary,
  AwsReportSummaryAlt,
  AwsReportSummaryDetails,
  AwsReportSummaryItem,
  AwsReportSummaryItems,
  AwsReportSummaryTrend,
} from 'components/reports/awsReportSummary';
import formatDate from 'date-fns/format';
import getDate from 'date-fns/get_date';
import getMonth from 'date-fns/get_month';
import startOfMonth from 'date-fns/start_of_month';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import {
  awsDashboardActions,
  awsDashboardSelectors,
  AwsDashboardTab,
  AwsDashboardWidget as AwsDashboardWidgetStatic,
} from 'store/awsDashboard';
import { awsReportsSelectors } from 'store/awsReports';
import { createMapStateToProps } from 'store/common';
import { formatValue } from 'utils/formatValue';
import { GetComputedAwsReportItemsParams } from 'utils/getComputedAwsReportItems';
import { styles } from './awsDashboardWidget.styles';

interface AwsDashboardWidgetOwnProps {
  widgetId: number;
}

interface AwsDashboardWidgetStateProps extends AwsDashboardWidgetStatic {
  currentQuery: string;
  currentReport: AwsReport;
  currentReportFetchStatus: number;
  previousQuery: string;
  previousReport: AwsReport;
  tabsQuery: string;
  tabsReport: AwsReport;
}

interface AwsDashboardWidgetDispatchProps {
  fetchReports: typeof awsDashboardActions.fetchWidgetReports;
  updateTab: typeof awsDashboardActions.changeWidgetTab;
}

type AwsDashboardWidgetProps = AwsDashboardWidgetOwnProps &
  AwsDashboardWidgetStateProps &
  AwsDashboardWidgetDispatchProps &
  InjectedTranslateProps;

export const getIdKeyForTab = (
  tab: AwsDashboardTab
): GetComputedAwsReportItemsParams['idKey'] => {
  switch (tab) {
    case AwsDashboardTab.services:
      return 'service';
    case AwsDashboardTab.accounts:
      return 'account';
    case AwsDashboardTab.regions:
      return 'region';
    case AwsDashboardTab.instanceType:
      return 'instance_type';
  }
};

class AwsDashboardWidgetBase extends React.Component<AwsDashboardWidgetProps> {
  public state = {
    activeTabKey: 0,
  };

  public componentDidMount() {
    const { availableTabs, fetchReports, id, widgetId } = this.props;
    this.props.updateTab(id, availableTabs[0]);
    fetchReports(widgetId);
  }

  private buildDetailsLink = () => {
    const { currentQuery } = this.props;
    const groupBy = parseQuery<AwsQuery>(currentQuery).group_by;
    return `/aws?${getQuery({
      group_by: groupBy,
      order_by: { cost: 'desc' },
    })}`;
  };

  private handleTabClick = (event, tabIndex) => {
    const { availableTabs, id } = this.props;
    const tab = availableTabs[tabIndex];

    this.props.updateTab(id, tab);
    this.setState({
      activeTabKey: tabIndex,
    });
  };

  private getChart = (height: number) => {
    const { currentReport, previousReport, t, trend } = this.props;
    const currentData = transformAwsReport(currentReport, trend.type);
    const previousData = transformAwsReport(previousReport, trend.type);

    return (
      <AwsReportSummaryTrend
        currentData={currentData}
        formatDatumValue={formatValue}
        formatDatumOptions={trend.formatOptions}
        height={height}
        previousData={previousData}
        title={t(trend.titleKey)}
      />
    );
  };

  private getDetails = () => {
    const { currentReport, details, reportType } = this.props;
    return (
      <AwsReportSummaryDetails
        formatOptions={details.formatOptions}
        formatValue={formatValue}
        label={this.getDetailsLabel()}
        report={currentReport}
        reportType={reportType}
      />
    );
  };

  private getDetailsLabel = () => {
    const { details, t } = this.props;
    return t(details.labelKey, { context: details.labelKeyContext });
  };

  private getDetailsLink = () => {
    const { currentTab, reportType } = this.props;
    return (
      reportType === AwsReportType.cost && (
        <Link to={this.buildDetailsLink()}>
          {this.getDetailsLinkTitle(currentTab)}
        </Link>
      )
    );
  };

  private getDetailsLinkTitle = (tab: AwsDashboardTab) => {
    const { t } = this.props;
    const key = getIdKeyForTab(tab) || '';

    return t('group_by.all', { groupBy: key });
  };

  private getHorizontalLayout = () => {
    const { currentReportFetchStatus } = this.props;
    return (
      <AwsReportSummaryAlt
        detailsLink={this.getDetailsLink()}
        status={currentReportFetchStatus}
        subTitle={this.getSubTitle()}
        tabs={this.getTabs()}
        title={this.getTitle()}
      >
        {this.getDetails()}
        {this.getChart(180)}
      </AwsReportSummaryAlt>
    );
  };

  private getSubTitle = () => {
    const { t } = this.props;

    const today = new Date();
    const month = getMonth(today);
    const endDate = formatDate(today, 'Do');
    const startDate = formatDate(startOfMonth(today), 'Do');

    return t('aws_dashboard.widget_subtitle', {
      endDate,
      month,
      startDate,
      count: getDate(today),
    });
  };

  private getTab = (tab: AwsDashboardTab, index: number) => {
    const { tabsReport } = this.props;
    const currentTab = getIdKeyForTab(tab as AwsDashboardTab);

    return (
      <Tab
        eventKey={index}
        key={`${getIdKeyForTab(tab)}-tab`}
        title={this.getTabTitle(tab)}
      >
        <div className={css(styles.tabs)}>
          <AwsReportSummaryItems
            idKey={currentTab}
            key={`${currentTab}-items`}
            report={tabsReport}
          >
            {({ items }) =>
              items.map(reportItem => this.getTabItem(tab, reportItem))
            }
          </AwsReportSummaryItems>
        </div>
      </Tab>
    );
  };

  private getTabItem = (tab: AwsDashboardTab, reportItem) => {
    const { availableTabs, tabsReport, topItems } = this.props;
    const { activeTabKey } = this.state;

    const currentTab = getIdKeyForTab(tab);
    const activeTab = getIdKeyForTab(availableTabs[activeTabKey]);

    if (activeTab === currentTab) {
      return (
        <AwsReportSummaryItem
          key={`${reportItem.id}-item`}
          formatOptions={topItems.formatOptions}
          formatValue={formatValue}
          label={reportItem.label ? reportItem.label.toString() : ''}
          totalValue={tabsReport.meta.total.cost.value}
          units={reportItem.units}
          value={reportItem.total}
        />
      );
    } else {
      return null;
    }
  };

  private getTabs = () => {
    const { availableTabs } = this.props;
    return (
      <Tabs
        isFilled
        activeKey={this.state.activeTabKey}
        onSelect={this.handleTabClick}
      >
        {availableTabs.map((tab, index) => this.getTab(tab, index))}
      </Tabs>
    );
  };

  private getTabTitle = (tab: AwsDashboardTab) => {
    const { t } = this.props;
    const key = getIdKeyForTab(tab) || '';

    return t('group_by.top', { groupBy: key });
  };

  private getTitle = () => {
    const { t, titleKey } = this.props;

    const today = new Date();
    const month = getMonth(today);
    const endDate = formatDate(today, 'Do');
    const startDate = formatDate(startOfMonth(today), 'Do');

    return t(titleKey, { endDate, month, startDate });
  };

  private getVerticalLayout = () => {
    const { currentReportFetchStatus } = this.props;
    return (
      <AwsReportSummary
        detailsLink={this.getDetailsLink()}
        status={currentReportFetchStatus}
        subTitle={this.getSubTitle()}
        title={this.getTitle()}
      >
        {this.getDetails()}
        {this.getChart(75)}
        {this.getTabs()}
      </AwsReportSummary>
    );
  };

  public render() {
    const { isHorizontal = false } = this.props;
    return Boolean(isHorizontal)
      ? this.getHorizontalLayout()
      : this.getVerticalLayout();
  }
}

const mapStateToProps = createMapStateToProps<
  AwsDashboardWidgetOwnProps,
  AwsDashboardWidgetStateProps
>((state, { widgetId }) => {
  const widget = awsDashboardSelectors.selectWidget(state, widgetId);
  const queries = awsDashboardSelectors.selectWidgetQueries(state, widgetId);
  return {
    ...widget,
    currentQuery: queries.current,
    previousQuery: queries.previous,
    tabsQuery: queries.tabs,
    currentReport: awsReportsSelectors.selectReport(
      state,
      widget.reportType,
      queries.current
    ),
    currentReportFetchStatus: awsReportsSelectors.selectReportFetchStatus(
      state,
      widget.reportType,
      queries.current
    ),
    previousReport: awsReportsSelectors.selectReport(
      state,
      widget.reportType,
      queries.previous
    ),
    tabsReport: awsReportsSelectors.selectReport(
      state,
      widget.reportType,
      queries.tabs
    ),
  };
});

const mapDispatchToProps: AwsDashboardWidgetDispatchProps = {
  fetchReports: awsDashboardActions.fetchWidgetReports,
  updateTab: awsDashboardActions.changeWidgetTab,
};

const AwsDashboardWidget = translate()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(AwsDashboardWidgetBase)
);

export { AwsDashboardWidget, AwsDashboardWidgetBase, AwsDashboardWidgetProps };
