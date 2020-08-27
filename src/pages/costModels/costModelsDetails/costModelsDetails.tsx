import { CostModel } from 'api/costModels';
import { AxiosError } from 'axios';
import { EmptyFilterState } from 'components/state/emptyFilterState/emptyFilterState';
import { ErrorState } from 'components/state/errorState/errorState';
import { LoadingState } from 'components/state/loadingState/loadingState';
import { CostModelWizard } from 'pages/costModels/createCostModelWizard';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { FetchStatus } from 'store/common';
import { costModelsActions } from 'store/costModels';
import { metricsActions } from 'store/metrics';
import { rbacActions } from 'store/rbac';
import { CostModelDetailsToolbar } from './components/costModelsDetailsToolbar';
import { styles } from './costModelsDetails.styles';
import CostModelsPagination from './costModelsPagination';
import CostModelsTable from './costModelsTable';
import EmptyState from './emptyState';
import Header from './header';

interface Props extends InjectedTranslateProps {
  costModels: CostModel[];
  error: AxiosError;
  status: FetchStatus;
  updateFilter: typeof costModelsActions.updateFilterToolbar;
  fetch: typeof costModelsActions.fetchCostModels;
  setDialogOpen: typeof costModelsActions.setCostModelDialog;
  pagination: any;
  query: {
    ordering?: string;
    name?: string;
    source_type?: string;
    description?: string;
    offset?: string;
    limit?: string;
  };
  currentFilterType: string;
  currentFilterValue: string;
  fetchMetrics: typeof metricsActions.fetchMetrics;
  isWritePermission: boolean;
  fetchRbac: typeof rbacActions.fetchRbac;
}

interface State {
  isWizardOpen: boolean;
  uuid: string;
}

