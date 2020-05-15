import {
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
} from '@patternfly/react-core';
import { CalculatorIcon } from '@patternfly/react-icons';
import {
  sortable,
  SortByDirection,
  Table,
  TableBody,
  TableHeader,
} from '@patternfly/react-table';
import { AzureQuery, getQuery } from 'api/queries/azureQuery';
import { tagKeyPrefix } from 'api/queries/query';
import { AzureReport } from 'api/reports/azureReports';
import { ReportPathsType } from 'api/reports/report';
import { EmptyFilterState } from 'components/state/emptyFilterState/emptyFilterState';
import { EmptyValueState } from 'components/state/emptyValueState/emptyValueState';
import { Actions } from 'pages/details/components/actions/actions';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { getIdKeyForGroupBy } from 'utils/computedReport/getComputedAzureReportItems';
import {
  ComputedReportItem,
  getUnsortedComputedReportItems,
} from 'utils/computedReport/getComputedReportItems';
import {
  getForDateRangeString,
  getNoDataForDateRangeString,
} from 'utils/dateRange';
import { formatCurrency } from 'utils/formatValue';
import {
  monthOverMonthOverride,
  styles,
  tableOverride,
} from './detailsTable.styles';
import { DetailsTableItem } from './detailsTableItem';

interface DetailsTableOwnProps {
  groupBy: string;
  onSelected(selectedItems: ComputedReportItem[]);
  onSort(value: string, isSortAscending: boolean);
  query: AzureQuery;
  report: AzureReport;
}

interface DetailsTableState {
  columns?: any[];
  rows?: any[];
}

type DetailsTableProps = DetailsTableOwnProps & WrappedComponentProps;

const reportPathsType = ReportPathsType.azure;

class DetailsTableBase extends React.Component<DetailsTableProps> {
  public state: DetailsTableState = {
    columns: [],
    rows: [],
  };

  constructor(props: DetailsTableProps) {
    super(props);
    this.handleOnCollapse = this.handleOnCollapse.bind(this);
    this.handleOnSelect = this.handleOnSelect.bind(this);
    this.handleOnSort = this.handleOnSort.bind(this);
  }

  public componentDidMount() {
    this.initDatum();
  }

  public componentDidUpdate(prevProps: DetailsTableProps) {
    const { query, report } = this.props;
    const currentReport =
      report && report.data ? JSON.stringify(report.data) : '';
    const previousReport =
      prevProps.report && prevProps.report.data
        ? JSON.stringify(prevProps.report.data)
        : '';

    if (
      getQuery(prevProps.query) !== getQuery(query) ||
      previousReport !== currentReport
    ) {
      this.initDatum();
    }
  }

  private initDatum = () => {
    const { query, report, intl } = this.props;
    if (!query || !report) {
      return;
    }

    const groupById = getIdKeyForGroupBy(query.group_by);
    const groupByTagKey = this.getGroupByTagKey();

    const total = formatCurrency(
      report &&
        report.meta &&
        report.meta.total &&
        report.meta.total.cost &&
        report.meta.total.cost.total
        ? report.meta.total.cost.total.value
        : 0
    );

    const columns = groupByTagKey
      ? [
          {
            title: intl.formatMessage({ id: 'ocp_details.tag_column_title' }),
          },
          {
            title: intl.formatMessage({
              id: 'azure_details.change_column_title',
            }),
          },
          {
            orderBy: 'cost',
            title: intl.formatMessage(
              { id: 'azure_details.cost_column_title' },
              { total }
            ),
            transforms: [sortable],
          },
          {
            title: '',
          },
        ]
      : [
          {
            orderBy: groupById,
            title: intl.formatMessage(
              { id: 'azure_details.name_column_title' },
              { groupBy: groupById }
            ),
            transforms: [sortable],
          },
          {
            title: intl.formatMessage({
              id: 'azure_details.change_column_title',
            }),
          },
          {
            orderBy: 'cost',
            title: intl.formatMessage({
              id: 'azure_details.cost_column_title',
            }),
            transforms: [sortable],
          },
          {
            title: '',
          },
        ];

    const rows = [];
    const computedItems = getUnsortedComputedReportItems({
      report,
      idKey: (groupByTagKey as any) || groupById,
    });

    computedItems.map((item, index) => {
      const label = item && item.label !== null ? item.label : '';
      const monthOverMonth = this.getMonthOverMonthCost(item, index);
      const cost = this.getTotalCost(item, index);
      const actions = this.getActions(item, index);

      rows.push(
        {
          cells: [
            { title: <div>{label}</div> },
            { title: <div>{monthOverMonth}</div> },
            { title: <div>{cost}</div> },
            { title: <div>{actions}</div> },
          ],
          isOpen: false,
          item,
          tableItem: {
            groupBy: groupByTagKey
              ? `${tagKeyPrefix}${groupByTagKey}`
              : groupById,
            index,
            item,
            query,
          },
        },
        {
          parent: index * 2,
          cells: [
            {
              title: (
                <div key={`${index * 2}-child`}>
                  {intl.formatMessage({ id: 'loading' })}
                </div>
              ),
            },
          ],
        }
      );
    });

    this.setState({
      columns,
      rows,
      sortBy: {},
    });
  };

