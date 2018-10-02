import { Title } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import { getQuery, parseQuery, Query } from 'api/query';
import { Report, ReportType } from 'api/reports';
import { ListView } from 'patternfly-react';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { reportsActions, reportsSelectors } from 'store/reports';
import { formatCurrency } from 'utils/formatValue';
import {
  getComputedReportItems,
  GetComputedReportItemsParams,
  getIdKeyForGroupBy,
} from 'utils/getComputedReportItems';
import {
  listViewOverride,
  styles,
  toolbarOverride,
} from './costDetails.styles';
import { DetailsItem } from './detailItem';
import { DetailsToolbar } from './detailsToolbar';

interface StateProps {
  report: Report;
  reportFetchStatus: FetchStatus;
  queryString: string;
  query: Query;
}

interface DispatchProps {
  fetchReport: typeof reportsActions.fetchReport;
}

type OwnProps = RouteComponentProps<void> & InjectedTranslateProps;

type Props = StateProps & OwnProps & DispatchProps;

const reportType = ReportType.cost;

const baseQuery: Query = {
  filter: {
    time_scope_units: 'month',
    time_scope_value: -1,
    resolution: 'monthly',
  },
  group_by: {
    account: '*',
  },
  order_by: {
    account: 'asc',
  },
};

const groupByOptions: {
  label: string;
  value: GetComputedReportItemsParams['idKey'];
}[] = [
  { label: 'account', value: 'account' },
  { label: 'service', value: 'service' },
  { label: 'region', value: 'region' },
];

class CostDetails extends React.Component<Props> {
  constructor(stateProps, dispatchProps) {
    super(stateProps, dispatchProps);
    this.onFilterAdded = this.onFilterAdded.bind(this);
    this.onFilterRemoved = this.onFilterRemoved.bind(this);
    this.onSortChanged = this.onSortChanged.bind(this);
  }

  public componentDidMount() {
    this.updateReport();
    this.setState({});
  }

  public componentDidUpdate(prevProps: Props) {
    const { location, report, queryString } = this.props;
    if (prevProps.queryString !== queryString || !report || !location.search) {
      this.updateReport();
    }
  }

  public handleSelectChange = (event: React.FormEvent<HTMLSelectElement>) => {
    const { history } = this.props;
    const groupByKey: keyof Query['group_by'] = event.currentTarget
      .value as any;
    const newQuery: Query = {
      group_by: {
        [groupByKey]: '*',
      },
      order_by: { [groupByKey]: 'asc' },
    };
    history.replace(this.getRouteForQuery(newQuery));
  };

  private getRouteForQuery(query: Query) {
    return `/cost?${getQuery(query)}`;
  }

  public onFilterAdded(filterType: string, filterValue: string) {
    const { history, query } = this.props;
    if (query.group_by[filterType]) {
      if (query.group_by[filterType] === '*') {
        query.group_by[filterType] = filterValue;
      } else if (!query.group_by[filterType].includes(filterValue)) {
        query.group_by[filterType] = [query.group_by[filterType], filterValue];
      }
    } else {
      query.group_by[filterType] = [filterValue];
    }
    const filteredQuery = this.getRouteForQuery(query);
    history.replace(filteredQuery);
  }

  public onFilterRemoved(filterType: string, filterValue: string) {
    const { history, query } = this.props;
    if (filterValue === '' || !Array.isArray(query.group_by[filterType])) {
      query.group_by[filterType] = '*';
    } else {
      const index = query.group_by[filterType].indexOf(filterValue);
      if (index > -1) {
        const updated = [
          ...query.group_by[filterType].slice(0, index),
          ...query.group_by[filterType].slice(index + 1),
        ];
        query.group_by[filterType] = updated;
      }
    }
    const filteredQuery = this.getRouteForQuery(query);
    history.replace(filteredQuery);
  }

  public onSortChanged(sortType: string, isSortAscending: boolean) {
    const { history, query } = this.props;
    query.order_by = {};
    query.order_by[sortType] = isSortAscending ? 'asc' : 'desc';
    const filteredQuery = this.getRouteForQuery(query);
    history.replace(filteredQuery);
  }

  public updateReport = () => {
    const { query, location, fetchReport, history, queryString } = this.props;
    const groupById = getIdKeyForGroupBy(query.group_by);
    if (!location.search) {
      history.replace(
        this.getRouteForQuery({
          group_by: query.group_by,
          order_by: { [groupById]: 'asc' },
        })
      );
    } else {
      fetchReport(reportType, queryString);
    }
  };

