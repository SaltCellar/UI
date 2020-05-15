import {
  Alert,
  Grid,
  GridItem,
  Title,
  TitleSize,
} from '@patternfly/react-core';
import { CostModel } from 'api/costModels';
import { Provider } from 'api/providers';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { costModelsSelectors } from 'store/costModels';

interface ReviewDetailsProps extends WrappedComponentProps {
  costModel: CostModel;
  checked: { [uuid: string]: { selected: boolean; meta: Provider } };
  updateApiError: string;
  isUpdateProcessing: boolean;
}

const ReviewDetails: React.SFC<ReviewDetailsProps> = ({
  intl,
  costModel,
  checked,
  updateApiError,
  isUpdateProcessing,
}) => {
  return (
    <>
      {Boolean(updateApiError) && (
        <Alert variant="danger" title={`${updateApiError}`} />
      )}
      <Title size={TitleSize.md}>
        {intl.formatMessage({ id: 'cost_models_details.add_source_desc' })}
      </Title>
      <Grid>
        <GridItem span={4}>
          {intl.formatMessage({
            id: 'cost_models_wizard.general_info.name_label',
          })}
        </GridItem>
        <GridItem span={8}>{costModel.name}</GridItem>
        <GridItem span={4}>
          {intl.formatMessage({
            id: 'cost_models_wizard.general_info.description_label',
          })}
        </GridItem>
        <GridItem span={8}>{costModel.description}</GridItem>
        <GridItem span={4}>
          {intl.formatMessage({ id: 'cost_models_wizard.steps.sources' })}
        </GridItem>
        <GridItem span={8}>
          {Object.keys(checked)
            .filter(uuid => checked[uuid].selected)
            .map(uuid => checked[uuid].meta.name)
            .join(', ')}
        </GridItem>
      </Grid>
      {isUpdateProcessing &&
        intl.formatMessage({ id: 'cost_models_wizard.inprogress_message' })}
    </>
  );
};

export default connect(
  createMapStateToProps(state => {
    return {
      updateApiError: costModelsSelectors.updateError(state),
      isUpdateProcessing: costModelsSelectors.updateProcessing(state),
    };
  })
)(injectIntl(ReviewDetails));
