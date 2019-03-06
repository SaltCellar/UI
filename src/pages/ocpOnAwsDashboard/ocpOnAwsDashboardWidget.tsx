import { Tab, Tabs } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import { getQuery, OcpOnAwsQuery, parseQuery } from 'api/ocpOnAwsQuery';
import { OcpOnAwsReport, OcpOnAwsReportType } from 'api/ocpOnAwsReports';
import { transformOcpOnAwsReport } from 'components/charts/commonChart/chartUtils';
import { Link } from 'components/link';
import {
  OcpOnAwsReportSummary,
  OcpOnAwsReportSummaryAlt,
  OcpOnAwsReportSummaryDetails,
  OcpOnAwsReportSummaryItem,
  OcpOnAwsReportSummaryItems,
  OcpOnAwsReportSummaryTrend,
  OcpOnAwsReportSummaryUsage,
} from 'components/reports/ocpOnAwsReportSummary';
import formatDate from 'date-fns/format';
import getDate from 'date-fns/get_date';
import getMonth from 'date-fns/get_month';
import startOfMonth from 'date-fns/start_of_month';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import {
  ocpOnAwsDashboardActions,
  ocpOnAwsDashboardSelectors,
  OcpOnAwsDashboardTab,
  OcpOnAwsDashboardWidget as OcpOnAwsDashboardWidgetStatic,
} from 'store/ocpOnAwsDashboard';
import { ocpOnAwsReportsSelectors } from 'store/ocpOnAwsReports';
import { formatValue } from 'utils/formatValue';
import { GetComputedOcpOnAwsReportItemsParams } from 'utils/getComputedOcpOnAwsReportItems';
import { styles } from './ocpOnAwsDashboardWidget.styles';

interface OcpOnAwsDashboardWidgetOwnProps {
  widgetId: number;
}

interface OcpOnAwsDashboardWidgetStateProps
  extends OcpOnAwsDashboardWidgetStatic {
  currentQuery: string;
  currentReport: OcpOnAwsReport;
  currentReportFetchStatus: number;
  previousQuery: string;
  previousReport: OcpOnAwsReport;
  tabsQuery: string;
  tabsReport: OcpOnAwsReport;
}

interface OcpOnAwsDashboardWidgetDispatchProps {
  fetchReports: typeof ocpOnAwsDashboardActions.fetchWidgetReports;
  updateTab: typeof ocpOnAwsDashboardActions.changeWidgetTab;
}

type OcpOnAwsDashboardWidgetProps = OcpOnAwsDashboardWidgetOwnProps &
  OcpOnAwsDashboardWidgetStateProps &
  OcpOnAwsDashboardWidgetDispatchProps &
  InjectedTranslateProps;

export const getIdKeyForTab = (
  tab: OcpOnAwsDashboardTab
): GetComputedOcpOnAwsReportItemsParams['idKey'] => {
  switch (tab) {
    case OcpOnAwsDashboardTab.clusters:
      return 'cluster';
    case OcpOnAwsDashboardTab.nodes:
      return 'node';
    case OcpOnAwsDashboardTab.projects:
      return 'project';
  }
};

class OcpOnAwsDashboardWidgetBase extends React.Component<
  OcpOnAwsDashboardWidgetProps
