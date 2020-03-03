import { Pagination, PaginationVariant } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import {
  AzureQuery,
  getQuery,
  getQueryRoute,
  parseQuery,
} from 'api/azureQuery';
import { AzureReport, AzureReportType } from 'api/azureReports';
import { Providers, ProviderType } from 'api/providers';
import { getProvidersQuery } from 'api/providersQuery';
import { tagKeyPrefix } from 'api/query';
import { AxiosError } from 'axios';
import { ErrorState } from 'components/state/errorState/errorState';
import { LoadingState } from 'components/state/loadingState/loadingState';
import { NoProvidersState } from 'components/state/noProvidersState/noProvidersState';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { azureReportsActions, azureReportsSelectors } from 'store/azureReports';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { azureProvidersQuery, providersSelectors } from 'store/providers';
import {
  ComputedAzureReportItem,
  getIdKeyForGroupBy,
  getUnsortedComputedAzureReportItems,
} from 'utils/computedReport/getComputedAzureReportItems';
import { styles } from './azureDetails.styles';
import { DetailsHeader } from './detailsHeader';
import { DetailsTable } from './detailsTable';
import { DetailsToolbar } from './detailsToolbar';
import { ExportModal } from './exportModal';

interface AzureDetailsStateProps {
  providers: Providers;
  providersError: AxiosError;
  providersFetchStatus: FetchStatus;
  query: AzureQuery;
  queryString: string;
  report: AzureReport;
  reportError: AxiosError;
  reportFetchStatus: FetchStatus;
}

interface AzureDetailsDispatchProps {
  fetchReport: typeof azureReportsActions.fetchReport;
}

interface AzureDetailsState {
  columns: any[];
  isExportModalOpen: boolean;
  rows: any[];
  selectedItems: ComputedAzureReportItem[];
}

type AzureDetailsOwnProps = RouteComponentProps<void> & InjectedTranslateProps;

type AzureDetailsProps = AzureDetailsStateProps &
  AzureDetailsOwnProps &
  AzureDetailsDispatchProps;

const reportType = AzureReportType.cost;

const baseQuery: AzureQuery = {
  delta: 'cost',
  filter: {
    limit: 10,
    offset: 0,
    resolution: 'monthly',
    time_scope_units: 'month',
    time_scope_value: -1,
  },
  filter_by: {},
  group_by: {
    subscription_guid: '*',
  },
  order_by: {
    cost: 'desc',
  },
};

class AzureDetails extends React.Component<AzureDetailsProps> {
  protected defaultState: AzureDetailsState = {
    columns: [],
    isExportModalOpen: false,
    rows: [],
    selectedItems: [],
  };
  public state: AzureDetailsState = { ...this.defaultState };

  constructor(stateProps, dispatchProps) {
    super(stateProps, dispatchProps);
    this.handleExportModalClose = this.handleExportModalClose.bind(this);
    this.handleExportModalOpen = this.handleExportModalOpen.bind(this);
    this.handleFilterAdded = this.handleFilterAdded.bind(this);
    this.handleFilterRemoved = this.handleFilterRemoved.bind(this);
    this.handlePerPageSelect = this.handlePerPageSelect.bind(this);
    this.handleSelected = this.handleSelected.bind(this);
    this.handleSetPage = this.handleSetPage.bind(this);
    this.handleSort = this.handleSort.bind(this);
  }

  public componentDidMount() {
    this.updateReport();
  }

  public componentDidUpdate(
    prevProps: AzureDetailsProps,
    prevState: AzureDetailsState
  ) {
    const { location, report, reportError, queryString } = this.props;
    const { selectedItems } = this.state;

    const newQuery = prevProps.queryString !== queryString;
    const noReport = !report && !reportError;
    const noLocation = !location.search;
    const newItems = prevState.selectedItems !== selectedItems;

    if (newQuery || noReport || noLocation || newItems) {
      this.updateReport();
    }
  }

  private getExportModal = (computedItems: ComputedAzureReportItem[]) => {
    const { isExportModalOpen, selectedItems } = this.state;
    const { query } = this.props;

    const groupById = getIdKeyForGroupBy(query.group_by);
    const groupByTagKey = this.getGroupByTagKey();

    return (
      <ExportModal
        isAllItems={selectedItems.length === computedItems.length}
        groupBy={groupByTagKey ? `${tagKeyPrefix}${groupByTagKey}` : groupById}
        isOpen={isExportModalOpen}
        items={selectedItems}
        onClose={this.handleExportModalClose}
        query={query}
      />
    );
  };

  private getGroupByTagKey = () => {
    const { query } = this.props;
    let groupByTag;

    for (const groupBy of Object.keys(query.group_by)) {
      const tagIndex = groupBy.indexOf(tagKeyPrefix);
      if (tagIndex !== -1) {
        groupByTag = groupBy.substring(tagIndex + tagKeyPrefix.length) as any;
        break;
      }
    }
    return groupByTag;
  };