  public render() {
    const { report, query, t } = this.props;
    const groupById = getIdKeyForGroupBy(query.group_by);
    const today = new Date();
    const computedItems = getComputedReportItems({
      report,
      idKey: groupById,
    });

    let filterFields;
    let sortFields;
    if (groupById === 'account') {
      filterFields = [
        {
          id: 'account',
          title: t('cost_details.filter.account_select'),
          placeholder: t('cost_details.filter.account_placeholder'),
          filterType: 'text',
        },
        {
          id: 'account2',
          title: t('cost_details.filter.account_select'),
          placeholder: t('cost_details.filter.account_placeholder'),
          filterType: 'text',
        },
      ];
      sortFields = [
        {
          id: 'account',
          isNumeric: false,
          title: t('cost_details.order.name'),
        },
        {
          id: 'total',
          isNumeric: true,
          title: t('cost_details.order.cost'),
        },
      ];
    } else if (groupById === 'service') {
      filterFields = [
        {
          id: 'service',
          title: t('cost_details.filter.service_select'),
          placeholder: t('cost_details.filter.service_placeholder'),
          filterType: 'text',
        },
        {
          id: 'service2',
          title: t('cost_details.filter.service_select'),
          placeholder: t('cost_details.filter.service_placeholder'),
          filterType: 'text',
        },
      ];
      sortFields = [
        {
          id: 'service',
          isNumeric: false,
          title: t('cost_details.order.name'),
        },
        {
          id: 'total',
          isNumeric: true,
          title: t('cost_details.order.cost'),
        },
      ];
    } else if (groupById === 'region') {
      filterFields = [
        {
          id: 'region',
          title: t('cost_details.filter.region_select'),
          placeholder: t('cost_details.filter.region_placeholder'),
          filterType: 'text',
        },
        {
          id: 'region2',
          title: t('cost_details.filter.region_select'),
          placeholder: t('cost_details.filter.region_placeholder'),
          filterType: 'text',
        },
      ];
      sortFields = [
        {
          id: 'region',
          isNumeric: false,
          title: t('cost_details.order.name'),
        },
        {
          id: 'total',
          isNumeric: true,
          title: t('cost_details.order.cost'),
        },
      ];
    }

    let sortField = sortFields[0];
    for (const field of sortFields) {
      if (query.order_by && query.order_by[field.id]) {
        sortField = field;
        break;
      }
    }

    const exportText = t('cost_details.export_link');

    return (
      <div className={css(styles.costDetailsPage)}>
        <header className={css(styles.header)}>
          <div>
            <Title size="2xl">{t('cost_details.title')}</Title>
            <div className={css(styles.groupBySelector)}>
              <label className={css(styles.groupBySelectorLabel)}>
                {t('group_by.label')}:
              </label>
              <select value={groupById} onChange={this.handleSelectChange}>
                {groupByOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {t(`group_by.values.${option.label}`)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {Boolean(report) && (
            <div className={css(styles.total)}>
              <Title className={css(styles.totalValue)} size="4xl">
                {formatCurrency(report.total.value)}
              </Title>
              <div className={css(styles.totalLabel)}>
                <div className={css(styles.totalLabelUnit)}>
                  {t('total_cost')}
                </div>
                <div className={css(styles.totalLabelDate)}>
                  {t('since_date', { month: today.getMonth(), date: 1 })}
                </div>
              </div>
            </div>
          )}
        </header>
        <div className={css(styles.content)}>
          <div className={css(styles.toolbarContainer)}>
            <div className={toolbarOverride}>
              <DetailsToolbar
                exportText={exportText}
                filterFields={filterFields}
                onFilterAdded={this.onFilterAdded}
                onFilterRemoved={this.onFilterRemoved}
                onSortChanged={this.onSortChanged}
                sortField={sortField}
                sortFields={sortFields}
                report={report}
                resultsTotal={computedItems.length}
                query={query}
              />
            </div>
          </div>
          <div className={listViewOverride}>
            <ListView>
              <ListView.Item
                key="header_item"
                heading={t('cost_details.name_column_title', {
                  groupBy: groupById,
                })}
                checkboxInput={<input type="checkbox" />}
                additionalInfo={[
                  <ListView.InfoItem key="1">
                    <strong>Month Over Month Change</strong>
                    {Boolean(report) && (
                      <span>
                        {t('cost_details.cost_column_subtitle', {
                          total: formatCurrency(report.total.value),
                        })}
                      </span>
                    )}
                  </ListView.InfoItem>,
                ]}
                actions={[
                  <ListView.InfoItem key="1">
                    <strong>{t('cost_details.cost_column_title')}</strong>
                    {Boolean(report) && (
                      <span>
                        {t('cost_details.cost_column_subtitle', {
                          total: formatCurrency(report.total.value),
                        })}
                      </span>
                    )}
                  </ListView.InfoItem>,
                ]}
              />
              {computedItems.map((groupItem, index) => {
                return (
                  <DetailsItem
                    key={index}
                    parentQuery={query}
                    parentGroupBy={groupById}
                    item={groupItem}
                    total={report.total.value}
                  />
                );
              })}
            </ListView>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = createMapStateToProps<OwnProps, StateProps>(
  (state, props) => {
    const queryFromRoute = parseQuery<Query>(props.location.search);
    const query = {
      filter: {
        ...baseQuery.filter,
        ...queryFromRoute.filter,
      },
      group_by: queryFromRoute.group_by || baseQuery.group_by,
      order_by: queryFromRoute.order_by || baseQuery.order_by,
    };
    // Todo: This tempQuery is a temporary workaround until the API supports sorting properly
    // Otherwise, including order_by will generate a bad request.
    // See: https://github.com/project-koku/koku/issues/375
    const tempQuery = {
      filter: {
        ...baseQuery.filter,
        ...queryFromRoute.filter,
      },
      group_by: queryFromRoute.group_by || baseQuery.group_by,
    };
    const queryString = getQuery(tempQuery);
    const report = reportsSelectors.selectReport(
      state,
      ReportType.cost,
      queryString
    );
    const reportFetchStatus = reportsSelectors.selectReportFetchStatus(
      state,
      ReportType.cost,
      queryString
    );
    return {
      report,
      reportFetchStatus,
      queryString,
      query,
    };
  }
);

const mapDispatchToProps: DispatchProps = {
  fetchReport: reportsActions.fetchReport,
};

export default translate()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CostDetails)
);
