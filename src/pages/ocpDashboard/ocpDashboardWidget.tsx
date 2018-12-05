import { getQuery, OcpQuery, parseQuery } from 'api/ocpQuery';
import { OcpReport, OcpReportType } from 'api/ocpReports';
import {
  getDatumDateRange,
  transformOcpReport,
} from 'components/commonChart/chartUtils';
import { Link } from 'components/link';
import {
  OcpReportSummary,
  OcpReportSummaryDetails,
  OcpReportSummaryItem,
  OcpReportSummaryItems,
  OcpReportSummaryTrend,
  OcpReportSummaryUsage,
} from 'components/ocpReportSummary';
import { TabData, Tabs } from 'components/tabs';
import formatDate from 'date-fns/format';
import getDate from 'date-fns/get_date';
import getMonth from 'date-fns/get_month';
import startOfMonth from 'date-fns/start_of_month';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import {
  ocpDashboardActions,
  ocpDashboardSelectors,
  OcpDashboardTab,
  OcpDashboardWidget as OcpDashboardWidgetStatic,
} from 'store/ocpDashboard';
import { ocpReportsSelectors } from 'store/ocpReports';
import { formatValue } from 'utils/formatValue';
import { GetComputedOcpReportItemsParams } from 'utils/getComputedOcpReportItems';

interface OcpDashboardWidgetOwnProps {
  widgetId: number;
}

interface OcpDashboardWidgetStateProps extends OcpDashboardWidgetStatic {
  current: OcpReport;
  previous: OcpReport;
  tabs: OcpReport;
  currentQuery: string;
  previousQuery: string;
  tabsQuery: string;
  status: number;
}

interface OcpDashboardWidgetDispatchProps {
  fetchReports: typeof ocpDashboardActions.fetchWidgetReports;
  updateTab: typeof ocpDashboardActions.changeWidgetTab;
}

type OcpDashboardWidgetProps = OcpDashboardWidgetOwnProps &
  OcpDashboardWidgetStateProps &
  OcpDashboardWidgetDispatchProps &
  InjectedTranslateProps;

export const getIdKeyForTab = (
  tab: OcpDashboardTab
): GetComputedOcpReportItemsParams['idKey'] => {
  switch (tab) {
    case OcpDashboardTab.clusters:
      return 'cluster';
    case OcpDashboardTab.nodes:
      return 'node';
    case OcpDashboardTab.projects:
      return 'project';
  }
};

class OcpDashboardWidgetBase extends React.Component<OcpDashboardWidgetProps> {
  public componentDidMount() {
    const { fetchReports, widgetId } = this.props;
    fetchReports(widgetId);
  }

  private getTabTitle = (tab: OcpDashboardTab) => {
    const { t } = this.props;
    const key = getIdKeyForTab(tab) || '';

    return t('group_by.top', { groupBy: key });
  };

  private getDetailsLinkTitle = (tab: OcpDashboardTab) => {
    const { t } = this.props;
    const key = getIdKeyForTab(tab) || '';

    return t('group_by.all', { groupBy: key });
  };

  private buildDetailsLink = () => {
    const { currentQuery } = this.props;
    const groupBy = parseQuery<OcpQuery>(currentQuery).group_by;
    return `/ocp?${getQuery({
      group_by: groupBy,
      order_by: { charge: 'desc' },
    })}`;
  };

  private renderTab = (tabData: TabData) => {
    const { reportType, tabs, topItems } = this.props;

    const currentTab = tabData.id as OcpDashboardTab;

    return (
      <OcpReportSummaryItems idKey={getIdKeyForTab(currentTab)} report={tabs}>
        {({ items }) =>
          items.map(tabItem => (
            <OcpReportSummaryItem
              key={tabItem.id}
              formatOptions={topItems.formatOptions}
              formatValue={formatValue}
              label={tabItem.label.toString()}
              totalValue={
                reportType === OcpReportType.charge
                  ? tabs.total.charge
                  : tabs.total.usage
              }
              units={tabItem.units}
              value={
                reportType === OcpReportType.charge
                  ? tabItem.charge
                  : tabItem.usage
              }
            />
          ))
        }
      </OcpReportSummaryItems>
    );
  };

  private handleTabChange = (tabId: OcpDashboardTab) => {
    this.props.updateTab(this.props.id, tabId);
  };