  private getPagination = (isBottom: boolean = false) => {
    const { report } = this.props;

    const count = report && report.meta ? report.meta.count : 0;
    const limit =
      report && report.meta && report.meta.filter && report.meta.filter.limit
        ? report.meta.filter.limit
        : baseQuery.filter.limit;
    const offset =
      report && report.meta && report.meta.filter && report.meta.filter.offset
        ? report.meta.filter.offset
        : baseQuery.filter.offset;
    const page = offset / limit + 1;

    return (
      <Pagination
        isCompact
        itemCount={count}
        onPerPageSelect={this.handlePerPageSelect}
        onSetPage={this.handleSetPage}
        page={page}
        perPage={limit}
        variant={isBottom ? PaginationVariant.bottom : PaginationVariant.top}
        widgetId="`pagination${isBottom ? '-bottom' : ''}`"
      />
    );
  };

  private getRouteForQuery(query: AzureQuery, reset: boolean = false) {
    // Reset pagination
    if (reset) {
      query.filter = {
        ...query.filter,
        offset: baseQuery.filter.offset,
      };
    }
    return `/azure?${getQueryRoute(query)}`;
  }

  private getTable = () => {
    const { query, report } = this.props;

    const groupById = getIdKeyForGroupBy(query.group_by);
    const groupByTagKey = this.getGroupByTagKey();

    return (
      <DetailsTable
        groupBy={groupByTagKey ? `${tagKeyPrefix}${groupByTagKey}` : groupById}
        onSelected={this.handleSelected}
        onSort={this.handleSort}
        query={query}
        report={report}
      />
    );
  };

  private getToolbar = () => {
    const { selectedItems } = this.state;
    const { query, report } = this.props;

    const groupById = getIdKeyForGroupBy(query.group_by);
    const groupByTagKey = this.getGroupByTagKey();

    return (
      <DetailsToolbar
        groupBy={groupByTagKey ? `${tagKeyPrefix}${groupByTagKey}` : groupById}
        isExportDisabled={selectedItems.length === 0}
        onExportClicked={this.handleExportModalOpen}
        onFilterAdded={this.handleFilterAdded}
        onFilterRemoved={this.handleFilterRemoved}
        pagination={this.getPagination()}
        query={query}
        report={report}
      />
    );
  };

  public handleExportModalClose = (isOpen: boolean) => {
    this.setState({ isExportModalOpen: isOpen });
  };

  public handleExportModalOpen = () => {
    this.setState({ isExportModalOpen: true });
  };

  private handleFilterAdded = (filterType: string, filterValue: string) => {
    const { history, query } = this.props;
    const newQuery = { ...JSON.parse(JSON.stringify(query)) };

    const groupByTagKey = this.getGroupByTagKey();
    const newFilterType =
      filterType === 'tag' ? `${tagKeyPrefix}${groupByTagKey}` : filterType;

    // Filter by * won't generate a new request if group_by * already exists
    if (filterValue === '*' && newQuery.group_by[newFilterType] === '*') {
      return;
    }

    if (newQuery.filter_by[newFilterType]) {
      let found = false;
      const filters = newQuery.filter_by[newFilterType];
      if (!Array.isArray(filters)) {
        found = filterValue === newQuery.filter_by[newFilterType];
      } else {
        for (const filter of filters) {
          if (filter === filterValue) {
            found = true;
            break;
          }
        }
      }
      if (!found) {
        newQuery.filter_by[newFilterType] = [
          newQuery.filter_by[newFilterType],
          filterValue,
        ];
      }
    } else {
      newQuery.filter_by[filterType] = [filterValue];
    }
    const filteredQuery = this.getRouteForQuery(newQuery, true);
    history.replace(filteredQuery);
  };

  private handleFilterRemoved = (filterType: string, filterValue: string) => {
    const { history, query } = this.props;
    const newQuery = { ...JSON.parse(JSON.stringify(query)) };

    const groupByTagKey = this.getGroupByTagKey();
    const newFilterType =
      filterType === 'tag' ? `${tagKeyPrefix}${groupByTagKey}` : filterType;

    if (filterValue === '') {
      newQuery.filter_by = undefined; // Clear all
    } else if (!Array.isArray(newQuery.filter_by[newFilterType])) {
      newQuery.filter_by[newFilterType] = undefined;
    } else {
      const index = newQuery.filter_by[newFilterType].indexOf(filterValue);
      if (index > -1) {
        newQuery.filter_by[newFilterType] = [
          ...query.filter_by[newFilterType].slice(0, index),
          ...query.filter_by[newFilterType].slice(index + 1),
        ];
      }
    }
    const filteredQuery = this.getRouteForQuery(newQuery, true);
    history.replace(filteredQuery);
  };

  private handleGroupByClick = groupBy => {
    const { history, query } = this.props;
    const groupByKey: keyof AzureQuery['group_by'] = groupBy as any;
    const newQuery = {
      ...JSON.parse(JSON.stringify(query)),
      filter_by: undefined,
      group_by: {
        [groupByKey]: '*',
      },
      order_by: { cost: 'desc' },
    };
    history.replace(this.getRouteForQuery(newQuery, true));
    this.setState({ selectedItems: [] });
  };

