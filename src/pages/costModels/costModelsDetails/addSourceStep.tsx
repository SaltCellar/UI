import {
  DataToolbar,
  DataToolbarContent,
  DataToolbarGroup,
  DataToolbarItem,
  Pagination,
} from '@patternfly/react-core';
import { Table, TableBody, TableHeader } from '@patternfly/react-table';
import { CostModel } from 'api/costModels';
import { Provider } from 'api/providers';
import { EmptyFilterState } from 'components/state/emptyFilterState/emptyFilterState';
import { ErrorState } from 'components/state/errorState/errorState';
import { LoadingState } from 'components/state/loadingState/loadingState';
import {
  addMultiValueQuery,
  removeMultiValueQuery,
} from 'pages/costModels/components/filterLogic';
import { WarningIcon } from 'pages/costModels/components/warningIcon';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { sourcesActions, sourcesSelectors } from 'store/sourceSettings';
import { AssignSourcesToolbar } from './assignSourcesModalToolbar';

interface AddSourcesStepProps extends WrappedComponentProps {
  providers: Provider[];
  isLoadingSources: boolean;
  fetchingSourcesError: string;
  query: { name: string; type: string; offset: string; limit: string };
  pagination: { page: number; perPage: number; count: number };
  updateFilter: typeof sourcesActions.updateFilterToolbar;
  currentFilter: {
    name: string;
    value: string;
  };
  setState: (newState: {
    [uuid: string]: { selected: boolean; meta: Provider };
  }) => void;
  checked: { [uuid: string]: { selected: boolean; meta: Provider } };
  costModel: CostModel;
  fetch: typeof sourcesActions.fetchSources;
}