class CostModelsDetails extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = { isWizardOpen: false, uuid: '' };
    this.onPaginationChange = this.onPaginationChange.bind(this);
    this.onOrdering = this.onOrdering.bind(this);
    this.onFilterChange = this.onFilterChange.bind(this);
    this.onUpdateFilter = this.onUpdateFilter.bind(this);
    this.onRemove = this.onRemove.bind(this);
    this.resetFilter = this.resetFilter.bind(this);
  }

  public componentDidMount() {
    this.props.fetch();
    this.props.fetchMetrics('OCP');
    this.props.fetchRbac();
  }

  public onRemove(name: string, value: string) {
    const filters = this.props.query[name];
    if (!filters) {
      return;
    }
    const filtersArray = filters.split(',');
    const index = filtersArray.indexOf(value);
    if (index < -1) {
      return;
    }
    const newFiltersArray = [
      ...filtersArray.slice(0, index),
      ...filtersArray.slice(index + 1),
    ].join(',');
    this.updateResults({
      ...this.props.query,
      [name]: newFiltersArray,
    });
  }

  public onUpdateFilter(selected: string) {
    let key = null;
    if (selected === 'type') {
      key = 'currentFilterType';
    }
    if (selected === 'value') {
      key = 'currentFilterValue';
    }
    return (value: string) => {
      if (key === null) {
        return;
      }
      this.props.updateFilter({ [key]: value });
    };
  }

  private updateResults(newQuery) {
    const res = Object.keys(newQuery)
      .filter((k) => newQuery[k])
      .reduce((acc, curr) => {
        const currQuery = `${curr}=${newQuery[curr]}`;
        return acc === null ? currQuery : `${acc}&${currQuery}`;
      }, null);
    this.props.fetch(res);
  }

  public onPaginationChange(searchQuery) {
    const newQuery = { ...this.props.query, ...searchQuery };
    this.updateResults(newQuery);
  }

  public onOrdering(orderingQuery) {
    this.updateResults({
      ...this.props.query,
      ...orderingQuery,
    });
  }

  public onFilterChange(searchQuery) {
    const { limit, offset, ordering } = this.props.query;
    this.updateResults({ limit, offset, ordering, ...searchQuery });
  }

  public resetFilter() {
    this.updateResults({});
  }

  public render() {
    const {
      isWritePermission,
      setDialogOpen,
      costModels,
      pagination,
      status,
      error,
      t,
      query,
    } = this.props;
    const columns = [
      t('cost_models_details.table.columns.name'),
      t('cost_models_details.table.columns.desc'),
      t('cost_models_details.table.columns.source_type'),
      t('cost_models_details.table.columns.sources'),
      t('cost_models_details.table.columns.last_modified'),
      '',
    ];
    const filterValue = Object.keys(query)
      .filter((k) => ['name', 'type', 'description'].includes(k))
      .find((k) => this.props.query[k]);

    return (
      <>
        <CostModelWizard
          isOpen={this.state.isWizardOpen}
          closeWizard={() => this.setState({ isWizardOpen: false })}
          openWizard={() => this.setState({ isWizardOpen: true })}
        />
        <div>
          <Header t={t} />
          <div style={styles.content}>
            {status !== FetchStatus.none &&
              error === null &&
              (costModels.length > 0 || filterValue) && (
                <div style={styles.toolbarContainer}>
                  <CostModelDetailsToolbar
                    buttonProps={{
                      isDisabled: !isWritePermission,
                      onClick: () => this.setState({ isWizardOpen: true }),
                      children: t('cost_models_details.filter.create_button'),
                    }}
                    query={Object.keys(query).reduce((acc, cur) => {
                      if (
                        !['source_type', 'name', 'description'].includes(cur)
                      ) {
                        return acc;
                      }
                      if (!query[cur]) {
                        return acc;
                      }
                      if (['name', 'description'].includes(cur)) {
                        return { ...acc, [cur]: query[cur].split(',') };
                      }
                      return { ...acc, [cur]: query[cur] };
                    }, {})}
                    onSearch={(newQuery) => this.onFilterChange(newQuery)}
                    paginationProps={{
                      isCompact: true,
                      itemCount: pagination.count,
                      onPerPageSelect: (_event, perPage: number) => {
                        this.onPaginationChange({
                          offset: '0',
                          limit: perPage.toString(),
                        });
                      },
                      onSetPage: (_event, pageNumber) => {
                        const offset = (pageNumber - 1) * pagination.perPage;
                        this.onPaginationChange({
                          offset: offset.toString(),
                          limit: pagination.perPage.toString(),
                        });
                      },
                      page: pagination.page,
                      perPage: pagination.perPage,
                    }}
                  />
                </div>
              )}
            {status !== FetchStatus.complete && <LoadingState />}
            {status === FetchStatus.complete && Boolean(error) && (
              <ErrorState error={error} />
            )}
            {status === FetchStatus.complete &&
              !error &&
              costModels.length > 0 && (
                <React.Fragment>
                  <CostModelsTable
                    isWritePermissions={isWritePermission}
                    sortBy={this.props.query.ordering}
                    onOrdering={this.onOrdering}
                    columns={columns}
                    rows={costModels}
                    showDeleteDialog={() => {
                      setDialogOpen({ isOpen: true, name: 'deleteCostModel' });
                    }}
                  />
                  <div style={styles.paginationContainer}>
                    <CostModelsPagination
                      status={status}
                      fetch={this.onPaginationChange}
                      pagination={pagination}
                    />
                  </div>
                </React.Fragment>
              )}
            {status === FetchStatus.complete &&
              !error &&
              filterValue === undefined &&
              costModels.length === 0 && (
                <EmptyState
                  openModal={() => this.setState({ isWizardOpen: true })}
                />
              )}
            {status === FetchStatus.complete &&
              filterValue &&
              costModels.length === 0 && (
                <EmptyFilterState
                  filter={this.props.query.name}
                  subTitle={t('no_match_found_state.desc')}
                />
              )}
          </div>
        </div>
      </>
    );
  }
}

export default translate()(CostModelsDetails);