  private handlePerPageSelect = (_event, perPage) => {
    const { history, query } = this.props;
    const newQuery = { ...JSON.parse(JSON.stringify(query)) };
    newQuery.filter = {
      ...query.filter,
      limit: perPage,
    };
    const filteredQuery = this.getRouteForQuery(newQuery, true);
    history.replace(filteredQuery);
  };

  private handleSelected = (selectedItems: ComputedAzureReportItem[]) => {
    this.setState({ selectedItems });
  };

  private handleSetPage = (event, pageNumber) => {
    const { history, query, report } = this.props;

    const limit =
      report && report.meta && report.meta.filter && report.meta.filter.limit
        ? report.meta.filter.limit
        : baseQuery.filter.limit;
    const offset = pageNumber * limit - limit;

    const newQuery = { ...JSON.parse(JSON.stringify(query)) };
    newQuery.filter = {
      ...query.filter,
      offset,
    };
    const filteredQuery = this.getRouteForQuery(newQuery);
    history.replace(filteredQuery);
  };

  private handleSort = (sortType: string, isSortAscending: boolean) => {
    const { history, query } = this.props;
    const newQuery = { ...JSON.parse(JSON.stringify(query)) };
    newQuery.order_by = {};
    newQuery.order_by[sortType] = isSortAscending ? 'asc' : 'desc';
    const filteredQuery = this.getRouteForQuery(newQuery);
    history.replace(filteredQuery);
  };

  private updateReport = () => {
    const { query, location, fetchReport, history, queryString } = this.props;
    if (!location.search) {
      history.replace(
        this.getRouteForQuery({
          filter_by: query.filter_by,
          group_by: query.group_by,
          order_by: { cost: 'desc' },
        })
      );
    } else {
      fetchReport(reportType, queryString);
    }
  };

  public render() {
    const { reportFetchStatus, query, report, reportError } = this.props;

    const groupById = getIdKeyForGroupBy(query.group_by);
    const groupByTag = this.getGroupByTagKey();

    const computedItems = getUnsortedComputedAzureReportItems({
      report,
      idKey: (groupByTag as any) || groupById,
    });

    const error = reportError;
    const isLoading = reportFetchStatus === FetchStatus.inProgress;
    const noReports =
      report !== undefined &&
      report.meta !== undefined &&
      report.meta.count === 0 &&
      reportFetchStatus === FetchStatus.complete;

    return (
      <div className={css(styles.azureDetails)}>
        <DetailsHeader
          groupBy={groupById}
          onGroupByClicked={this.handleGroupByClick}
        />
        {Boolean(error) ? (
          <ErrorState error={error} />
        ) : Boolean(noReports) ? (
          <NoProvidersState />
        ) : Boolean(isLoading) ? (
          <LoadingState />
        ) : (
          <div className={css(styles.content)}>
            {this.getToolbar()}
            {this.getExportModal(computedItems)}
            <div className={css(styles.tableContainer)}>{this.getTable()}</div>
            <div className={css(styles.paginationContainer)}>
              <div className={css(styles.pagination)}>
                {this.getPagination(true)}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = createMapStateToProps<
  AzureDetailsOwnProps,
  AzureDetailsStateProps
>((state, props) => {
  const queryFromRoute = parseQuery<AzureQuery>(location.search);
  const query = {
    delta: 'cost',
    filter: {
      ...baseQuery.filter,
      ...queryFromRoute.filter,
    },
    filter_by: queryFromRoute.filter_by || baseQuery.filter_by,
    group_by: queryFromRoute.group_by || baseQuery.group_by,
    order_by: queryFromRoute.order_by || baseQuery.order_by,
  };
  const queryString = getQuery(query);
  const report = azureReportsSelectors.selectReport(
    state,
    reportType,
    queryString
  );
  const reportError = azureReportsSelectors.selectReportError(
    state,
    reportType,
    queryString
  );
  const reportFetchStatus = azureReportsSelectors.selectReportFetchStatus(
    state,
    reportType,
    queryString
  );

  const providersQueryString = getProvidersQuery(azureProvidersQuery);
  const providers = providersSelectors.selectProviders(
    state,
    ProviderType.azure,
    providersQueryString
  );
  const providersError = providersSelectors.selectProvidersError(
    state,
    ProviderType.azure,
    providersQueryString
  );
  const providersFetchStatus = providersSelectors.selectProvidersFetchStatus(
    state,
    ProviderType.azure,
    providersQueryString
  );

  return {
    providers,
    providersError,
    providersFetchStatus,
    query,
    queryString,
    report,
    reportError,
    reportFetchStatus,

    // Testing...
    //
    // providers: {
    //   meta: {
    //     count: 0,
    //   },
    // } as any,
    // providersError: {
    //   response: {
    //     // status: 401
    //     status: 500
    //   }
    // } as any,
    // providersFetchStatus: FetchStatus.inProgress,
  };
});

const mapDispatchToProps: AzureDetailsDispatchProps = {
  fetchReport: azureReportsActions.fetchReport,
};

export default translate()(
  connect(mapStateToProps, mapDispatchToProps)(AzureDetails)
);