  private getActions = (item: ComputedReportItem, index: number) => {
    const { groupBy, query } = this.props;
    const idKey = 'subscription_guid';

    return (
      <Actions
        groupBy={groupBy}
        idKey={idKey}
        isSummaryOptionDisabled={groupBy === idKey}
        isTagOptionDisabled={groupBy !== idKey}
        item={item}
        query={query}
        reportPathsType={reportPathsType}
      />
    );
  };

  private getEmptyState = () => {
    const { query, intl } = this.props;

    for (const val of Object.values(query.group_by)) {
      if (val !== '*') {
        return <EmptyFilterState showMargin={false} />;
      }
    }
    return (
      <EmptyState>
        <EmptyStateIcon icon={CalculatorIcon} />
        <EmptyStateBody>
          {intl.formatMessage({ id: 'ocp_cloud_details.empty_state' })}
        </EmptyStateBody>
      </EmptyState>
    );
  };

  private getGroupByTagKey = () => {
    const { query } = this.props;
    let groupByTagKey;

    for (const groupBy of Object.keys(query.group_by)) {
      const tagIndex = groupBy.indexOf(tagKeyPrefix);
      if (tagIndex !== -1) {
        groupByTagKey = groupBy.substring(
          tagIndex + tagKeyPrefix.length
        ) as any;
        break;
      }
    }
    return groupByTagKey;
  };

  private getMonthOverMonthCost = (item: ComputedReportItem, index: number) => {
    const { intl } = this.props;
    const value = formatCurrency(Math.abs(item.cost - item.deltaValue));
    const percentage =
      item.deltaPercent !== null ? Math.abs(item.deltaPercent).toFixed(2) : 0;

    const showPercentage = !(percentage === 0 || percentage === '0.00');
    const showValue = item.deltaPercent !== null; // Workaround for https://github.com/project-koku/koku/issues/1395

    let iconOverride;
    if (showPercentage) {
      iconOverride = 'iconOverride';
      if (item.deltaPercent !== null && item.deltaValue < 0) {
        iconOverride += ' decrease';
      }
      if (item.deltaPercent !== null && item.deltaValue > 0) {
        iconOverride += ' increase';
      }
    }

    if (!showValue) {
      return getNoDataForDateRangeString();
    } else {
      return (
        <div className={monthOverMonthOverride}>
          <div className={iconOverride} key={`month-over-month-cost-${index}`}>
            {Boolean(showPercentage) ? (
              intl.formatMessage({ id: 'percent' }, { value: percentage })
            ) : (
              <EmptyValueState />
            )}
            {Boolean(
              showPercentage &&
                item.deltaPercent !== null &&
                item.deltaValue > 0
            ) && (
              <span
                className="fa fa-sort-up"
                style={styles.infoArrow}
                key={`month-over-month-icon-${index}`}
              />
            )}
            {Boolean(
              showPercentage &&
                item.deltaPercent !== null &&
                item.deltaValue < 0
            ) && (
              <span
                className="fa fa-sort-down"
                style={{
                  ...styles.infoArrow,
                  ...styles.infoArrowDesc,
                }}
                key={`month-over-month-icon-${index}`}
              />
            )}
          </div>
          <div
            style={styles.infoDescription}
            key={`month-over-month-info-${index}`}
          >
            {getForDateRangeString(value)}
          </div>
        </div>
      );
    }
  };