> {
  public state = {
    activeTabKey: 0,
  };

  public componentDidMount() {
    const { availableTabs, fetchReports, id, widgetId } = this.props;
    if (availableTabs) {
      this.props.updateTab(id, availableTabs[0]);
    }
    fetchReports(widgetId);
  }

  private buildDetailsLink = () => {
    const { currentQuery } = this.props;
    const groupBy = parseQuery<OcpOnAwsQuery>(currentQuery).group_by;
    return `/ocp?${getQuery({
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
    const { currentReport, previousReport, reportType, t, trend } = this.props;

    const reportItem =
      reportType === OcpOnAwsReportType.cost ? 'cost' : 'usage';
    const currentUsageData = transformOcpOnAwsReport(
      currentReport,
      trend.type,
      'date',
      reportItem
    );
    const previousUsageData = transformOcpOnAwsReport(
      previousReport,
      trend.type,
      'date',
      reportItem
    );
    const currentRequestData =
      reportType !== OcpOnAwsReportType.cost
        ? transformOcpOnAwsReport(currentReport, trend.type, 'date', 'request')
        : undefined;
    const previousRequestData =
      reportType !== OcpOnAwsReportType.cost
        ? transformOcpOnAwsReport(previousReport, trend.type, 'date', 'request')
        : undefined;

    return (
      <>
        {Boolean(
          reportType === OcpOnAwsReportType.cost ||
            reportType === OcpOnAwsReportType.instanceType ||
            reportType === OcpOnAwsReportType.storage
        ) ? (
          <OcpOnAwsReportSummaryTrend
            currentData={currentUsageData}
            formatDatumValue={formatValue}
            formatDatumOptions={trend.formatOptions}
            height={height}
            previousData={previousUsageData}
            title={t(trend.titleKey)}
          />
        ) : (
          <OcpOnAwsReportSummaryUsage
            currentRequestData={currentRequestData}
            currentUsageData={currentUsageData}
            formatDatumValue={formatValue}
            formatDatumOptions={trend.formatOptions}
            height={height}
            previousRequestData={previousRequestData}
            previousUsageData={previousUsageData}
          />
        )}
      </>
    );
  };

  private getDetails = () => {
    const { currentReport, details, reportType } = this.props;
    return (
      <OcpOnAwsReportSummaryDetails
        formatOptions={details.formatOptions}
        formatValue={formatValue}
        label={this.getDetailsLabel()}
        report={currentReport}
        reportType={reportType}
        requestLabel={this.getRequestLabel()}
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
      reportType === OcpOnAwsReportType.cost && (
        <Link to={this.buildDetailsLink()}>
          {this.getDetailsLinkTitle(currentTab)}
        </Link>
      )
    );
  };

  private getDetailsLinkTitle = (tab: OcpOnAwsDashboardTab) => {
    const { t } = this.props;
    const key = getIdKeyForTab(tab) || '';

    return t('group_by.all', { groupBy: key });
  };

  private getHorizontalLayout = () => {
    const { currentReportFetchStatus } = this.props;
    return (
      <OcpOnAwsReportSummaryAlt
        detailsLink={this.getDetailsLink()}
        status={currentReportFetchStatus}
        subTitle={`${this.getSubTitle()}`}
        tabs={this.getTabs()}
        title={this.getTitle()}
      >
        {this.getDetails()}
        {this.getChart(180)}
      </OcpOnAwsReportSummaryAlt>
    );
  };

  private getRequestLabel = () => {
    const { details, t } = this.props;
    return t(details.requestLabelKey, { context: details.labelKeyContext });
  };

  private getSubTitle = () => {
    const { t } = this.props;

    const today = new Date();
    const month = getMonth(today);
    const endDate = formatDate(today, 'Do');
    const startDate = formatDate(startOfMonth(today), 'Do');

    const test = t('ocp_on_aws_dashboard.ocp.widget_subtitle', {
      endDate,
      month,
      startDate,
      count: getDate(today),
    });
    return test;
  };

  private getTab = (tab: OcpOnAwsDashboardTab, index: number) => {
    const { tabsReport } = this.props;
    const currentTab = getIdKeyForTab(tab as OcpOnAwsDashboardTab);

    return (
      <Tab
        eventKey={index}
        key={`${getIdKeyForTab(tab)}-tab`}
        title={this.getTabTitle(tab)}
      >
        <div className={css(styles.tabs)}>
          <OcpOnAwsReportSummaryItems
            idKey={currentTab}
            key={`${currentTab}-items`}
            report={tabsReport}
          >
            {({ items }) =>
              items.map(reportItem => this.getTabItem(tab, reportItem))
            }
          </OcpOnAwsReportSummaryItems>
        </div>
      </Tab>
    );
  };

  private getTabItem = (tab: OcpOnAwsDashboardTab, reportItem) => {
    const { availableTabs, reportType, tabsReport, topItems } = this.props;
    const { activeTabKey } = this.state;

    const currentTab = getIdKeyForTab(tab);
    const activeTab = getIdKeyForTab(availableTabs[activeTabKey]);

    if (activeTab === currentTab) {
      return (
        <OcpOnAwsReportSummaryItem
          key={`${reportItem.id}-item`}
          formatOptions={topItems.formatOptions}
          formatValue={formatValue}
          label={reportItem.label ? reportItem.label.toString() : ''}
          totalValue={
            reportType === OcpOnAwsReportType.cost
              ? tabsReport.meta.total.cost.value
              : tabsReport.meta.total.usage.value
          }
          units={reportItem.units}
          value={
            reportType === OcpOnAwsReportType.cost
              ? reportItem.cost
              : reportItem.usage
          }
        />
      );
    } else {
      return null;
    }
  };

  private getTabs = () => {
    const { availableTabs } = this.props;

    if (availableTabs) {
      return (
        <Tabs
          isFilled
          activeKey={this.state.activeTabKey}
          onSelect={this.handleTabClick}
        >
          {availableTabs.map((tab, index) => this.getTab(tab, index))}
        </Tabs>
      );
    } else {
      return null;
    }
  };

  private getTabTitle = (tab: OcpOnAwsDashboardTab) => {
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
      <OcpOnAwsReportSummary
        detailsLink={this.getDetailsLink()}
        status={currentReportFetchStatus}
        subTitle={this.getSubTitle()}
        title={this.getTitle()}
      >
        {this.getDetails()}
        {this.getChart(75)}
        {this.getTabs()}
      </OcpOnAwsReportSummary>
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
  OcpOnAwsDashboardWidgetOwnProps,
  OcpOnAwsDashboardWidgetStateProps
>((state, { widgetId }) => {
  const widget = ocpOnAwsDashboardSelectors.selectWidget(state, widgetId);
  const queries = ocpOnAwsDashboardSelectors.selectWidgetQueries(
    state,
    widgetId
  );
  return {
    ...widget,
    currentQuery: queries.current,
    previousQuery: queries.previous,
    tabsQuery: queries.tabs,
    currentReport: ocpOnAwsReportsSelectors.selectReport(
      state,
      widget.reportType,
      queries.current
    ),
    currentReportFetchStatus: ocpOnAwsReportsSelectors.selectReportFetchStatus(
      state,
      widget.reportType,
      queries.current
    ),
    previousReport: ocpOnAwsReportsSelectors.selectReport(
      state,
      widget.reportType,
      queries.previous
    ),
    tabsReport: ocpOnAwsReportsSelectors.selectReport(
      state,
      widget.reportType,
      queries.tabs
    ),
  };
});

const mapDispatchToProps: OcpOnAwsDashboardWidgetDispatchProps = {
  fetchReports: ocpOnAwsDashboardActions.fetchWidgetReports,
  updateTab: ocpOnAwsDashboardActions.changeWidgetTab,
};

const OcpOnAwsDashboardWidget = translate()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(OcpOnAwsDashboardWidgetBase)
);

export {
  OcpOnAwsDashboardWidget,
  OcpOnAwsDashboardWidgetBase,
  OcpOnAwsDashboardWidgetProps,
};
