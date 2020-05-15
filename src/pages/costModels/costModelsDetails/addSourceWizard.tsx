import {
  Alert,
  Button,
  Modal,
  Split,
  SplitItem,
  Stack,
  StackItem,
  Title,
} from '@patternfly/react-core';
import { CostModel } from 'api/costModels';
import { Provider } from 'api/providers';
import { parseApiError } from 'pages/costModels/createCostModelWizard/parseError';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { FetchStatus } from 'store/common';
import { createMapStateToProps } from 'store/common';
import { costModelsSelectors } from 'store/costModels';
import { sourcesActions, sourcesSelectors } from 'store/sourceSettings';
import AddSourceStep from './addSourceStep';

interface AddSourcesStepState {
  checked: { [uuid: string]: { selected: boolean; meta: Provider } };
}

interface Props extends WrappedComponentProps {
  onClose: () => void;
  onSave: (sources_uuid: string[]) => void;
  isOpen: boolean;
  costModel: CostModel;
  fetch: typeof sourcesActions.fetchSources;
  providers: Provider[];
  isLoadingSources: boolean;
  isUpdateInProgress: boolean;
  fetchingSourcesError: string;
  query: { name: string; type: string; offset: string; limit: string };
  pagination: { page: number; perPage: number; count: number };
  updateApiError: string;
}

const sourceTypeMap = {
  'OpenShift Container Platform': 'OCP',
  'Microsoft Azure': 'AZURE',
  'Amazon Web Services': 'AWS',
};

class AddSourceWizardBase extends React.Component<Props, AddSourcesStepState> {
  public state = { checked: {} };
  public componentDidMount() {
    const {
      costModel: { source_type },
      fetch,
    } = this.props;
    const sourceType = sourceTypeMap[source_type];
    fetch(`type=${sourceType}&limit=10&offset=0`);
  }
  public componentDidUpdate(prevProps) {
    if (
      prevProps.isLoadingSources === true &&
      this.props.isLoadingSources === false
    ) {
      const initChecked = this.props.providers.reduce((acc, curr) => {
        return {
          ...acc,
          [curr.uuid]: {
            selected: this.props.costModel.sources.some(
              p => p.uuid === curr.uuid
            ),
            meta: curr,
          },
        };
      }, {}) as { [uuid: string]: { selected: boolean; meta: Provider } };
      this.setState({ checked: initChecked });
    }
  }
  public render() {
    const {
      isUpdateInProgress,
      onClose,
      isOpen,
      onSave,
      intl,
      costModel,
      updateApiError,
    } = this.props;
    return (
      <Modal
        isFooterLeftAligned
        isLarge
        isOpen={isOpen}
        title={intl.formatMessage(
          { id: 'cost_models_details.assign_sources' },
          {
            cost_model: this.props.costModel.name,
          }
        )}
        onClose={onClose}
        actions={[
          <Button
            key="cancel"
            variant="link"
            isDisabled={isUpdateInProgress}
            onClick={onClose}
          >
            {intl.formatMessage({ id: 'cost_models_wizard.cancel_button' })}
          </Button>,
          <Button
            key="save"
            isDisabled={isUpdateInProgress || this.props.isLoadingSources}
            onClick={() => {
              onSave(
                Object.keys(this.state.checked).filter(
                  uuid => this.state.checked[uuid].selected
                )
              );
            }}
          >
            {intl.formatMessage({ id: 'cost_models_details.action_assign' })}
          </Button>,
        ]}
      >
        <Stack gutter="md">
          <StackItem>
            {Boolean(updateApiError) && (
              <Alert variant="danger" title={`${updateApiError}`} />
            )}
          </StackItem>
          <StackItem>
            <Split gutter="md">
              <SplitItem>
                <Title size="md">
                  {intl.formatMessage({
                    id: 'cost_models_wizard.general_info.source_type_label',
                  })}
                </Title>
              </SplitItem>
              <SplitItem>{this.props.costModel.source_type}</SplitItem>
            </Split>
          </StackItem>
          <StackItem>
            <AddSourceStep
              fetch={this.props.fetch}
              fetchingSourcesError={this.props.fetchingSourcesError}
              isLoadingSources={this.props.isLoadingSources}
              providers={this.props.providers}
              pagination={this.props.pagination}
              query={this.props.query}
              costModel={costModel}
              checked={this.state.checked}
              setState={newState => {
                this.setState({ checked: newState });
              }}
            />
          </StackItem>
        </Stack>
      </Modal>
    );
  }
}

export default injectIntl(
  connect(
    createMapStateToProps(state => {
      return {
        pagination: sourcesSelectors.pagination(state),
        query: sourcesSelectors.query(state),
        providers: sourcesSelectors.sources(state),
        isLoadingSources:
          sourcesSelectors.status(state) === FetchStatus.inProgress,
        isUpdateInProgress: costModelsSelectors.updateProcessing(state),
        updateApiError: costModelsSelectors.updateError(state),
        fetchingSourcesError: sourcesSelectors.error(state)
          ? parseApiError(sourcesSelectors.error(state))
          : '',
      };
    }),
    {
      fetch: sourcesActions.fetchSources,
    }
  )(AddSourceWizardBase)
);