class AddSourcesStep extends React.Component<AddSourcesStepProps> {
  public render() {
    const { costModel } = this.props;
    if (this.props.isLoadingSources) {
      return <LoadingState />;
    }
    if (this.props.fetchingSourcesError) {
      return <ErrorState error={null} />;
    }
    const sources = this.props.providers.map(providerData => {
      const isSelected = this.props.checked[providerData.uuid]
        ? this.props.checked[providerData.uuid].selected
        : false;
      const provCostModels =
        providerData.cost_models === undefined
          ? this.props.intl.formatMessage({
              id: 'cost_models_wizard.source_table.default_cost_model',
            })
          : providerData.cost_models.map(cm => cm.name).join(',');
      const warningIcon =
        isSelected &&
        providerData.cost_models.length &&
        providerData.cost_models.find(cm => cm.name === costModel.name) ===
          undefined ? (
          <WarningIcon
            key={providerData.uuid}
            text={this.props.intl.formatMessage(
              { id: 'cost_models_wizard.warning_override_source' },
              {
                cost_model: provCostModels,
              }
            )}
          />
        ) : null;
      const cellName = (
        <div key={providerData.uuid}>
          {providerData.name} {warningIcon}
        </div>
      );
      return {
        cells: [
          cellName,
          provCostModels ||
            this.props.intl.formatMessage({
              id: 'cost_models_wizard.source_table.default_cost_model',
            }),
        ],
        selected: isSelected,
      };
    });
    const sourceTypeMap = {
      'OpenShift Container Platform': 'OCP',
      'Microsoft Azure': 'AZURE',
      'Amazon Web Services': 'AWS',
    };

    const source_type = sourceTypeMap[costModel.source_type];
    return (
      <>
        <AssignSourcesToolbar
          filter={{
            onClearAll: () =>
              this.props.fetch(
                `source_type=${source_type}&limit=${this.props.pagination.perPage}`
              ),
            onRemove: (category, chip) => {
              const newQuery = removeMultiValueQuery({
                name: this.props.query.name
                  ? this.props.query.name.split(',')
                  : [],
              })(category, chip);
              this.props.fetch(
                `source_type=${source_type}${
                  newQuery.name ? `&name=${newQuery.name.join(',')}` : ''
                }&offset=0&limit=${this.props.pagination.perPage}`
              );
            },
            query: {
              name: Boolean(this.props.query.name)
                ? this.props.query.name.split(',')
                : [],
            },
          }}
          searchInputProps={{
            id: 'assign-sources-modal-toolbar',
            onChange: value =>
              this.props.updateFilter({
                currentFilterType: 'name',
                currentFilterValue: value,
              }),
            value: this.props.currentFilter.value,
            onSearch: _evt => {
              const curQuery = Boolean(this.props.query.name)
                ? this.props.query.name.split(',')
                : [];
              const newQuery = addMultiValueQuery({ name: curQuery })(
                'name',
                this.props.currentFilter.value
              );
              this.props.fetch(
                `source_type=${source_type}&name=${newQuery.name.join(
                  ','
                )}&limit=${this.props.pagination.perPage}&offset=0`
              );
            },
          }}
          paginationProps={{
            itemCount: this.props.pagination.count,
            perPage: this.props.pagination.perPage,
            page: this.props.pagination.page,
            onPerPageSelect: (_evt, newPerPage) => {
              this.props.fetch(
                `source_type=${source_type}&limit=${newPerPage}&offset=0&${
                  this.props.query.name ? `name=${this.props.query.name}` : ''
                }`
              );
            },
            onSetPage: (_evt, newPage) => {
              this.props.fetch(
                `source_type=${source_type}&limit=${
                  this.props.pagination.perPage
                }&offset=${this.props.pagination.perPage * (newPage - 1)}&${
                  this.props.query.name ? `name=${this.props.query.name}` : ''
                }`
              );
            },
          }}
        />
        {sources.length > 0 && (
          <Table
            aria-label={this.props.intl.formatMessage({
              id: 'cost_models_details.add_source',
            })}
            onSelect={(_evt, isSelected, rowId) => {
              if (rowId === -1) {
                const newState = this.props.providers.reduce((acc, cur) => {
                  return {
                    ...acc,
                    [cur.uuid]: { selected: isSelected, meta: cur },
                  };
                }, {});
                this.props.setState(
                  newState as {
                    [uuid: string]: { selected: boolean; meta: Provider };
                  }
                );
                return;
              }
              this.props.setState({
                ...this.props.checked,
                [this.props.providers[rowId].uuid]: {
                  selected: isSelected,
                  meta: this.props.providers[rowId],
                },
              });
            }}
            cells={[
              this.props.intl.formatMessage({ id: 'filter.name' }),
              this.props.intl.formatMessage({
                id: 'cost_models_wizard.source_table.column_cost_model',
              }),
            ]}
            rows={sources}
          >
            <TableHeader />
            <TableBody />
          </Table>
        )}
        {sources.length === 0 && (
          <EmptyFilterState
            subTitle={this.props.intl.formatMessage({
              id: 'no_match_found_state.desc',
            })}
          />
        )}
        <DataToolbar id="costmodels_details.sources_pagination_datatoolbar">
          <DataToolbarContent
            style={{ flexDirection: 'row-reverse' }}
            aria-label={this.props.intl.formatMessage({
              id: 'cost_models_details.sources_pagination_bottom',
            })}
          >
            <DataToolbarGroup>
              <DataToolbarItem>
                <Pagination
                  itemCount={this.props.pagination.count}
                  isDisabled={this.props.isLoadingSources}
                  perPage={this.props.pagination.perPage}
                  page={this.props.pagination.page}
                  onPerPageSelect={(_evt, newPerPage) => {
                    this.props.fetch(
                      `limit=${newPerPage}&offset=0&${
                        this.props.query.name
                          ? `name=${this.props.query.name}`
                          : ''
                      }`
                    );
                  }}
                  onSetPage={(_evt, newPage) => {
                    this.props.fetch(
                      `limit=${this.props.pagination.perPage}&offset=${this
                        .props.pagination.perPage *
                        (newPage - 1)}&${
                        this.props.query.name
                          ? `name=${this.props.query.name}`
                          : ''
                      }`
                    );
                  }}
                />
              </DataToolbarItem>
            </DataToolbarGroup>
          </DataToolbarContent>
        </DataToolbar>
      </>
    );
  }
}

export default injectIntl(
  connect(
    createMapStateToProps(state => {
      return {
        currentFilter: {
          name: sourcesSelectors.currentFilterType(state),
          value: sourcesSelectors.currentFilterValue(state),
        },
      };
    }),
    {
      updateFilter: sourcesActions.updateFilterToolbar,
    }
  )(AddSourcesStep)
);