  private getSubTitle = (
    endDateVal,
    endMonthVal,
    startDateVal,
    startMonthVal,
    countVal
  ) => {
    const { t } = this.props;
    const count = getDate(countVal);
    const endDate = formatDate(endDateVal, 'Do');
    const endMonth = getMonth(endMonthVal);
    const startDate = formatDate(startDateVal, 'Do');
    const startMonth = getMonth(startMonthVal);
    return t('ocp_dashboard.widget_subtitle', {
      endDate,
      endMonth,
      startDate,
      startMonth,
      count,
    });
  };

  public render() {
    const {
      t,
      titleKey,
      trend,
      details,
      current,
      previous,
      availableTabs,
      currentTab,
      reportType,
      status,
    } = this.props;

    const detailLabel = t(details.labelKey);
    const requestLabel = t(details.requestLabelKey);

    const detailsLink = reportType === OcpReportType.charge && (
      <Link to={this.buildDetailsLink()}>
        {this.getDetailsLinkTitle(currentTab)}
      </Link>
    );

    const reportItem = reportType === OcpReportType.charge ? 'charge' : 'usage';
    const currentData = transformOcpReport(current, trend.type, reportItem);
    const previousData =
      reportType === OcpReportType.charge
        ? transformOcpReport(previous, trend.type, reportItem)
        : undefined;
    const requestData =
      reportType !== OcpReportType.charge
        ? transformOcpReport(current, trend.type, 'request')
        : undefined;

    let subTitle;
    if (reportType === OcpReportType.charge) {
      const start = new Date();
      subTitle = this.getSubTitle(
        start,
        start,
        startOfMonth(start),
        start,
        start
      );
    } else {
      const [start, end] = getDatumDateRange(currentData);
      subTitle = this.getSubTitle(end, end, start, start, start);
    }

    return (
      <OcpReportSummary
        title={t(titleKey)}
        subTitle={subTitle}
        detailsLink={detailsLink}
        status={status}
      >
        <OcpReportSummaryDetails
          report={current}
          reportType={reportType}
          formatValue={formatValue}
          label={detailLabel}
          formatOptions={details.formatOptions}
          requestLabel={requestLabel}
        />
        {Boolean(reportType === OcpReportType.charge) ? (
          <OcpReportSummaryTrend
            title={t(trend.titleKey)}
            currentData={currentData}
            formatDatumValue={formatValue}
            formatDatumOptions={trend.formatOptions}
            previousData={previousData}
          />
        ) : (
          <OcpReportSummaryUsage
            currentData={currentData}
            formatDatumValue={formatValue}
            formatDatumOptions={trend.formatOptions}
            requestData={requestData}
            requestLegendLabel={t(trend.requestLegendKey)}
            usageLegendLabel={t(trend.usageLegendKey)}
          />
        )}
        <Tabs
          tabs={availableTabs.map(tab => ({
            id: tab,
            label: this.getTabTitle(tab),
            content: this.renderTab,
          }))}
          selected={currentTab}
          onChange={this.handleTabChange}
        />
      </OcpReportSummary>
    );
  }
}

const mapStateToProps = createMapStateToProps<
  OcpDashboardWidgetOwnProps,
  OcpDashboardWidgetStateProps
>((state, { widgetId }) => {
  const widget = ocpDashboardSelectors.selectWidget(state, widgetId);
  const queries = ocpDashboardSelectors.selectWidgetQueries(state, widgetId);
  return {
    ...widget,
    currentQuery: queries.current,
    previousQuery: queries.previous,
    tabsQuery: queries.tabs,
    current: ocpReportsSelectors.selectReport(
      state,
      widget.reportType,
      queries.current
    ),
    previous: ocpReportsSelectors.selectReport(
      state,
      widget.reportType,
      queries.previous
    ),
    tabs: ocpReportsSelectors.selectReport(
      state,
      widget.reportType,
      queries.tabs
    ),
    status: ocpReportsSelectors.selectReportFetchStatus(
      state,
      widget.reportType,
      queries.current
    ),
  };
});

const mapDispatchToProps: OcpDashboardWidgetDispatchProps = {
  fetchReports: ocpDashboardActions.fetchWidgetReports,
  updateTab: ocpDashboardActions.changeWidgetTab,
};

const OcpDashboardWidget = translate()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(OcpDashboardWidgetBase)
);

export { OcpDashboardWidget, OcpDashboardWidgetBase, OcpDashboardWidgetProps };