  public getSortBy = () => {
    const { query } = this.props;
    const { columns } = this.state;
    const groupByTagKey = this.getGroupByTagKey();

    let index = -1;
    let direction: any = SortByDirection.asc;

    for (const key of Object.keys(query.order_by)) {
      let c = 0;
      for (const column of columns) {
        if (column.orderBy === key) {
          direction =
            query.order_by[key] === 'asc'
              ? SortByDirection.asc
              : SortByDirection.desc;
          index = c + (groupByTagKey ? 1 : 2);
          break;
        }
        c++;
      }
    }
    return index > -1 ? { index, direction } : {};
  };

  private getTableItem = (
    item: ComputedReportItem,
    groupBy: string,
    query: AzureQuery,
    index: number
  ) => {
    return (
      <DetailsTableItem
        groupBy={groupBy}
        item={item}
        key={`table-item-${index}`}
      />
    );
  };

  private getTotalCost = (item: ComputedReportItem, index: number) => {
    const { report, intl } = this.props;
    const cost =
      report &&
      report.meta &&
      report.meta.total &&
      report.meta.total.cost &&
      report.meta.total.cost.total
        ? report.meta.total.cost.total.value
        : 0;

    return (
      <>
        {formatCurrency(item.cost)}
        <div style={styles.infoDescription} key={`total-cost-${index}`}>
          {intl.formatMessage(
            { id: 'percent_of_cost' },
            {
              value: ((item.cost / cost) * 100).toFixed(2),
            }
          )}
        </div>
      </>
    );
  };

  private handleOnCollapse = (event, rowId, isOpen) => {
    const { intl } = this.props;
    const { rows } = this.state;
    const {
      tableItem: { item, groupBy, query, index },
    } = rows[rowId];

    if (isOpen) {
      rows[rowId + 1].cells = [
        { title: this.getTableItem(item, groupBy, query, index) },
      ];
    } else {
      rows[rowId + 1].cells = [
        {
          title: (
            <div key={`${index * 2}-child`}>
              {intl.formatMessage({ id: 'loading' })}
            </div>
          ),
        },
      ];
    }
    rows[rowId].isOpen = isOpen;

    this.setState({
      rows,
    });
  };

  private handleOnSelect = (event, isSelected, rowId) => {
    const { onSelected } = this.props;

    let rows;
    if (rowId === -1) {
      rows = this.state.rows.map(row => {
        row.selected = isSelected;
        return row;
      });
    } else {
      rows = [...this.state.rows];
      rows[rowId].selected = isSelected;
    }

    if (onSelected) {
      const selectedItems = [];
      for (const row of rows) {
        if (row.selected && row.item && !row.parent) {
          selectedItems.push(row.item);
        }
      }
      onSelected(selectedItems);
    }
    this.setState({ rows });
  };

  private handleOnSort = (event, index, direction) => {
    const { onSort } = this.props;
    const { columns } = this.state;

    if (onSort) {
      const orderBy = columns[index - 2].orderBy;
      const isSortAscending = direction === SortByDirection.asc;
      onSort(orderBy, isSortAscending);
    }
  };

  public render() {
    const { columns, rows } = this.state;

    return (
      <>
        <Table
          aria-label="details-table"
          cells={columns}
          className={tableOverride}
          onCollapse={this.handleOnCollapse}
          rows={rows}
          sortBy={this.getSortBy()}
          onSelect={this.handleOnSelect}
          onSort={this.handleOnSort}
          gridBreakPoint="grid-2xl"
        >
          <TableHeader />
          <TableBody />
        </Table>
        {Boolean(rows.length === 0) && (
          <div style={styles.emptyState}>{this.getEmptyState()}</div>
        )}
      </>
    );
  }
}

const DetailsTable = injectIntl(connect()(DetailsTableBase));

export { DetailsTable, DetailsTableProps };
